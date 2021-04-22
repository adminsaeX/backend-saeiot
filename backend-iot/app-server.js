require('dotenv').config()
var express = require('express')
const https = require('https');
const fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = module.exports = express()

const PORT = process.env.PORT


var GraphData = require('./routes/graphdata_day');



/*
var key = fs.readFileSync('/etc/letsencrypt/live/www.labencamp.com/privkey.pem'); // key with deploy
var cert = fs.readFileSync('/etc/letsencrypt/live/www.labencamp.com/fullchain.pem'); // key with deploy


var options = {
  key: key,
  cert: cert
};
*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    //res.header("Access-Control-Max-Age", 86400);
    next();
  })


app.use('/pumpdata',GraphData);

app.get('/index', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
app.get('/', (req, res) => {
  res.send('solar-pump API running ');
});



//var server = https.createServer(options, app);  // with comment deploy
app.listen(PORT, () => {
  console.log("server starting on port : " + PORT)
});