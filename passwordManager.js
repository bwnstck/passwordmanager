const inquirer = require("inquirer");
const crypto = require("./utils/crypto");

const masterPwd = "admin";
const { bold, yellow, bgRed, red } = require("kleur");
const {
  connect,
  close,
  setCollection,
  replaceOne,
  findInDataBase,
  deleteOne,
} = require("./utils/database");

const askForMasterPassword = [
  {
    type: "password",
    name: "masterInput",
    message: "🔒 Enter MasterPassword 🔒 ",
  },
];
const askForEntry = [
  {
    type: "input",
    name: "query",
    message: "🔘 For which entry?",
  },
];

const SEARCH = "Search your database";
const DELETE = "Delete";
const ADD = "Add";

const choices = [
  {
    type: "list",
    name: "choice",
    message: "What you wanna do? 🍭",
    choices: [SEARCH, ADD, DELETE],
  },
];

start();

async function start() {
  console.log("Connecting to database...");
  await connect(
    "mongodb+srv://benji:oaTFzcd3OwyV7kFI@cluster0.7pj4b.mongodb.net/pwmanager?retryWrites=true&w=majority",
    "pwmanager"
  );
  console.log("Connected to database 🎉");

  const { masterInput } = await inquirer.prompt(askForMasterPassword);

  if (masterInput === masterPwd) {
    await makeChoice();
  } else {
    console.log(yellow().bgRed("...so stupid... try again 🦹"));
    start();
  }
}

async function makeChoice() {
  const { choice } = await inquirer.prompt(choices);

  if (choice === SEARCH) {
    searchDB();
  } else if (choice === ADD) {
    await addEntryToDB();
  } else if (choice === DELETE) {
    await deleteEntry();
  }
}

async function deleteEntry() {
  const { query } = await inquirer.prompt(askForEntry);

  await deleteOne(query);
  await closeSession();
}

async function searchDB() {
  const { query } = await inquirer.prompt(askForEntry);

  const entry = await findInDataBase(query);

  if (entry) {
    const pwd = crypto.decrypt(entry.pwd, crypto.encryptKey);
    const email = crypto.decrypt(entry.email, crypto.encryptKey);
    console.log("-----------------------------------");
    console.log("🎯 Titel: ", red().bold(entry.title));
    console.log("📧 Mail: ", bold(email));
    console.log("🔐 Pwd: ", bold().green(pwd));
    console.log("-----------------------------------");
    await closeSession();
  } else {
    console.log("No password safed... try again");
    return searchDB();
  }
}

async function addEntryToDB() {
  const newEntryObj = await crypto.getNewEncryptedEntry();
  const collection = await setCollection("passwords");
  await replaceOne(collection, newEntryObj);
  console.log(newEntryObj.title, "Entry saved 🚀");
  await closeSession();
}

async function closeSession() {
  await close();
  console.log(bold("tschüssi!🥦"));
}
