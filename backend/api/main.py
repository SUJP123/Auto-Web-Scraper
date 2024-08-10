from model import Scrape
from fastapi import FastAPI
from typing import Union
import os

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/scrape/forall")
def scrape_url_for_all(scrape: Scrape):
    driver = scrape.initialize()
    all_data = []
    past_valids =  []

    if scrape.scrape_type == "single-page":
        scrape.scroll_infinite_page(driver)

        items = scrape.find_items(driver)
        data = scrape.extract_params(items, True, past_valids)
        all_data.append(data)
    elif scrape.scrape_type == "multi-page":
        count = 0
        running = True
        past_items = None
        while running:
            if count == 0:
                first_page = True

            scrape.scroll_infinite_page(driver)

            items = scrape.find_items(driver)
            if past_items and past_items == items:
                break
            past_items = items.copy()
            data, valids = scrape.extract_params(items, first_page, past_valids)
            past_valids = valids
            all_data.append(data)
            buttons = scrape.find_buttons(driver)
            if not buttons:
                break
            for button_spec in buttons:
                # Might have to implement scroll until button is clickable function
                try:
                    scrape.click_button(driver, button_spec)
                except:
                    running = False
    
    # Combine all the data
    combined_data = [[]] * len(all_data[0])
    for index in range(len(all_data[0])):
        for sub_data in all_data:
            combined_data[index] = combined_data[index] + sub_data[index]

    df = scrape.convert_data_to_df(combined_data)

    # Close the driver
    driver.quit()

    # Return the data in the specified format
    if scrape.format == "csv":
        return scrape.return_csv(df, title="example.csv")
    elif scrape.format == "json":
        return scrape.return_json(df)
    else:
        return scrape.return_xlsx(df, title="example.xlsx")