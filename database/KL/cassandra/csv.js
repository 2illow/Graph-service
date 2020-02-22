const model = require('../models');
const fs = require('fs');

// model.createEstimateDate();

const writeProperties = fs.createWriteStream('cass.csv');
writeProperties.write('id,name,estimates,dates,sold_price,sold_date,listed_price,listed_date,city_id,city_name,city_estimates,city_dates,neighborhood_id,neighborhood_name,neighborhood_estimates,neighborhood_dates\n', 'utf-8');

function writeCSV(writer, encoding, i, callback) {
  let id = 0;
  i += 1;
  var neighborhood_id = Math.ceil(i/200);
  var neighborhood = model.createNeighborhoodChunk(1);
  var city_id = Math.ceil(i/2000);
  var city = model.createCityChunk(1);
  console.log(city);
  function write() {
    let ok = true;
    console.log(i);
    var neighborhood_id = Math.ceil(i/200);
    var neighborhood = model.createNeighborhoodChunk(1)[0];
    var city_id = Math.ceil(i/2000);
    var city = model.createCityChunk(1)[0];
    var data = ''
    do {
      i -= 1;
      id += 1;
      var property = model.createPropertyChunk(1)[0];
      // make data string
      // if i%2000 === 0 city_id = i/2000
      if (i % 2000 === 0) {
        var city_id = i / 2000;
        city = model.createCityChunk(1)[0];
      }
      // if i%200 === 0 neighborhood_id = i/200
      if (i % 200 === 0) {
        var neighborhood_id = i / 200;
        var neighborhood = model.createNeighborhoodChunk(1)[0];
      }
      data = `${id}, "${property.name}","[${property.estimates}]","[${property.dates[0]}, ${property.dates[property.dates.length -1]}]",${property.soldVal},"${property.soldDate}",${property.listedVal},"${property.listedDate}",${city_id},"${city.name}","[${city.estimates}]","[${city.dates[0]}, ${city.dates[city.dates.length -1]}]",${neighborhood_id},"${neighborhood.name}","[${neighborhood.estimates}]","[${property.dates[0]}, ${neighborhood.dates[neighborhood.dates.length - 1]}]"\n`;
      console.log(i);
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

writeCSV(writeProperties, 'utf-8', 10000000, () => {
  writeProperties.end();
  console.log('done')
})
