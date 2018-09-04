'''

Applet to calculate buy or rent .
main input

Building = 50k + sqfeed * 100
Land = Price - Building

Rent = Price*mortgage_rate 
        + depreciation_rate*min(Building, Price) 
        - growth * Land 
        + Price*tax 
        - (Price - 24k) * tax_braket
        + Price * mortgage_insurance

'''

import pandas as pd        

zillow = {
        "zipcode_data": {
                "source": "http://files.zillowstatic.com/research/public/Zip.zip",
                "destination": "archive.inVisement.com/zillow/"
        },
        "zipcode_datasets": {
                "rent": {
                        "source": "Zip/Zip_Zri_AllHomes.csv",
                        "destination": "data.inVisement.com/zipcode indicators/rent.csv",
                },
                "house price": {
                        "source": "Zip/Zip_Zhvi_AllHomes.csv",
                        "destination": "data.inVisement.com/zipcode indicators/house price.csv",
                }
        },
        "housing_table": {
                "destination": "data.inVisement.com/zipcode indicators/housing.csv"
        }
}

def fetch ():
        import requests, zipfile, io
        r = requests.get(zillow['zipcode_data']['source'])
        r.raise_for_status()
        z = zipfile.ZipFile(io.BytesIO(r.content))
        z.extractall(zillow['zipcode_data']['destination'])

def extract ():
        for indicator, path in zillow['zipcode_datasets'].items():
                table = pd.read_csv(zillow['zipcode_data']['destination']+path['source'])
                zipcode_col = ['RegionName']
                month_regex = "[0-9]{4}-[0-9]{2}"
                table = (table
                        .set_index(zipcode_col)
                        .rename_axis('zipcode')
                        .filter(regex=month_regex)
                        .stack()
                        .reset_index()
                )
                table.columns = ['zipcode', 'month', indicator]
                table.to_csv (path['destination']  , index=False)

def create_housing_table ():
        rent = pd.read_csv(zillow['zipcode_datasets']['rent']['destination'])
        price = pd.read_csv(zillow['zipcode_datasets']['house price']['destination'])
        table = pd.merge(rent, price, on=['zipcode', 'month'])
        #current_dataset = dataset[dataset['month']==dataset['month'].max()]
        table.to_csv(zillow['housing_table']['destination'], index=False)


''' calc the home price for each zipcode '''

