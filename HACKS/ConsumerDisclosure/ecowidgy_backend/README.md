# Ecowidgy 

The latest documentation can be found in Gitbook: https://app.gitbook.com/@open-climate/s/open-climate-collabathon/~/drafts/-Lv7HHwHSEIqM6HoEKRJ/hacks/team-contributions/climate-prompts/consumer-disclosure-contracts-or-eco-widgy

Ecowidgy is an app that aims at showing the environmental effect of specific products. Originally conceived to operate as a browser plugin that would be enabled on online shopps. The idea was presented at the 2019 Collabathon for the Open Climate Platform. This repository contains the implementation of a back-end that can present the environmental impact of product categories, based on public Life Cycle Assessment databases.  The goal of the app is to inform the consumers about the environmental impact of the products they are buying and therefore to form a proper  

## Introduction

### Calculation of the environmental impact

The current version is based the OpenLCA database provided by the US Authorities. This database contains the byproducts of the manufacturing process for several product categories (e.g. soap products, dairy, telephony devices etc.). Among the byproducts one can see fluid, soil and air outputs, and most importantly the CO<sub>2</sub> emissions, which are considered crucial for their impact to the heating of the planet.
For many product categories, the database provides the mass of emissions (in kg) that were emitted proportionally to one dollar of product (based on the Producer Price Index of 2013).

In order to calculate the emissions of a product, we multiple the quantity or the mass (kg) of the product with the producer price of the product ($/kg) and with the emissions of the manufacturing per dollar of products (kg/$). For lack of official data on the producer price of the products, we provide rough estimates based on averaged consumer prices.

### Back-end functionality

The back-end includes a database which contains the information about the environmental impact of specific product categories. It also provides a search function for particular products given their name and can perform the calculation of the emissions given a specific amount of the product. A basic web interface is provided, whether there is the possibility of providing a web-service API for supporting the function of browser based widgets. 



## Installation

1. Download and install miniconda for the latest Python 3
2. Create an enable virtual environment
3. Install django
4. Download this code
5. Open a terminal in the root folder of the project and run the following commands:

    python manage.py migrate
    python manage.py createsuperuser
    python manage.py fetch_data
    python manage.py runserver 10000
    
6. Point your browser to http://localhost:10000 


### Development framework

The back-end is implemented in Python Django. 


## Creators 

(alphabetically)

* Eleftherios Avramidis
* Görkem Cetinkaya
* Alex Han
* Joshua Overbye
* Marc Shakory


