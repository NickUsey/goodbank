const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/myproject';
let db = null;

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
    } else {
        console.log('Connected successfully to MongoDB server');
        db = client.db('myproject');
    }
});

function create(name, email, password) {
    return new Promise((resolve, reject) => {
        const collection = db.collection('users');
        const doc = { name, email, password, balance: 0 };
        collection.insertOne(doc, { w: 1 }, function (err, result) {
            err ? reject(err) : resolve(doc);
        });
    });
}

function find(email) {
    return new Promise((resolve, reject) => {
        const collection = db.collection('users');
        collection.find({ email: email }).toArray(function (err, docs) {
            err ? reject(err) : resolve(docs);
        });
    });
}

function findOne(email) {
    return new Promise((resolve, reject) => {
        const collection = db.collection('users');
        collection.findOne({ email: email })
            .then((doc) => resolve(doc))
            .catch((err) => reject(err));
    });
}

function update(email, amount) {
    return new Promise((resolve, reject) => {
        const collection = db.collection('users');
        collection.findOneAndUpdate(
            { email: email },
            { $inc: { balance: amount } },
            { returnOriginal: false },
            function (err, documents) {
                err ? reject(err) : resolve(documents);
            }
        );
    });
}

function all() {
    return new Promise((resolve, reject) => {
        const collection = db.collection('users');
        collection.find({}).toArray(function (err, docs) {
            err ? reject(err) : resolve(docs);
        });
    });
}

module.exports = { create, findOne, find, update, all };