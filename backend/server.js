const express = require('express')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser')
const cors = require('cors')

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'passmanager';
client.connect();


const app = express()
const port = 3000
app.use(bodyparser.json())
app.use(cors())

// Middleware to set db and collection
// app.use((req, res, next) => {
//     req.db = client.db(dbName);
//     req.collection = req.db.collection('Credentials');
//     next();
// });

app.get('/', async(req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('Credentials');
    const findResult = await collection.find({}).toArray();
  res.json(findResult)
})

app.post('/', async(req, res) => {
    const data = req.body
    const db = client.db(dbName);
    const collection = db.collection('Credentials');
    const findResult = await collection.insertOne(data);
  res.send({success: true, result:findResult})
})

app.delete('/', async(req, res) => {
    const data = req.body
    const db = client.db(dbName);
    const collection = db.collection('Credentials');
    const findResult = await collection.deleteOne(data);
  res.send({success: true, result:findResult})
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})