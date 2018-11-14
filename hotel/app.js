const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');



//Hotel Reservation DB
mongoose.connect('mongodb://localhost/hotel_reservation');
let db = mongoose.connection;



//Check connection
db.once('open',function () {
    console.log('connected to mongodb');
});

//Init App
const app = express();

// Article model
const Index = require('./models/index');


//For image and js and css path
app.use(express.static('public'));

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

//Load View Engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//Home Route
app.get('/',function (req, res) {

    var MongoClient = require('mongodb').MongoClient,
        assert = require('assert');
    var url = 'mongodb://localhost:27017/hotel_reservation';
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client)
    {
        assert.equal(null, err);
        console.log("Successfully connected to server");
        var db = client.db('hotel_reservation');
// Find some documents in our collection
        db.collection('tbl_room').aggregate([

            // Join with tbl_room_price table
            {
                $lookup:{
                    from: "tbl_room_price",       // other table name
                    localField: "room_price_id",   // name of tbl_room table field
                    foreignField: "room_price_id", // name of tbl_room_price table field
                    as: "tbl_room_price"         // alias for tbl_room_price table
                }
            },
            {   $unwind:"$tbl_room_price" },
            // Join with tbl_discount table
            {
                $lookup:{
                    from: "tbl_discount",       // other table name
                    localField: "room_id",   // name of tbl_room table field
                    foreignField: "discount_room_id", // name of tbl_discount table field
                    as: "tbl_discount"         // alias for tbl_discount table
                }
            },
            {   $unwind:"$tbl_discount" },
            // Join with tbl_room_type table
            {
                $lookup:{
                    from: "tbl_room_type",       // other table name
                    localField: "room_type_id",   // name of tbl_room table field
                    foreignField: "room_type_id", // name of tbl_room_type table field
                    as: "tbl_room_type"         // alias for tbl_room_type table
                }
            },
            {   $unwind:"$tbl_room_type" }
        ]).toArray(function(err, resultset) {
        // Print the documents returned
            res.render('index',{resultset});

        // Close the DB
            client.close();
        });

    });


});


// POST Method when customer search using date range
app.post('/', function (req, res) {
    //console.log(req.body.from);
    //console.log(req.body.to);
    var MongoClient = require('mongodb').MongoClient,
        assert = require('assert');
    var url = 'mongodb://localhost:27017/hotel_reservation';
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client)
    {
        assert.equal(null, err);
        console.log("Successfully connected to server");
        var db = client.db('hotel_reservation');
        // get result
        var roomidArr=[];

        db.collection('tbl_booking').find(
        ({ 'booking_start_date': {$eq: req.body.from}}) ,{ room_id: 1,_id:0}).toArray(function (err, resultIdArray) {
        if (err) throw err;
        roomidArr = resultIdArray;


        if (roomidArr === undefined || roomidArr.length == 0) {
            db.collection('tbl_room').aggregate([
                // Join with tbl_room_price table
                {
                    $lookup: {
                        from: "tbl_room_price",       // other table name
                        localField: "room_price_id",   // name of tbl_room table field
                        foreignField: "room_price_id", // name of tbl_room_price table field
                        as: "tbl_room_price"         // alias for tbl_room_price table
                    }
                },
                {$unwind: "$tbl_room_price"},
                // Join with tbl_discount table
                {
                    $lookup: {
                        from: "tbl_discount",       // other table name
                        localField: "room_id",   // name of tbl_room table field
                        foreignField: "discount_room_id", // name of tbl_discount table field
                        as: "tbl_discount"         // alias for tbl_discount table
                    }
                },
                {$unwind: "$tbl_discount"},
                // Join with tbl_room_type table
                {
                    $lookup: {
                        from: "tbl_room_type",       // other table name
                        localField: "room_type_id",   // name of tbl_room table field
                        foreignField: "room_type_id", // name of tbl_room_type table field
                        as: "tbl_room_type"         // alias for tbl_room_type table
                    }
                },
                {$unwind: "$tbl_room_type"}
            ]).toArray(function (err, resultset) {
                if (err) throw err;
                res.render('index', {resultset});
            });
        }
        else {
            var resultset=[];
            var $roomArrId = [];
            roomidArr.forEach(function (element) {
                $roomArrId=element.room_id;
            })


            db.collection('tbl_room').aggregate([
                {$match: {
                        room_id: {$nin:[$roomArrId]}}
                },
                // Join with tbl_room_price table
                {
                    $lookup: {
                        from: "tbl_room_price",       // other table name
                        localField: "room_price_id",   // name of tbl_room table field
                        foreignField: "room_price_id", // name of tbl_room_price table field
                        as: "tbl_room_price"         // alias for tbl_room_price table
                    }
                },
                {$unwind: "$tbl_room_price"},
                // Join with tbl_discount table
                {
                    $lookup: {
                        from: "tbl_discount",       // other table name
                        localField: "room_id",   // name of tbl_room table field
                        foreignField: "discount_room_id", // name of tbl_discount table field
                        as: "tbl_discount"         // alias for tbl_discount table
                    }
                },
                {$unwind: "$tbl_discount"},
                // Join with tbl_room_type table
                {
                    $lookup: {
                        from: "tbl_room_type",       // other table name
                        localField: "room_type_id",   // name of tbl_room table field
                        foreignField: "room_type_id", // name of tbl_room_type table field
                        as: "tbl_room_type"         // alias for tbl_room_type table
                    }
                },
                {$unwind: "$tbl_room_type"}
            ]).toArray(function (err, resultset) {
                if (err) throw err;
                res.render('index', {resultset});
            });
        }
        // Close the DB
        client.close();

        });
    });
});

