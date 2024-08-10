from typing import List, Tuple
from typing import Union
from bs4 import BeautifulSoup
import selenium
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import requests
from fastapi import FastAPI
import time
import numpy as np
import pandas as pd
from pydantic import BaseModel
import random
import os
    

class Scrape(BaseModel):
    url: str

    # 0-> class for repeating section , 1-> tag_type for repeating section
    initial: List[str]

    # 0-> Value of First, 1-> Class Name, 2-> tag_type (div, str), 3-> Value_type (text, img, etc)
    params: List[List[str]] 

    # Column name for output
    columns : List[str]

    # Default for now, but implement specified and options after further research on headers
    headers: List[str]

    # 0-> Button class, 1-> Button Distinguishing feature type ex) title, id, 2-> Distinguishing value
    buttons: List[List[str]]

    # Scrape Type ex) Multi-Page, Single-Page, Repeated Button Clicks, etc...
    scrape_type: str

    # Return format
    format: str

    # start index for when values should be compared
    num_start: int

    def initialize(self):
        options = Options()
        options.add_argument('--headless')
        options.add_argument(f'--user-agent={self.headers[1]}')
        driver = webdriver.Chrome(options=options)
        driver.get(self.url)
        driver.maximize_window()
        return driver

    def scroll_infinite_page(self, driver):
        last_height = driver.execute_script("return document.body.scrollHeight")
        while True:
            driver.execute_script("window.scrollTo(0, 100);")
            time.sleep(1)
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

    def find_items(self, driver):

        soup = BeautifulSoup(driver.page_source, features='lxml')
        items = soup.find_all(self.initial[1], class_=self.initial[0])
        return items[self.num_start:]

    def extract_params(self, items, first_page: bool, past_valids):

        # Initialize arrays from params
        first_vals = [x[0] for x in self.params]
        names = [x[1] for x in self.params]
        tag_types = [x[2] for x in self.params]
        val_types = [x[3] for x in self.params]

        # Past valids to ensure new page doesn't reset valids
        valids = past_valids

        # Initialize Data Array
        data = [[]] * len(names)

        count = 0
        for item in items:
            for index in range(len(names)):
                outs = item.find_all(tag_types[index], class_=names[index])
                # Find indexes for find_all that correspond to type wanted
                if count == 0 and first_page:
                    valid_index = self.find_valid_index(outs, first_vals[index], val_types[index])
                    valids.append(valid_index)
                
                out_index = valids[index]

                # Once indexes are found
                output = self.remove_text_space(outs[out_index].text) if val_types[index] == "text" else outs[out_index][val_types[index]]
                data[index] = data[index] + [output]
            count += 1
        return data, valids

    def find_valid_index(self, outs, value, val_type):
        for index in range(len(outs)):
            if val_type == "text":
                if self.remove_text_space(outs[index].text) == value:
                    return index
            elif outs[index][val_type] == value:
                return index
    
    def find_buttons(self, driver):
        soup = BeautifulSoup(driver.page_source, features='lxml')
        found_buttons = []
        for button_spec in self.buttons:
            buttons = soup.find_all('button', class_=button_spec[0])
            for button in buttons:
                if button.get(button_spec[1]) == button_spec[2]:
                    found_buttons.append((button_spec[0], button_spec[1], button_spec[2]))
        return found_buttons

    def click_button(self, driver, button_spec):
        button_class, button_attr, button_value = button_spec

        # Buttons may share the same class, commonly done in htmls
        buttons = driver.find_elements(By.CLASS_NAME, button_class)

        # Isolate wanted button by distinguishing feature
        for button in buttons:
            if button.get_attribute(button_attr) == button_value:
                button.click()
                time.sleep(2)  # Wait for the page to load
                return 

    def convert_data_to_df(self, data):
        print(data)
        df = pd.DataFrame({self.columns[i]: data[i] for i in range(len(data))})
        return df

    def return_csv(self, df, title: str):
        return df.to_csv(title)

    def return_json(self, df):
        return df.to_json()

    def return_xlsx(self, df, title: str):
        return df.to_excel(title)

    def remove_text_space(self, string):
        return "".join([c for i, c in enumerate(string) if not c.isspace() or (1 <= i < len(string) - 1 and not string[i - 1].isspace() and not string[i + 1].isspace())])