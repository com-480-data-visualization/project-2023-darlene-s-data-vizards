# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Laurent Brock | 312072 |
| Ben Kriesel | 359730 | 
| Cindy Tang | 315712 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (7th April, 5pm)

### Dataset

The dataset we are working with is from the [European Medicines Agency](https://www.ema.europa.eu/en/about-us/what-we-do/authorisation-medicines). The EMA is tasked with assessing new medicine for the european union. For each medicine the agency tests a european public assessment report (EPAR) is published describing its evaluation results. Our dataset includes all EPAR results since 1995 and thus gives an insight about the european drug marked. The dataset is published by the EMA, a up-to-date version can be found [here](https://www.ema.europa.eu/en/medicines/download-medicine-data#european-public-assessment-reports-(epar)-section). 

To visualize the dataset will need some preprocessing. This is especially the case for making sensible groups of medicine, as the existing groups in the dataset are too detailed for our purpose.

### Problematic


The dataset we are going to be visualising for our project is that of "European Drug Development". It contains detailed information about the medecine's name, date of release, if it was a new medecine or a generic medecine, what molecule it's based on, if it's similar to already existing other medication, manufacturing company, approval means and date, and many others.

This gives us a wealth of information on the drug market, what medecine was released and when, and more importantly how quickly "copycat" medecines are released after the 25 year patent lifespan expiry date, and others.
Certain medecines are released under a conditional marketing approval for exceptional circumstances. We may be able to correlate this with certain important events in history, such as the advent of AIDS or COVID.

Therefore, we are trying to show the global trends of the drug market worldwide, how its dynamics could potentially have changed, if the production of new molecules has increased or decreased, and whether global investment and development trends in the pharmaceutical industry follow disease prevalence, from the timespan of 1998-08-19 -> 2023-03-08, that the dataset covers.

Some of us in this group have been, or are still in SV. This topic is therefore quite close to home and could bring insights into how the industry has evolved recently. Our target audience would be students in medecine or biology, who wish to gain insights or easily-accessible statistics about the drug market.

### Exploratory Data Analysis

Firstly, we convert some features such as the dates or the lists of categories into a an appropriate format before to handle them. Secondly, we perform some basic statistics such as plotting some distributions to get insights about our data. Thirdly, we organise our analysis by type of feature (categorical, boolean, time and numerical). Based on our analysis, the key observations we have made are as follows:
- The dataset is composed by 86% of `human` and 14% `veterinary` drugs. The category `veterinary` is then divided into different `species`.
- The distributions of drugs over active subtances, holder companies and pharmacotherapeutic groups are skewed (i.e. small values are common and large values are rare), as many natural phenomena. To deal with these categorical features at the later stage we can group the small categories together to improve readability of visualizations.
- The dataset contains different features referring to dates, such as `marketing_authorisation_date`, `date_of_refusal_of_marketing_authorisation`, `date_of_opinion`, `decision_date`, `first_published` and `revision_date`. 
  - The number of marketing authorisations, opinions and revisions tends to increase over years.
  - There is a peak of refusal of marketing authorisations in 2013.
  - There is a peak of first publications in 2018.
  - The distributions over the twelve months of the year is not uniform.
  - Thus, exploring further time series analysis could be interesting to get nice visualizations. We can observe the evolution of the structure of drug market over time by combining analysis with other categorical features.
  - It seems that there is a lack of data for years before 2005 and in 2023. We can only focus our further analysis on years between 2005 and 2022 to obtain consistent results.

Please refer to this [notebook](eda.ipynb) for more details.

### Related work

This data was discovered at the following [link](https://github.com/rfordatascience/tidytuesday/tree/master/data/2023/2023-03-14/) by us. There, is  mentioned that the European Drug Development dataset that they made available was first found and presented [here](https://towardsdatascience.com/dissecting-28-years-of-european-pharmaceutical-development-3affd8f87dc0) by Miquel Girotto.

In his short analysis, he talks about some of the points which interest us, like the fact that complex diseases are under still active development. However, there isn't a mention of any sort of time-based correlation with epidemic diseases, nor diversity in each field.

The analysis is rather short, and doesn't explore as many faces of the data as we plan to, like for example global industry in the past two decades. Additionally, none of the four plots provided are interactive.

The [HealthData](https://www.healthdata.org/gbd/data-visualizations) page has been quite intersting in order to find various types of visualisations. This [CDC](https://covid.cdc.gov/covid-data-tracker/#vaccinations_vacc-people-booster-percent-total) page presents data quickly and concisely, and this [Protein Atlas](https://www.proteinatlas.org/humanproteome/immune+cell) page compares and clusters data quite nicely.

This dataset is new to our group, and we have not used it in any other data-related courses, such as ADA.

## Milestone 2 (7th May, 5pm)

**10% of the final grade**

You can find the code to build our [website](https://com-480-data-visualization.github.io/project-2023-darlene-s-data-vizards/) in the `/docs` folder and our report [here](milestone2.pdf).


## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

