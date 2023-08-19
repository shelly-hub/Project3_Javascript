# Project 3 - Interactive Pokemon Dashboard

Project 3 of the Data Visualisation & Analytics Bootcamp, Monash University

Data Source: https://pokeapi.co/
Accessed Date: 22 June 2023

## Summary
This project is an Interactive Dashboard built to clearly visualise and concisely communicate the statistics of each Pokemon, creating a comprehensive resource for all Pokemon trainers.

Pokémon are the unique and diverse creatures that inhabit the world of the Pokémon games. With over 1016 known species and more waiting to be discovered, Pokémon are renowned for their fantastic powers. But they all have one thing in common; their partnership with humans. Players of the Pokemon games hold the prestigious role of a ‘Pokemon Trainer’ and are tasked with the mission to travel across vast regions with their Pokémon allies. Along their travels, players battle their Pokemon against other trainers, competing in various leagues and tournaments to claim the title of ‘Champion’. This makes battling the most integral component to understand in any Pokemon game. Understanding how an individual Pokémon’s statistics and types compare against their potential opponents is integral to raising a team capable of becoming champion.

## Initial Data Cleaning
 - File: Pokemon_ETL.ipynb
 - Outputs: Resources > metadata.csv / sprites.csv / statistics.csv

Using Jupyter Notebook and Python, including Python libraries Pandas, NumPy, Requests and PPrint, the data for each pokemon was retrieved via an API call to the data source PokeAPI. 
The API JSON formatted data was filtered and transformed into Pandas data frames before being exported as CSV files. 

## Storing the Data
 - File: pokemon_schema.sql

An SQL database was constructed in pgAdmin4, with 3 schemas produced using the supplied sql file. Each CSV file was imported into its relevant schema.

For first user, these steps are needed to run the whole code:
 - Create database name as: pokemon_db
 - open pokemon_schema file
 - Run the codes under heading “CREATE TABLE”
 - Refresh database (otherwise errors occurred)
 - Import data from 3 CSV files into 3 tables in SQL tool
 - Run the last bottom scripts to ensure tables are imported successfully into database

## Connecting the Data
 - Files: app.py, config.py

The SQL schemas were connected to Python using Python Flask. 2 app routes were created:
Index - Linked to our index.html template, the home of our interactive dashboard
Summary - Linked to our SQL schemas, which were jsonified and combined into a single API url using SQLAlchemy.

For first user, ensure these steps are followed:
 - Install "pip install psycopg2" in their local terminal


The config.py file houses the fields required for connecting to SQL; please ensure you update your SQL username and , password, port number, and host  fields to proceed. 
To run the route connected to Javascript & HTML:
 - Ensure Flask has imported render_template, and index.html file is stored in folder name “templates”
 - Ensure terminal is within dev or other specific environment
 - Ensure terminal directory is changed to where app.py file is located
To connect, run “python app.py” in the terminal 

## Presenting the Data
 - Files: app.py, templates > index.html, static > summary.js

By running the app.py file in your terminal, you will produce a link to open and use our Interactive Dashboard, hosting the following features:
 - Pokemon Info: Characteristics of the species; Name, Number ID, Weight, Type 1 and if applicable, Type 2.
 - Pokemon Sprite: Official artwork of the default pokemon. Using the dropdown menu, you can toggle between viewing the default pokemon sprite, and the shiny version of the pokemon sprite.
 - Radar Chart: Plot displaying the pokemon’s individual base statistics on 6 axis; Attack, Defense, Special Attack (Sp.Atk), Special Defense (Sp.Def), Health Points (HP) and Speed.
 - Comparison of Base Stats (Boxplots): Plot that highlights the pokemon’s statistics in the context of all potential opponents. Your pokemon, displayed as a bright red marker, is compared against the median and spread of all other Pokemon species across each of the 6 axis.
 - Effectiveness of Attacks (Heatmap): Plot that highlights the effectiveness of your pokemon’s type attacks against the potential types of all other opponents.
   - 0 = No effect; no damage can be done to this type
   - 0.5 = Not very effective; your pokemon does ½ its usual damage to opponents of this type
   - 1.0 = Your pokemon does its usual damage to opponents of this type
   - 2.0 = Super-Effective; your pokemon does ½ its usual damage to opponents of this type
Searching for a new pokemon is as easy as typing the pokemon’s name in the text search field and clicking the submit button. If a match is found, all visualisations will refresh with this pokemon’s statistics. If a match is not found, an error message will display. Please check your spelling and try again. 

## Packages / Resources Used:
 - Pandas - https://pandas.pydata.org/
 - NumPy - https://numpy.org/
 - requests - https://pypi.org/project/requests/
 - pprint - https://github.com/python/cpython/blob/3.11/Lib/pprint.py
 - Sqlalchemy - https://www.sqlalchemy.org/
 - Python Flask API - https://github.com/pallets/flask
 - Bootstrap CSS Stylesheet - https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css
 - D3.json - https://d3js.org/d3.v5.min.js
 - Plotly.js - https://cdnjs.cloudflare.com/ajax/libs/plotly.js/1.33.1/plotly.min.js
 - ScrollReveal.js - https://unpkg.com/scrollreveal
