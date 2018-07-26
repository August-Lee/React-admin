var MongoClient = require('mongoose');
var DB_CONN_STR = 'mongodb://localhost:27017/li';
const express = require('express');
const app = express();
const path = require('path');
var http = require('http');
var querystring = require('querystring');
var ObjectId = require('mongodb').ObjectId;
var params;

app.use(express.static(path.join(__dirname, 'public')))
app.listen(80,() => {
    console.log(`App listening at port 80`);
})

app.post("/sendList",function(req,res){
    req.on('data',function(data){
        params = JSON.parse(data);
        MongoClient.connect(DB_CONN_STR, function(err, db) {
            console.log("连接成功！");
            insertData(db, function(result) {
                res.status(200).json(result);
                db.close();
            });
        });
    })
})
app.post("/updateList",function(req,res){
    req.on('data',function(data){
        params = JSON.parse(data);
        MongoClient.connect(DB_CONN_STR, function(err, db) {
            console.log("连接成功！");
            updateData(db, function(result) {
                res.status(200).json(result);
                db.close();
            });
        });
    })
})
app.get("/getUser",function(req,res){
        MongoClient.connect(DB_CONN_STR, function(err, db) {
            console.log("连接成功！");
            selectData(db, function(result) {
                console.log(result);
                res.status(200).json(result);
                db.close();
            });
        });

})
app.post("/deleteUser",function(req,res){
    req.on('data',function(data){
        params = JSON.parse(data);
        MongoClient.connect(DB_CONN_STR, function(err, db) {
            console.log("连接成功！");
            removeData(db, function(result) {
                res.status(200).json(result);
                db.close();
            });
        });
    })
})
app.post("/login",function(req,res){
    req.on('data',function(data){
        params =JSON.parse(data);
        console.log(params);
        // params = querystring.parse(data.toString());
        MongoClient.connect(DB_CONN_STR, function(err, db) {
            console.log("连接成功！");
            findData(db, function(result) {
                console.log(result);
                res.status(200).json(result);
                db.close();
            });
        });
    })
})
var insertData = function(db, callback) {
    //连接到表 site
    var collection = db.collection('user');
    //插入数据
    var data = params;
    collection.insert(data, function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
        // console.log(result);
        callback(result);
    });
}
var updateData = function(db, callback) {
    //连接到表 site
    var collection = db.collection('user');
    //插入数据
    var data = params;
    console.log(data);
    collection.update({"_id": ObjectId(data._id)},{$set:{"uname":data.uname,"pwd":data.pwd}}, function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
        // console.log(result);
        callback(result);
    });
}
var findData = function(db, callback) {
            //连接到表 site
        var collection = db.collection('user');
        //插入数据
        var data = params;
        collection.find(data).toArray(function(err, result) {
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }
            var data;
            if(result[0]==undefined){
                data={code:'1',msg:'err'}
            }else{
                data={code:'0',msg:'succ'}` `
            }
            callback(data);
        });
}
var selectData = function(db, callback) {
            //连接到表 site
            var collection = db.collection('user');
            //插入数据
            collection.find().toArray(function(err, result) {
                if(err)
                {
                    console.log('Error:'+ err);
                    return;
                }
        if(result[0]==undefined){
            data={code:'1',msg:'err'}
        }else{
            data={code:'0',msg:'succ',data:result}
        }
        callback(data);
    });
}
var removeData = function(db, callback) {
    //连接到表 site
    var collection = db.collection('user');
    //插入数据
    var data = params;
    console.log(data)
    collection.remove({"uname": data.uname},function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
        callback(result);
    });
}

