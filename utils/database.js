const { red, bold, green } = require("kleur");
const { MongoClient } = require("mongodb");
const crypto = require("./crypto");
let client;
let db;
let collection;

async function connect(url, dbName) {
  try {
    client = await MongoClient.connect(url, { useUnifiedTopology: true });
  } catch (error) {
    console.log(
      "\n \n ----------------------------------- \n \n",
      error,
      "\n \n ----------------------------------- \n \n",
      "⛔️ You've been defeated by the guards 🤺🤺🤺 ⛔️",
      "\n \n"
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

async function listDbEntries() {
  try {
    const entries = await collection.find({});
    await entries.forEach((entry) => {
      console.log(JSON.stringify(entry));
      console.log("🎯", red().bold(entry.title));
      // console.log("✉️", entry.email);
      console.log("-----------------------------------");
    });
    return;
  } catch (error) {
    console.error("Error while listing entries \n", error);
  }
}
async function listEntriesFromMail(mailQuery) {
  let entries;
  try {
    entries = await collection.find({});
  } catch (error) {
    console.error("Error while listing entries \n", error);
  }
  const encryptedEntries = await entries
    .map((entry) => {
      return entry;
    })
    .toArray();
  console.log({ encryptedEntries });

  const decryptedEntries = await encryptedEntries.map((entry) => {
    entry.email = crypto.decrypt(entry.email);
    entry.pwd = crypto.decrypt(entry.pwd);
    return entry;
  });
  console.log(decryptedEntries);
  const result = decryptedEntries.filter((entry, index) => {
    console.log(index, " entry mail: ", entry.email);
    return entry.email === mailQuery;
  });

  if (result.length > 0) {
    console.log(` All entries for ${mailQuery}`);
    await result.forEach((entry) => {
      console.log("🎯", red().bold(entry.title));
      console.log("🎯", entry.mail);
      console.log("-----------------------------------");
    });
  } else {
    console.log(`\n...no entries found for ${mailQuery} 🤷 \n`);
  }

  return;
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
exports.listDbEntries = listDbEntries;
exports.deleteOne = deleteOne;
exports.listEntriesFromMail = listEntriesFromMail;