//Contact Route
app.get('/contact',function (req, res) {

    res.render('contact');
});

app.post('/contact', function (req, res) {
    var MongoClient = require('mongodb').MongoClient,
        assert = require('assert');
    var url = 'mongodb://localhost:27017/hotel_reservation';
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, data)
    {
        if (err) throw err;
        console.log("Successfully connected to server");
        var db = data.db('hotel_reservation');
        //Create Object
        var myobj = { contact_name:req.body.name,
            contact_email:req.body.email,
            contact_phone:req.body.phone,
            contact_msg:req.body.msg
        };
        // Insert contact db
        db.collection("tbl_contact_us").insertOne(myobj, function(err, resultset) {
            if (err) throw err;
            console.log("1 document inserted");
            data.close();

            if(resultset.result.ok == 1)
                result = true
            console.log(result)
            res.render('contact', {result});

        });
    });
});


//Room Details Page
app.get('/type/:id',function (req, res) {
//console.log(req.params.id)
    res.render(req.params.id);
});


//Registration Page
app.get('/registration/type/:id',function (req, res) {

    //console.log(req.params.id)
    res.render('registration',{req});
});



app.post('/confirm', function (req, res) {
    if(1==req.body.finalConfirm)
    {
        console.log(req.body.fullname);
        console.log(req.body.address);
        console.log(req.body.from);
        console.log(req.body.to);
        console.log(req.body.type);

        var MongoClient = require('mongodb').MongoClient,
            assert = require('assert');
        var url = 'mongodb://localhost:27017/hotel_reservation';
        MongoClient.connect(url,{ useNewUrlParser: true }, function(err, data)
        {
            if (err) throw err;
            console.log("Successfully connected to server");
            var db = data.db('hotel_reservation');
            //Create Object
            var myobj = { customer_fullname:req.body.fullname,
                customer_address:req.body.address,
                room_type_id:req.body.type
            };
            // Insert customer db
            db.collection("tbl_customer").insertOne(myobj, function(err, resultset) {
                if (err) throw err;
                console.log("1 document inserted");
                //data.close();

            });

            var myobj = { booking_start_date:req.body.from,
                booking_end_date:req.body.to,
                room_type_id:req.body.type
            };

            // Insert booking db
            db.collection("tbl_booking").insertOne(myobj, function(err, resultset) {
                if (err) throw err;
                console.log("2 document inserted");


            });
            data.close();
        });


        res.render('registration',{req});
    }
    else
    {
        res.render('confirm',{req});
    }

});


//Start Server
app.listen(3000,function () {
    console.log('Server started at port 3000');
})