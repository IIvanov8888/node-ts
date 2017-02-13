import * as http from 'http';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
//import * as request from 'request';

let app = express();

let passport = require('passport'),
    pug = require('pug'),
    jwt = require('jsonwebtoken');

app.get('/', (req, res, next) => {
  res.send('Express started');
});

app.use(require('body-parser').urlencoded({ extended: true }));

const server = app.listen(3000, () => {
    console.log('Express server listening on port ', 3000);
});
