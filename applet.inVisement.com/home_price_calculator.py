'''
Web applet to calculate to buy or rent.
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


def expected_rent (zipcode, sqfeet, ) {

}


import pandas as pd

property_tax = pd.read_excel("~/Downloads/property_tax.xls", sheet_name="AL")

a = pd.read_csv("~/Downloads/property_tax - AL.csv")

