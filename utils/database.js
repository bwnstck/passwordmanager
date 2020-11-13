const { MongoClient } = require("mongodb");

let client;
let db;
let collection;

async function connect(url, dbName) {
  client = await MongoClient.connect(url, { useUnifiedTopology: true });
  db = client.db(dbName);
  collection = db.collection("passwords");
}

function close() {
  return client.close();
}

function setCollection(name) {
  collection = db.collection(name);
  return collection;
}

async function replaceOne(collection, newEntryObj) {
  try {
    await collection.replaceOne({ title: newEntryObj.title }, newEntryObj, {
      upsert: true,
    });
  } catch (e) {
    console.error(e);
  }
}

async function findInDataBase(query) {
  const result = await collection.findOne({ title: query });
  return result;
}

exports.connect = connect;
exports.close = close;
exports.setCollection = setCollection;
exports.replaceOne = replaceOne;
exports.findInDataBase = findInDataBase;
