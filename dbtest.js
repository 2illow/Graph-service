const { Pool, Client } = require('pg');
const faker = require('faker');
const Promise = require('bluebird');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'graph',
  password: 'PGpassword',
  max: 50
});

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'graph',
  password: 'PGpassword',
  port: 5432,
});

var seed = function(count = 1, callback) {
  var cities = createCityChunk(1000);
  var promArr = [];
  for(var i = 0; i < cities.length; i++) {
    var query = {
      text: 'INSERT INTO cities (name, estimates, dates) VALUES ($1, $2::integer[], $3::date[])',
      values: [cities[i].name, cities[i].estimates, cities[i].dates], 
    }
    promArr.push(pool.query(query))
  }
  Promise.all(promArr)
    .then((data) => {
      if(count === 1) {
        console.log(data);
        callback();
        console.log('success');
      } else {
        seed(count-1, callback);
      }
    })
    .catch((err) => {console.log(err); callback();});
}


// returns an array of dates at the first of each month in the years 2010-2019
// this results in 120 length array
var generateDates = function(start = 10, end = 20) {
  var dates = [];
  for (var i = start; i < end; i++) {
    for (var j = 1; j <= 12; j++) {
      dates.push(new Date(2000 + i, j));
    }
  }
  return dates;
}

// return 120 length array of estimates to match each date from generateDates
// has an upward trend but is slightly random
var generateEstimates = function(len = 120) {
  estimates = [];
  // general slope of the estimates
  var slope = Math.floor(Math.random() * 10000);
  // lastvalue is actually starting value but will be reused in loop for maninpulation
  var lastvalue = Math.floor(Math.random() * 2000000) + 50000;
  for(var i = 0; i < len; i++) {
    var estimate = lastvalue + (slope * i) + (Math.random() * (50000) - 25000);
    estimates.push(Math.round(estimate/1000) * 1000);    
    lastvalue = estimate/100;
  }
  return estimates;
}

var createEstimateDate = function(size = 120) {
  dates = generateDates(10, 10 + (size/12));
  estimates = generateEstimates(size);
  return {dates: dates, estimates: estimates};
}

var createCityChunk = function(size = 10) {
  var cities = [];
  for (var i = 0; i < size; i++) {
    var entry = {};
    entry = createEstimateDate();
    entry.name = faker.address.city();
    cities.push(entry);
  }
  return cities;
}

var citiesTable = `DROP TABLE IF EXISTS propertydata;
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
);`

var neighborhoodsTable = `CREATE TABLE neighborhoods(
  id SERIAL PRIMARY KEY,
  name VARCHAR (40),
  city INTEGER REFERENCES cities(id),
  estimates INTEGER[],
  dates DATE[]
);`

var propertiesTable = `CREATE TABLE properties(
  id SERIAL PRIMARY KEY,
  name VARCHAR (40),
  neighborhood INTEGER REFERENCES neighborhoods(id),
  listedprice INTEGER,
  listeddate DATE,
  soldprice INTEGER,
  solddate DATE,
  estimates INTEGER[],
  dates DATE[]
);`

pool.connect()
pool.query(citiesTable, (err, res) => {
  console.log(err ? err.stack : res); 
  pool.query(neighborhoodsTable, (err, res) => {
    console.log(err ? err.stack : res.rows);
    pool.query(propertiesTable, (err, res) => {
      console.log(err ? err.stack : res.rows);
      if(!err){
        console.log('Tables Created');
        seed(100, () => {pool.end});
      }
    });
  });
});

