const { Pool } = require('pg');
const Promise = require('bluebird');
const config = require('./config.js');

const pool = new Pool(config);

const selProp = function(id, callback) {
  var city;
  var neighborhood;
  var property;
  console.log(id);
  var query = {
    text: `SELECT * FROM properties 
      INNER JOIN neighborhoods ON neighborhoods.id=properties.neighborhood 
      INNER JOIN cities on cities.id=neighborhoods.city 
      WHERE properties.id=$1::integer;`,
    values: [id]
  };
  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query(query) 
      .then((data) => {
        done();
        callback(null, data);
      })
      .catch((err) => {
        done();
        callback(err);
      });
  });
}

module.exports = {
  selProp
};
