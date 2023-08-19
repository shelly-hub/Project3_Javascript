import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template
from config import user, password, host, port, db_name


# from config import base_url


#################################################
# Database Setup
# #################################################
#  pip install psycopg2
#  pip install Frozen-Flask


engine = create_engine(f"postgresql://{user}:{password}@{host}:{port}/{db_name}")
 

# # reflect an existing database into a new model
Base = automap_base()
# # reflect the tables
Base.prepare(autoload_with=engine)

# Save reference to the table
Meta= Base.classes.metadata
Stats = Base.classes.statistics
Sprites = Base.classes.sprites

# #################################################
# # Flask Setup
# #################################################
app = Flask(__name__)

# #################################################
# # Flask Routes
# #################################################

@app.route("/")
def index():
    return render_template("index.html")
    #  return (
    #      f"Available Routes:<br/>"
    #      f"/api/summary")

@app.route("/api/summary")
def summary():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of all metadata"""
    meta_results = session.query(Meta.name,Meta.order_id, Meta.weight, Meta.type_1, Meta.type_2).all()
    stats_results = session.query(Stats.name,Stats.order_id, Stats.hp, Stats.attack, Stats.defense, Stats.special_attack, Stats.special_defense, Stats.speed).all()
    sprites_results = session.query(Sprites.name,Sprites.order_id, Sprites.sprites_default, Sprites.sprites_shiny).all()

    session.close()

    # Convert list of tuples into normal list
    all_data = []
    for name, order_id, weight, type_1, type_2 in meta_results:
        meta_dict = {}
        meta_dict["Name"] = name
        meta_dict["id"] = order_id
        meta_dict["Weight"] = weight
        meta_dict["Type_1"] = type_1
        meta_dict["Type_2"] = type_2
        all_data.append(meta_dict)

    all_stats = []
    for name, order_id, hp, attack, defense, sp_attack, sp_defense,speed in stats_results:
        stats_dict = {}
        stats_dict["Name"] = name
        stats_dict["id"] = order_id
        stats_dict["Hp"] = hp
        stats_dict["Attack"] = attack
        stats_dict["Defense"] = defense
        stats_dict["Special_attack"] = sp_attack
        stats_dict["Special_defense"] = sp_defense
        stats_dict["Speed"] = speed
        all_stats.append(stats_dict)

    all_sprites = []
    for name, order_id, sprites_default, sprites_shiny in sprites_results:
        sprites_dict = {}
        sprites_dict["Name"] = name
        sprites_dict["id"] = order_id
        sprites_dict["Sprites_default"] = sprites_default
        sprites_dict["Sprites_shiny"] = sprites_shiny
        all_sprites.append(sprites_dict)

    return jsonify({"metadata": all_data, "statistics": all_stats, "sprites": all_sprites})
   
if __name__ == '__main__':
    app.run(debug=True)
