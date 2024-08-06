from typing import List
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
    

class Scrape(BaseModel):

    url : str
    initialType : str
    initialClass: str
    params: List[str]
    param_names:List[str]
    headers : List[str]
    format:str
    num_start:int

    def initialize(self):
        # Initialize driver
        options = Options()
        options.add_argument('--headless')
        options.add_argument(f'--user-agent={self.headers[1]}')

        driver = webdriver.Chrome(options=options)
        driver.get(self.url)
        return driver
    
    def scroll_infinite_page(self, driver):
        last_height = driver.execute_script("return document.body.scrollHeight")
        while True:
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(1)  # Deal with loading
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height
    
        page_source = driver.page_source
        return page_source
    
    def find_param_values(self, page_source):
        names = [ ]
        types = [ ]
        found = [ ]
        sames = [ ]
        samples = BeautifulSoup(page_source, "html.parser")

        # Handle case for when class name for grid/table item isn't specified
        if self.initialClass == "":
            sample = samples.find_all(self.initialType)
        else:
            sample = samples.find_all(self.initialType, class_=self.initialClass)
        sample = sample[self.num_start] # Make this a changeable parameter

        #Find param values
        for param in self.params:
            html = f"""{sample}"""
            try:
                initial_index = html.index('>' + param + '<')
            except:
                print(f"First test for param {param} failed")
                try:
                    initial_index = html.index(param)
                except:
                    print(f"Second test failed")

            back = initial_index-1
            forward = initial_index+1
            res = None
            while True:
                if not "<" in html[back:initial_index]:
                    back -= 1
                if not ">" in html[initial_index:forward]:
                    forward += 1
                if "<" in html[back:initial_index] and ">" in html[initial_index:forward]:
                    reduced = html[back:forward]
                    i = reduced.index("class") + len("class=")
                    j = i+1

                    # Find Type
                    k = back + 1
                    while True:
                        if html[k] == ' ':
                            typ = html[back+1:k]
                            break
                        k += 1

                    #Find Class Name
                    while True:
                        if reduced[j] == "'" or reduced[j] == '"' or reduced[j] == " ":
                            res = reduced[i+1:j]
                            break
                        j += 1
                    if not res:
                        res = ' '
                    if res:
                        # Handle data that has the same class name
                        if res in names and not res in sames:
                            sames.append(res)
                            sames.append([names.index(res), len(names)])
                        elif res in sames:
                            check = sames.index(res) + 1
                            sames[check] = sames[check] + [len(names)]
                
                        # Append to all lists
                        types.append(typ)
                        names.append(res)
                        found.append(param)
                    break
        return types, names, found, sames
     
    def collect_data(self, page_source, names, types, sames):

        soup = BeautifulSoup(page_source, "html.parser")
        data = [[]] * len(names)

        # For tracking var_list searches
        valids = [ ]

        count = 0
        for item in soup.find_all(self.initialType, class_=self.initialClass)[self.num_start:4]:
            repeats = [ ]

            #Ensure sleep to provide sites from detecting scraping
            #time_sleep = random.choice(range(3,7))
            #time.sleep(time_sleep)
            #print(f"Sleeping for {time_sleep}")


            for i in range(len(names)):
                # Ensure repeats aren't done twice
                print(f"i: {i}")
                if i in repeats:
                    continue

                # Handle repeat class cases
                if names[i] in sames:
                    index = sames.index(names[i])
                    repeats = repeats + sames[index+1]

                    # For case when classes don't have name based on
                    # previous convention in function find_param_values()
                    if names[i] == ' ':
                        var_list = item.find_all(types[i])
                    else:
                        var_list = item.find_all(types[i], class_=names[i])

                    same_index = 0
                    for x in range(len(var_list)):
                        # Keep track of correct indexes for var_list
                        param_index = sames[index+1][same_index]
                        if var_list[x].text != '' and (self.validate_search(var_list[x].text, param_index) if count == 0 else self.validate_repeat_index(x, valids)):
                            
                            if count == 0 and x not in valids:
                                valids.append(x)

                            ind = sames[index+1][same_index]

                            # Ensure spaces between text and tag are gone
                            new_text = self.remove_text_space(var_list[x].text)

                            data[ind] = data[ind] + [new_text]
                            same_index += 1
                        #Ensure loop doesn't continue after vals are found
                        if same_index == len(sames[index+1]):
                            break

                    continue

                # Handle regular case
                else:
                    var = item.find_all(types[i], class_=names[i])

                    # Check for cases where unrelated tags have same class name
                    for v in var:
                        if v.text != '':

                            # Ensure spaces between text and tag are gone
                            new_v = self.remove_text_space(v.text)

                            data[i] = data[i] + [new_v]
                            break
            count += 1                   
        # Convert to np array
        print(data)     
        data = np.array(data)

        # Construct DF from numpy array
        df = pd.DataFrame(columns = self.param_names)
        for j in range(len(data[0])):
            c = [data[0][j]]
            for i in range(1, len(data)):
                c += [data[i][j]]
            df.loc[j] = c

        return df
    
    def return_csv(self, df, title:str):
        return df.to_csv(title)
    
    def return_json(self, df):
        return df.to_json()
    
    def return_xlsx(self, df, title:str):
        return df.to_excel(title)
    
    def remove_text_space(self, string):
        ns=""
        for i in range(len(string)):
            if(not string[i].isspace()) or ((1 <= i < len(string)-1) and not string[i-1].isspace() and not string[i+1].isspace()):
                ns+=string[i]
        return ns  
    
    def validate_search(self, html_text, param_index):
        if (self.remove_text_space(html_text) == self.params[param_index]):
            return True
        return False
    
    def validate_repeat_index(self, x, valids):
        if valids and x in valids:
            return True
        return False