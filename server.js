'use strict';

// load .env variables  
require('dotenv').config();
const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 2000;

http.createServer(app).listen(PORT, () => {
    console.log('> Server listen on %s ⚡', PORT);
});