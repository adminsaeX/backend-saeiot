
require('dotenv').config()
var express = require('express');
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const DBoption = require('../dbOption')
const CONNECTION_URL = process.env.DBURL;
const DATABASE_NAME = process.env.DBNAME;

const bodyParser = require('body-parser')

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    //res.header("Access-Control-Max-Age", 86400);
    next();
  })

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

MongoClient.connect(CONNECTION_URL,DBoption,(err,client)=>{
    if (err){
        throw err
    }
    var database = client.db(DATABASE_NAME);
    var collection_data = database.collection('rawdata');
    router.post('/graphdata', function(req, res) {
        var client_id  = req.body.client_id;
        var searchDate = req.body.date;
        collection_data.aggregate([
            {
            $match:{
               client_id:client_id,
               timestamp:{
                '$gte': new Date(searchDate +'T00:00:00.000z'), 
                '$lte': new Date(searchDate +'T23:59:59.000z') 
               } 
            }
        },
        {
            $project: {
                _id: '$client_id',
                timestamp:1,
                pump_status:'$pump_status',
                pump_fault:'$pump_fault',
                pump_freq:'$pump_freq',
                pump_V:'pump_V',
                pump_speed:'$pump_speed',
                dcVolt:'$dcVolt',
                dcCurrent:'$dcCurrent',
                temp:'$temp',
                hum:'$hum'

                

            }
        }
        ]).sort({_id:1}).toArray(function(err,search){
            if(err || this.status == 'DESTOYER') {
                console.log('error request');
                res.send(err.message)
                return
            }
            if(search.length > 0 ) {
                res.send(search)

            }else {
                res.send('200 No Data')
            }
        })

        
      });
});
    



module.exports = router;
