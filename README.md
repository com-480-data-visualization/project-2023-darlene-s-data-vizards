# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Laurent Brock | 312072 |
| Ben Kriesel | |
| Cindy Tang | 315712 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (7th April, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset

> Find a dataset (or multiple) that you will explore. Assess the quality of the data it contains and how much preprocessing / data-cleaning it will require before tackling visualization. We recommend using a standard dataset as this course is not about scraping nor data processing.
>
> Hint: some good pointers for finding quality publicly available datasets ([Google dataset search](https://datasetsearch.research.google.com/), [Kaggle](https://www.kaggle.com/datasets), [OpenSwissData](https://opendata.swiss/en/), [SNAP](https://snap.stanford.edu/data/) and [FiveThirtyEight](https://data.fivethirtyeight.com/)), you could use also the DataSets proposed by the ENAC (see the Announcements section on Zulip).

### Problematic

> Frame the general topic of your visualization and the main axis that you want to develop.
> - What am I trying to show with my visualization?
> - Think of an overview for the project, your motivation, and the target audience.

The dataset we are going to be visualising for our project is that of "European Drug Development". It contains detailed detailed information about the medecine's name, date of release, if it was a new medecine or a generic medecine, what molecule it's based on, if it's similar to already existing other medication, manufacturing company, approval means and date, and many others.

This gives us a wealth of information on the drug market, what medecine was released and when, and more importantly how quickly "copycat" medecines are released after the 25 year patent lifespan expiry date, and others.
Certain medecines are released under a conditional marketing approval for exceptional circumstances. We may be able to correlate this with certain important events in history, such as the advent of AIDS or COVID.

Therefore, we are trying to show the global trends of the drug market worldwide, how its dynamics could potentially have changed, if the production of new molecules has increased or decreased, and whether global investment and development trends in the pharmaceutical industry follow disease prevalence, from the timespan of 1998-08-19 -> 2023-03-08, that the dataset covers.

Some of us in this group have been, or are still in SV. This topic is therefore quite close to home and could bring insights into how the industry has evolved recently. Our target audience would be students in medecine or biology, who wish to gain insights or easily-accessible statistics about the drug market.


### Exploratory Data Analysis

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

We convert some features such as the dates or the lists of categories into a an appropriate format to be able to handle them afterwards. We perform some basic statistics such as distributions to get insights about our data. Notably, our dataset is composed by 86% of human and 14% veterinary drugs. 

You can find the details in this [notebook](eda.ipynb). 

### Related work


> - What others have already done with the data?
> - Why is your approach original?
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

## Milestone 2 (7th May, 5pm)

**10% of the final grade**


## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

