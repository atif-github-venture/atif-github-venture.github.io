import pandas as pd


def group_by_date_us_covid():
    # should group by date and print fips, cases and death number as sum grouped by date
    df = pd.read_csv("data/covid-us-states.csv")
    df = df.groupby(pd.Grouper(key='date')).sum()
    df.to_csv('data/covid-us-states-group-date.csv')


def group_by_state_us_covid():
    data = ["state,cases,deaths"]
    # should get last highest case total per state
    df = pd.read_csv("data/covid-us-states.csv")
    state_list = sorted(set(df['state']))
    for item in state_list:
        temp_df = df[df['state'] == item]
        val = temp_df.sort_values(by=['date'], ascending=False).iloc[0]
        data.append(item + ',' + str(val.cases) + ',' + str(val.deaths))
    file = open('data/covid-us-states-group-state.csv', 'w')
    for line in data:
        file.write(line + '\n')
    file.close()

# group_by_date_us_covid()
# group_by_state_us_covid()
