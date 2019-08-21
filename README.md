# Stream Two Interactive Development Project

![dashboard image](../static/images/Dashboard_screenshot.png)

#### This is my milestone project dashboard that uses a dataset sourced from kaggle to represent trends in mental health.

#### The dashboard consists of 3 data selections, 4 number displays and 9 graphs, created using Javascript, DC, D3, and Crossfilter.


# UX



The design of this dashboard was used to provide the user with a practical and pragmatic way to investigate trends into mental health statistics. I opted for a simple style in order to make the information as easy to digest as possible.

Users can filter using one of the drop down selects at the top of the dashboard, or use one of the graphs in the main body.

Content has been split into 4 categories - Respondent information, Breakdown of groups, Treatment patterns and Implications.

There are a number of potential user groups for the dashboard.

1. Mental health professionals who are looking for additional insight into mental health trends.
2. Students who are studying related topics.
3. People interested in or currently working in the tech industry and are looking to find out more about company cultures, attitudes or benefits.

[Original mockup here](https://git)

# Features

# Existing Features

Code is called in an IIFE in order to preserve privacy and security.

There are three data selectors in the introduction section that provide users an easy way to filter the data by Company type, Gender or Date.

There are 4 number displays that adjust according to filters applied and show the total number of records being filtered, average age for male and female respondents and also the number of tech companies in the current filter.
If no filters are selected then these numbers will be the overall numbers for the entire dataset.

In the breakdown section there are two pie charts to display breakdowns by gender and country. In addition there is a derived data bar graph that shows the age groupings.

The treatment section is made up of three graphs. 'Treatment by Gender' shows the varying degrees of treatment by gender group.
'Treatment Levels' shows the total number of people who have and havent requested treatment for mental health issues in the past.
'Family History' shows the levels of mental health issues respondents had in their family history.

The impact section uses two stacked bar grpahs to illustrate attitudes towards discussing health issues with employers.


## Technologies Used

HTML
CSS 
Bootstrap (version 4.7.0)
D3.js (version 3.5.17)
JavaScript
Dc.js (version 2.1.8)
Crossfilter.js (version 1.3.12)
Queue.js (version 1.0.7)
Jquery (version 3.3.1)

# Testing

## Responsiveness

The project was developed with a 'mobile-first' philosophy in mind and was used on a variety of devices to test its responsiveness.

Devices used to test were:

1. Samsung Galaxy S5
2. Apple iPhone 7
3. Apple iPhone X
4. Apple iPad Pro
5. Apple MacBook Pro

The dashboard was able to be displayed as intended on all devices and browsers, with full responsiveness.

## User Stories

### Mental Health Professional

A user can use the dashboard to investigate differences between male and female treatment trends, overall levels of treatment and
any correlation between having a family history of mental illness and how that relates to current mental health.


### Students

A user can look at overall numbers for the database to determine suitability for academic work. In addition, they can easily filter the dashboard to drill
down into further levels of detail based on gender, kind of company or date. They can also use the dashboard to see correlations between differences in the data.

### Employees / Employers 

A user can use the dashboard to easily determine attitudes towards mental health in tech companies. In particular, can they expect to have a welness programme in place 
or how do current employees of tech companies view the potential impact on physical and mental health of raising an issue with their employer.

They can also look at their respective countries using the country breakdown and see how data compares to others.


# Deployment

The project is hosted in my [GitHub repository](https://martingr1.github.io/mhdashboard/).

The project was developed using AWS Cloud 9 IDE.

Some file paths were changed following deployment to GitHub Pages.

# Credits

## Content

Inspiration for layout and general styling was taken from the dashboard created by Dave Laffan - [Dave's Superhero Dashboard](https://steview-d.github.io/superhero-dashboard/) and also the dashboard created by Matt Bush - [Matt's London Dashboard](https://gitbush.github.io/london-boroughs/).

# Disclaimer

This website is for academic purposes only and is not affiliated with Kaggle or the original dataset.