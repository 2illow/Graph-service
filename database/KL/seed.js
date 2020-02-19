const { Pool } = require('pg');
const Promise = require('bluebird');
const model = require('./models');
const config = require('./config.js');

const pool = new Pool(config);

const seed = function(count = 1, callback) {
  var cities = model.createCityChunk(1000);
  var promArr = [];
  for (var i = 0; i < cities.length; i++) {
    var query = {
      text: 'INSERT INTO cities (name, estimates, dates) VALUES ($1, $2::integer[], $3::date[])',
      values: [cities[i].name, cities[i].estimates, cities[i].dates]
    };
    promArr.push(pool.query(query));
  }
  Promise.all(promArr)
    .then((data) => {
      if (count === 1) {
        //callback(null, data);
        seedNeighborhoods(5000, callback);
      } else {
        console.log('City Chunks left: ', count - 1);
        seed(count - 1, callback);
      }
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
};

const seedNeighborhoods = function(count = 1, callback) {
  var neighborhoods = model.createNeighborhoodChunk(10);
  var promArr = [];
  for (var i = 0; i < neighborhoods.length; i++) {
    var query = {
      text: 'INSERT INTO neighborhoods (name, estimates, dates, city) VALUES ($1, $2::integer[], $3::date[], $4::integer)',
      values: [neighborhoods[i].name, neighborhoods[i].estimates, neighborhoods[i].dates, count]
    };
    promArr.push(pool.query(query));
  }
  Promise.all(promArr)
    .then((data) => {
      if (count === 1) {
        seedProperties(50000, callback)
        // callback(null, data);
      } else {
        console.log('Neighborhood chunks left: ', count - 1);
        seedNeighborhoods(count - 1, callback);
      }
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
};

const seedProperties = function(count = 1, callback) {
  var properties = model.createPropertyChunk(200);
  var promArr = [];
  for (var i = 0; i < properties.length; i++) {
    var query = {
      text: 'INSERT INTO properties (name, estimates, dates, neighborhood, soldprice, solddate, listedprice, listeddate) VALUES ($1, $2::integer[], $3::date[], $4::integer, $5::integer, $6::date, $7::integer, $8::date)',
      values: [properties[i].name, properties[i].estimates, properties[i].dates, count, properties[i].soldVal, properties[i].soldDate, properties[i].listedVal, properties[i].listedDate]
    };
    promArr.push(pool.query(query));
  }
  Promise.all(promArr)
    .then((data) => {
      if (count === 1) {
        callback(null, data);
      } else {
        console.log('Property chunks left: ', count - 1);
        seedProperties(count - 1, callback);
      }
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
};

// query strings for the tables
const citiesTable = `DROP TABLE IF EXISTS propertydata;
  DROP TABLE IF EXISTS properties;
  DROP TABLE IF EXISTS neighborhooddata;
  DROP TABLE IF EXISTS neighborhoods;
  DROP TABLE IF EXISTS citydata;
  DROP TABLE IF EXISTS cities; 
  CREATE TABLE cities(
  id SERIAL PRIMARY KEY,
  name VARCHAR (40),
  estimates INTEGER[],
  dates DATE[]
);`;

const neighborhoodsTable = `CREATE TABLE neighborhoods(
  id SERIAL PRIMARY KEY,
  name VARCHAR (40),
  city INTEGER REFERENCES cities(id),
  estimates INTEGER[],
  dates DATE[]
);`;

const propertiesTable = `CREATE TABLE properties(
  id SERIAL PRIMARY KEY,
  name VARCHAR (40),
  neighborhood INTEGER REFERENCES neighborhoods(id),
  listedprice INTEGER,
  listeddate DATE,
  soldprice INTEGER,
  solddate DATE,
  estimates INTEGER[],
  dates DATE[]
);`;

pool.connect();
pool.query(citiesTable, (err, res) => {
  console.log(err ? err.stack : res); 
  pool.query(neighborhoodsTable, (err, res) => {
    console.log(err ? err.stack : res.rows);
    pool.query(propertiesTable, (err, res) => {
      console.log(err ? err.stack : res.rows);
      if (!err) {
        console.log('Tables Created');
        seed(5, (err, data) => {
          if (!err) {
            console.log('success');
          } else {
            console.log(err);
          }
          pool.end();
        });
      }
    });
  });
});
