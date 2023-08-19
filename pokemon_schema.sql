DROP DATABASE IF EXISTS pokemon_db;
CREATE DATABASE pokemon_db;

-- Change connection to pokemon_db

DROP TABLE IF EXISTS sprites;
DROP TABLE IF EXISTS statistics;
DROP TABLE IF EXISTS metadata;


CREATE TABLE metadata (
			name VARCHAR (255) NOT NULL,
			order_id INT PRIMARY KEY,
			weight INT,
			type_1 VARCHAR (255) NOT NULL,
			type_2 VARCHAR (255));

CREATE TABLE statistics(
			name VARCHAR (255),
			order_id INT PRIMARY KEY,
			hp INT NOT NULL,
			attack INT NOT NULL,
			defense INT NOT NULL,
			special_attack INT NOT NULL,
			special_defense INT NOT NULL,
			speed INT NOT NULL);
	

CREATE TABLE sprites(
			name VARCHAR (255),
			order_id INT PRIMARY KEY, 
			FOREIGN KEY(order_id) REFERENCES metadata(order_id),
			sprites_default VARCHAR (255) NOT NULL,
			sprites_shiny VARCHAR(255));

-- IMPORT CSV FILES IN THE ORDER OF TABLES CREATED

SELECT * FROM metadata;

SELECT * FROM statistics;

SELECT * FROM sprites;
