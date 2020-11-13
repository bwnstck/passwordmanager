const { MongoClient } = require("mongodb");

let client;
let db;
let collection;

async function connect(url, dbName) {
  // Use connect method to connect to the Server
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

  //   await result.forEach(iterateFunc, errorFunc);

  //   function errorFunc(error) {
  //     console.log(error);
  //   }

  //   function iterateFunc(entry) {
  //     return JSON.stringify(entry, null, 4);
  //   }

  //   const resultString = JSON.stringify(result, null, 4);
  //   console.log(result);
  return result;
}

exports.connect = connect;
exports.close = close;
exports.setCollection = setCollection;
exports.replaceOne = replaceOne;
exports.findInDataBase = findInDataBase;
