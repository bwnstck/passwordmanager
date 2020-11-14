const { MongoClient } = require("mongodb");

let client;
let db;
let collection;

async function connect(url, dbName) {
  try {
    client = await MongoClient.connect(url, { useUnifiedTopology: true });
  } catch (error) {
    console.log(
      "\n \n \n \n",
      "⛔️ You've been defeated by the guards 🤺🤺🤺",
      "\n \n \n \n",
      error
    );
    process.exit(1);
  }
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
  try {
    const result = await collection.findOne({ title: query });
    return result;
  } catch (error) {
    console.error(error);
  }
}
async function deleteOne(query) {
  try {
    await collection.deleteOne({ title: query });
    console.log(`${query} removed forever`);
  } catch (error) {
    console.error(error);
  }
}

exports.connect = connect;
exports.close = close;
exports.setCollection = setCollection;
exports.replaceOne = replaceOne;
exports.findInDataBase = findInDataBase;
exports.deleteOne = deleteOne;
