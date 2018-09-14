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

import datetime, pandas as pd, numpy as np

pmi_rate = 0.01 # private mortgage insurance rate
tax_rate = 0.30 # federal tax bracket rate
depreciation_rate = 0.03 # home depreciation rate for base home
standard_tax_deduction = 24000 
max_mortgage_credit = 1000000 # maximum allowance for tax deduction on mortgage

def housing_valuation (base_quantile=0.3):
    price = pd.read_csv(config['map path']+"house price by county.csv", dtype=str)
    price['house price'] = pd.to_numeric(price['house price'])
    price['fips'] = price['state fips'].str.zfill(2) + price['county fips'].str.zfill(3)
    price = price.filter(['fips', 'state', 'county', 'date', 'house price'])

    rent = pd.read_csv(config['map path']+"rent by county.csv", dtype=str)
    rent['rent'] = pd.to_numeric(rent['rent']) * 12 # convert to annual
    rent['fips'] = rent['state fips'].str.zfill(2) + rent['county fips'].str.zfill(3)
    rent = rent.filter(["fips", "date", "rent"])

    rate = (pd.read_csv(config['macro path']+"mortgage rate 30 year fixed.csv")
        .set_index('date')
        .rename(columns = {"mortgage rate 30 year fixed": "rate"})
        .filter(["rate"])
    )
    rate = rate/100
    rate.index = pd.to_datetime(rate.index)

    average_growth = (
        pd.read_csv (config['macro path']+"nominal gdp growth.csv", index_col="date")#["nominal gdp growth"]
        .rename(columns = {"nominal gdp growth": "growth"})
        .sort_index()
        .filter(["growth"])
        .rolling(80)
        .mean() # moving average of nominal growth with 80 quarters
    )
    average_growth = average_growth/100
    average_growth.index = pd.to_datetime(average_growth.index)

    #fips_to_zipcode = pd.read_csv(config['map path']+"zipcode fips mapping.csv")
    property_tax = pd.read_csv(config['map path']+"property tax by fips.csv").filter(["fips", "property tax rate"])
    property_tax['fips'] = property_tax['fips'].astype(str).str.zfill(5)
    #property_tax_by_zipcode = pd.merge(fips_to_zipcode, property_tax, on=["fips"]).drop_duplicates(subset=['zipcode']).set_index(['zipcode'])['property tax rate']

    table = price.merge(rent, how="inner", on=["fips", "date"], suffixes=["", "2"]).sort_values("date")
    table['date'] = pd.to_datetime(table['date'])
    table = pd.merge_asof(table, average_growth, on="date", direction="backward")
    table = pd.merge_asof(table, rate, on="date", direction="backward")
    table = table.merge(property_tax, on="fips", how="left")
    quantiles = table[["house price", "rent", "date"]].groupby(["date"]).quantile(base_quantile)
    table = table.join(quantiles, on="date", how="left", rsuffix=" base")

    table = expected_home_price(table)
    table["total return"] = (table['expected house price'] - table['house price'])/table['house price']
    table['net annual return'] = table['total return'] * (table['rate']+pmi_rate)
    return table

def calculate_home_price (table):
    expected_price = (
            table['rent'] 
            + table['extra tax deduction'] * tax_rate
            - table['house price base']*depreciation_rate
        )/(
            table['rate']
            + pmi_rate
            + table['property tax rate']
            #+ depreciation_rate
            - table['rent growth']
        )
    return expected_price
    
def expected_home_price (table, a=1):
    table['rent growth'] = table['growth']*(table['rent']-table['rent base'])/table['rent']
    table['rent growth'][table['rent growth']<0] = 0 
    table['rent growth'] = a*table['rent growth']
    table['extra tax deduction'] = 0
    table['extra tax deduction'][
        table['house price'] * table['rate'] > standard_tax_deduction
        ] = table['house price'] * table['rate']
    table['extra tax deduction'][
        table['house price'] > max_mortgage_credit
    ] = max_mortgage_credit * table['rate'] - standard_tax_deduction
    table['expected house price'] = calculate_home_price(table)
    return table

def prune_and_save (housing_table):
    housing_table.to_csv(config["map path"] + "housing valuation.csv", index=False)
    name_change = {"fips": "FIPS", "state": "State", "county": "County", 
        "house price": "Average House Price", "rent": "Average Rent", 
        "property tax rate": "Property Tax Rate", "rent growth": "Expected Rent Growth",
        "expected house price": "Economic Value of Average Home",
        "total return": "Total Return",
        "net annual return": "Net Annual Return"}
    percentage_columns = ["property tax rate", "rent growth", "total return", "net annual return"]
    housing_table[percentage_columns] = (housing_table[percentage_columns] * 100).round(1)
    date = housing_table['date'].value_counts()
    max_date = date[date > 1000].index.max()
    return (housing_table
        .query('date == @max_date') 
        .filter(name_change.keys())
        .rename(columns = name_change)
        .to_csv(config["map path"] + "latest housing valuation.csv", index=False)
    )


housing_table = housing_valuation(0.1)
prune_and_save (housing_table)
#a = pd.read_csv(config['map path']+"buy or rent.csv")

#table.query('fips == "06075"').tail()[["fips", "county", "date", "house price", "rent", "rent growth", "expected home price", "expected return"]]
