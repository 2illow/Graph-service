const model = require('../models');
const fs = require('fs');

const cityStream = fs.createWriteStream('cities.csv');
cityStream.write('c_name,c_estimates,c_dates\n', 'utf-8');

const neighborhoodStream = fs.createWriteStream('neighborhoods.csv');
neighborhoodStream.write('n_name, n_estimates, n_dates, city\n', 'utf-8');

function writeCities(writer, encoding, i, callback) {
  i += 1;
  var city = model.createCityChunk(1)[0];
  function write() {
    let ok = true;
    var city = model.createCityChunk(1)[0];
    var data = ''
    do {
      i -= 1;
      // make data string
      data = `${city.name}, "{${city.estimates}}", "{${city.dates}}"\n`; 
      if (i === 1) {
        writer.write(data, encoding, callback);
      } else {
        ok = writer.write(data, encoding);
      }
    } while (i > 1 && ok)
    if (i > 1) {
      writer.once('drain', write);
    }
  }
  write()
}

function writeNeighborhoods(writer, encoding, i, callback){
  let id = Math.ceil(i/10);
  i += 1;
  var neighborhood = model.createNeighborhoodChunk(1)[0];
  function write() {
    let ok = true;
    var data = '';
    do {
      i -= 1;
      if (i % 10000 === 0) {
        console.log(i, ' Neighborhoods left');
      }
      id = Math.ceil(i/10);
      data = `${neighborhood.name}, "{${neighborhood.estimates}}", "{${neighborhood.dates}}", ${id}\n`
      if (i === 1) {
        writer.write(data, encoding, callback);
      } else {
        ok = writer.write(data,encoding);
      }
    } while (i > 1 && ok)
    if (i > 1) {
      writer.once('drain', write);
    }
  }
  write();
};


writeCities(cityStream, 'utf-8', 5000, () => {
  cityStream.end();
  console.log('Cities Done');
  writeNeighborhoods(neighborhoodStream, 'utf-8', 50000, () => {
    neighborhoodStream.end();
    console.log('Neighborhoods Done');
  });
});
