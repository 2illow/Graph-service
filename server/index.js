// require('newrelic');
const express = require('express');
//const util = require('util');
const app = express();
const port = 3003;
// const db = require('../database/schema.js');
const pgdb = require('../database/KL/postgres/index.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/seed', (req, res) => {
  db.save(() => {
    db.retrieve((docs) => {
      // console.log(util.inspect(docs, false, null, true /* enable colors */))
      res.json(docs);
    });
  });
});

app.get('/api/graphs/properties/:id', (req, res) => {
  pgdb.selProp(req.params.id, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end();
    } else {
      res.writeHead(200);
      res.end(JSON.stringify(data.rows));
    }
  });
});

app.listen(port, () => {
  console.log('listening on port: ', port);
});
