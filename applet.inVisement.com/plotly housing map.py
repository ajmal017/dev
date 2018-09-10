import pandas as pd
import plotly.plotly as py
import plotly.figure_factory as ff

fips = ['06021', '06023', '06027',
        '06029', '06033', '06059',
        '06047', '06049', '06051',
        '06055', '06061']
values = range(len(fips))

fig = ff.create_choropleth(fips=conda install -c conda-forge geopandasfips, values=values)
py.iplot(fig, filename='choropleth of some cali counties - full usa scope')


