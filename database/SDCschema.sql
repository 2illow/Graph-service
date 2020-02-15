CREATE TABLE cities(
  id SERIAL PRIMARY KEY,
  name VARCHAR (40),
  estimates INTEGER[],
  dates DATE[]
);

CREATE TABLE neighborhoods(
  id SERIAL PRIMARY KEY,
  name VARCHAR (40),
  city INTEGER REFERENCES cities(id),
  estimates INTEGER[],
  dates DATE[]
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
  user INTEGER REFERENCES users(id),
  property INTEGER REFERENCES properties(id)
);
