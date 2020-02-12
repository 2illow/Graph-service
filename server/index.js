const express = require('express');
//const util = require('util');
const app = express();
const port = 3003;
const db = require('../database/schema.js');

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

app.listen(port);
