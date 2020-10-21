
const express = require('express');                                             //framework
const engines = require('consolidate');                                         //thuc thi cac doan code js der chuyen ve ngon ngu may tinh co the hieu va doc duoc
const app = express();


//npm i handlebars consolidate --save
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));                            //mot doi tuong body chua du lieu ma da duoc phan tich cu pham se duoc dua vao request. du lieu do la cap key-value, trong do co the la true, array, string neeu extended false, cac loai con lai la true

var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://hoaison2204:Son22042000@cluster0.cnlb1.mongodb.net/test';

app.get('/', async function (req, res) {                                        //async khai bao ham bat dong bo - await tam dung ham bat dong bo
    let client = await MongoClient.connect(url);
    let dbo = client.db("GCH0719");
    let results = await dbo.collection("Product").find({}).toArray();
    res.render('allSanPham', { sanPham: results });
})

app.get('/delete', async function (req, res) {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };

    let client = await MongoClient.connect(url);
    let dbo = client.db("GCH0719");
    await dbo.collection("Product").deleteOne(condition);
    res.redirect('/');
})

app.get('/add', function (req, res) {
    res.render('updateSanPham');
})
app.get('/login', function (req, res) {
    res.render('login');
})

app.post('/doAddproduct', async function (req, res) {
    let client = await MongoClient.connect(url);
    var objectID = require('mongodb').objectID;

    let dbo = client.db("GCH0719");
    let _id = req.body.txt_id;
    let name = req.body.txtName;
    let price = req.body.txtPrice;

    let newProduct = { _id : _id, name: name, price: price };
    await dbo.collection("Product").insertOne(newProduct);
    // console.log(newProduct);

    res.redirect('/');
})

const PORT = process.env.PORT || 5000
var server = app.listen(PORT, function () {
    console.log("Server is running at " + PORT);
});