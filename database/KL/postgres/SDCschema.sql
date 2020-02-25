DROP TABLE IF EXISTS keys;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS neighborhoods;
DROP TABLE IF EXISTS cities;


CREATE TABLE cities(
  id SERIAL PRIMARY KEY,
  c_name VARCHAR (40),
  c_estimates INTEGER[],
  c_dates DATE[]
);

CREATE TABLE neighborhoods(
  id SERIAL PRIMARY KEY,
  n_name VARCHAR (40),
  city INTEGER REFERENCES cities(id),
  n_estimates INTEGER[],
  n_dates DATE[]
);

CREATE TABLE properties(
  id SERIAL PRIMARY KEY,
  name VARCHAR (40),
  neighborhood INTEGER REFERENCES neighborhoods(id),
  listedprice INTEGER,
  listeddate DATE,
  soldprice INTEGER,
  solddate DATE,
  estimates INTEGER[],
  dates DATE[]
);

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR (40)
);

CREATE TABLE keys(
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  property INTEGER REFERENCES properties(id)
);

\copy cities(c_name, c_estimates, c_dates) FROM '~/Desktop/SDC/Graph-service/database/KL/postgres/cities.csv' DELIMITER ',' CSV HEADER;
\copy neighborhoods(n_name, n_estimates, n_dates, city) FROM '~/Desktop/SDC/Graph-service/database/KL/postgres/neighborhoods.csv' DELIMITER ',' CSV HEADER;
\copy properties(name, estimates, dates, neighborhood, listeddate, listedprice, solddate, soldprice) FROM '~/Desktop/SDC/Graph-service/database/KL/postgres/properties.csv' DELIMITER ',' CSV HEADER;

