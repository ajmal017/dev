
import plotly
import plotly.figure_factory as ff
import numpy as np
import pandas as pd

id_col = "FIPS"
value_col = "Net Annual Return"
state_col = "State"
input_file = config["map path"] + "latest housing valuation.csv"
output_file = "housing annual return.html"
output_folder = config['chart path']
red_to_green = [
                'rgb(150, 0, 0)', 'rgb(250, 0, 0)', 
                'rgb(250, 150, 0)', 'rgb(250, 250, 0)', 'rgb(150, 250, 0)',
                'rgb(0, 250, 0)', 'rgb(0, 150, 0)'
                ]


housing = pd.read_csv(input_file)
#fips= pd.to_numeric(housing['fips'], downcast='integer')
#states = housing[state_Col].tolist()

lower_bound = round(housing[value_col].quantile(.1))
upper_bound = round(housing[value_col].quantile(.9))

endpoints = list(np.linspace(lower_bound, upper_bound, len(red_to_green) - 1)) 

fig = ff.create_choropleth(
    fips = housing[id_col], 
    values = housing[value_col], 
    scope = ['usa'],
    #show_state_data=True, 
    state_outline = {'color': 'black', 'width': 1},
    binning_endpoints = endpoints, # If your values is a list of numbers, you can bin your values into half-open intervals
    county_outline = {'color': 'grey', 'width': 1},
    showlegend = True, 
    #legend_title='% Total Economic Gain', 
    title = 'Total Economic Gain by County <br>if you buy a house and pay mortgage',
    colorscale = red_to_green #colorscales
)

fig['layout']['legend'].update({'y': .4, 'x': .8})

usa_plot = plotly.offline.plot(fig, 
    #filename= config['chart path'] + "usa housing valuation.html", 
    #image="jpeg", image_width="100", image_height="800", image_filename="inVisement plot",
    output_type="div", show_link=False, include_plotlyjs=False, auto_open=False
)

f = open(output_folder + "usa " + output_file, "w")
f.write(usa_plot)
f.close()

for state in housing[state_col].unique():
    state_housing = housing[housing[state_col]==state]
    fig = ff.create_choropleth(
        fips = state_housing[id_col], 
        values = state_housing[value_col], 
        scope = [state],
        state_outline = {'color': 'black', 'width': 1},
        binning_endpoints = endpoints, 
        county_outline = {'color': 'grey', 'width': 1},
        showlegend = False, 
        #title='Total Economic Gain by County <br>if you buy a house and pay mortgage',
        colorscale = red_to_green
    )
    state_plot = plotly.offline.plot(fig, 
        #filename = output_folder + state + " " + output_file, 
        output_type="div", show_link=False, include_plotlyjs=False, auto_open=False
    )
    f = open(output_folder + state + " " + output_file, 'w')
    f.write(state_plot)
    f.close()
pass
