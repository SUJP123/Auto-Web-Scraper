from model import Scrape
from fastapi import FastAPI
from typing import Union

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/scrape/forall")
def scrape_url_for_all(scrape : Scrape):

    driver = scrape.initialize()

    page_source = scrape.scroll_infinite_page(driver)

    types, names, found, sames = scrape.find_param_values(page_source)
    print(names)
    print(sames)

    print(f"Params that were found: {found}")

    df = scrape.collect_data(page_source, names, types, sames)

    if scrape.format == "csv":
        return scrape.return_csv(df, title="example")

    if scrape.format == "json":
        return scrape.return_json(df)

    return scrape.return_xlsx(df, title="example_sheet")
