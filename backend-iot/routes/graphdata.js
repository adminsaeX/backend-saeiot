var express = require('express');
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const DBoption = require('../dbOption')
const CONNECTION_URL = process.env.DBURL;
const DATABASE_NAME = process.env.DBNAME;
const client = new MongoClient(CONNECTION_URL,DBoption);
const bodyParser = require('body-parser')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

client.connect(err =>{
    var db = client.db(DATABASE_NAME);
    var collection_data = db.collection('rawdata');
    router.post('/graphdata', function(req, res, next) {
        var clientDevice_id  = req.body.clientDevice_id;
        var searchDate = req.body.date;
        collection_data.aggregate([
            {
            $match:{
               clientDevice_id:clientDevice_id,
               ts:{
                '$gte': new Date(searchDate +'T00:00:00.000z'), 
                '$lte': new Date(searchDate +'T23:59:59.000z') 
               } 
            }
        },
        {
            $project: {
                _id: '$clientDevice_id',
                ts:1,
                dcVoltage: '$dcVoltage',
                dcCurrent: '$dcCurrent',
                dcPower: '$dcPower',
                dcEnergy: '$dcEnergy',
                waterFlow : '$waterFlow',
                waterTotal: '$waterTotal',
                Alarm : '$Alarm'

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
