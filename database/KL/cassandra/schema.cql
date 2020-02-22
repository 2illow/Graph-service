DROP KEYSPACE IF EXISTS graph;

CREATE KEYSPACE IF NOT EXISTS graph WITH replication = { 'class': 'SimpleStrategy', 'replication_factor': '1' };

USE graph;

CREATE TABLE properties (
  id int,
  name text,
  estimates list<int>,
  dates list<date>,  
  city_id int, 
  neighborhood_id int, 
  city_name text,
  neighborhood_name text,
  city_estimates list<int>,
  city_dates list<date>,
  neighborhood_estimates list<int>,
  neighborhood_dates list<date>,
  PRIMARY KEY (id, neighborhood_id, city_id),
  sold_date date,
  sold_price int,
  listed_date date,
  listed_price int
);

