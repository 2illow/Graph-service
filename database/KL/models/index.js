const faker = require('faker');
// returns an array of dates at the first of each month in the years 2010-2019
// this results in 120 length array
const generateDates = function(start = 10, end = 20) {
  var dates = [];
  for (var i = start; i < end; i++) {
    for (var j = 1; j <= 12; j++) {
      // dates.push(new Date(2000 + i, j));
      dates.push(`${2000 + i}-${j.toString().padStart(2, '0')}-01`)
    }
  }
  return dates;
};


// return 120 length array of estimates to match each date from generateDates
// has an upward trend but is slightly random
const generateEstimates = function(len = 120) {
  var estimates = [];
  // general slope of the estimates
  var slope = Math.floor(Math.random() * 10000);
  // lastvalue is actually starting value but will be reused in loop for maninpulation
  var lastvalue = Math.floor(Math.random() * 2000000) + 50000;
  estimates.push(lastvalue);
  for (var i = 1; i < len; i++) {
    var estimate = lastvalue + (slope * i) + (Math.random() * (50000) - 25000);
    estimates.push(Math.abs(Math.round(estimate/1000) * 1000));    
    lastvalue = estimate;
  }
  return estimates;
};

const createEstimateDate = function(size = 120) {
  dates = generateDates(10, 10 + (size / 12));
  estimates = generateEstimates(size);
  return {dates: dates, estimates: estimates};
};

const createCityChunk = function(size = 10) {
  var cities = [];
  for (var i = 0; i < size; i++) {
    var entry = {};
    entry = createEstimateDate();
    entry.name = faker.address.city();
    cities.push(entry);
  }
  return cities;
};

const createNeighborhoodChunk = function(size = 10) {
  var neighborhoods = [];
  for (var i = 0; i < size; i++) {
    var entry = {};
    entry = createEstimateDate();
    entry.name = faker.address.streetName();
    neighborhoods.push(entry);
  }
  return neighborhoods;
};

const createPropertyChunk = function(size = 200) {
  var properties = [];
  for (var i = 0; i < size; i++) {
    var entry = {};
    entry = createEstimateDate();
    entry.name = faker.address.streetAddress();
    var index = Math.floor(Math.random() * entry.dates.length); 
    entry.soldDate = entry.dates[index];
    entry.soldVal = entry.estimates[index];
    index = Math.floor(Math.random() * entry.dates.length);
    entry.listedDate = entry.dates[index];
    entry.listedVal = entry.estimates[index];
    properties.push(entry);
  }
  return properties;
};

module.exports = {
  createCityChunk,
  createPropertyChunk,
  createNeighborhoodChunk,
  createEstimateDate,
};
