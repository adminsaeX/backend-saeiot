require('dotenv').config()
var express = require('express')
const https = require('https');
const fs = require('fs');


var app = module.exports = express()

const PORT = process.env.PORT
/*
var key = fs.readFileSync('/etc/letsencrypt/live/www.labencamp.com/privkey.pem'); // key with deploy
var cert = fs.readFileSync('/etc/letsencrypt/live/www.labencamp.com/fullchain.pem'); // key with deploy


var options = {
  key: key,
  cert: cert
};
*/
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    //res.header("Access-Control-Max-Age", 86400);
    next();
  })


app.use('/pumpdata',require('./api/realtimedata'))

app.get('/', (req, res) => {
  res.send('hello');
});



//var server = https.createServer(options, app);  // with comment deploy
app.listen(PORT, () => {
  console.log("server starting on port : " + PORT)
});