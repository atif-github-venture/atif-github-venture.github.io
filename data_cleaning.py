import pandas as pd

def group_by_date_us_covid():
    # should group by date and print fips, cases and death number as sum grouped by date
    df = pd.read_csv("data/covid-us-states.csv")
    df = df.groupby(pd.Grouper(key='date')).sum()
    df.to_csv('covid-us-states-group.csv')

group_by_date_us_covid()