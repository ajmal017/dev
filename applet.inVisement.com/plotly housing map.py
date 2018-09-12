
import plotly
import plotly.plotly as py
import plotly.figure_factory as ff
import numpy as np
import pandas as pd

housing = pd.read_csv(config['map path'] + "buy or rent.csv")

housing = housing.query('date == "2018-07-31"')

fips= pd.to_numeric(housing['fips'], downcast='integer')
values = housing['expected investment annual return'] * 100
states = housing['state']

scope = states.isin(['WA'])
fips = fips[scope]
values = values[scope]


#colorscale = ["#171c42","#223f78","#1267b2","#4590c4","#8cb5c9","#b6bed5","#dab2be",
#              "#d79d8b","#c46852","#a63329","#701b20","#3c0911"] # Create a colorscale
my_colorscale = ['green', 'limegreen', 'palegreen', 'yellow', 'orange', 'red', 'brown']
my_colorscale.reverse()

endpoints = list(np.linspace(5, 10, len(my_colorscale) - 1)) # Identify a suitable range for your data

fig = ff.create_choropleth(
    fips=fips, values=values, 
    scope = ["WA"],
    show_state_data=True, 
    state_outline = {'color': 'black', 'width': 1},
    binning_endpoints=endpoints, # If your values is a list of numbers, you can bin your values into half-open intervals
    county_outline={'color': 'grey', 'width': 1}, 
    legend_title='% Expected Return', 
    title='Percent of Expected Return for buying Home',
    colorscale = my_colorscale #colorscales
)

plotly.offline.plot(fig, filename="buy or rent.html")




a = plotly.offline.plot(fig, include_plotlyjs=False, output_type='div')


