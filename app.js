const express = require('express'); 

const app = express();

const fileUpload = require('./upload');

app.use('/',fileUpload);

app.listen(3000);