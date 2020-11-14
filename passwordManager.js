require("dotenv").config();

const inquirer = require("inquirer");
const crypto = require("./utils/crypto");
<<<<<<< HEAD
=======
const {
  encryptKey,
  getPwdObj,
  getNewEncryptedEntry,
} = require("./utils/pwdHelpers");
const fs = require("fs").promises;
const masterPwd = "admin";
>>>>>>> EncryptedMasterKey

const { loadingAnimation } = require("./utils/load");
const { bold, yellow, red, magenta, dim, white } = require("kleur");
const {
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
<<<<<<< HEAD

async function start() {
  console.log("-----------------------------------");
  console.log(magenta().bold(`--== ${white("Database Attack 2000")} ==--`));
  console.log("-----------------------------------");
  await loadingAnimation();
  const { masterInput } = await inquirer.prompt(askForMasterPassword);

  if (masterInput === process.env.MASTER_PWD) {
    await makeChoice();
  } else {
    console.log(yellow().bgRed("...so stupid... try again 🦹"));
    start();
  }
=======
function start() {
  _;
  inquirer.prompt(askForMasterPassword).then((answer) => {
    if (answer["masterPwd"] === masterPwd) {
      return makeChoice();
    } else {
      console.log(yellow().bgRed("...so stupid... try again 🦹"));
      return start();
    }
  });
>>>>>>> EncryptedMasterKey
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

<<<<<<< HEAD
async function deleteEntry() {
  const { query } = await inquirer.prompt(askForEntry);

  await deleteOne(query);
  await closeSession();
}
=======
async function searchDB() {
  const pwdObj = await getPwdObj();
>>>>>>> EncryptedMasterKey

async function searchDB() {
  const { query } = await inquirer.prompt(askForEntry);

  const entry = await findInDataBase(query);

  if (entry) {
    const pwd = crypto.decrypt(entry.pwd, encryptKey);
    const email = crypto.decrypt(entry.email, encryptKey);
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
<<<<<<< HEAD
  const newEntryObj = await crypto.getNewEncryptedEntry();
  const collection = await setCollection("passwords");
  await replaceOne(collection, newEntryObj);
  console.log(newEntryObj.title, "Entry saved 🚀");
  await closeSession();
}
=======
  const newEntryObj = await getNewEncryptedEntry();
  const pwdObj = await getPwdObj();
>>>>>>> EncryptedMasterKey

async function closeSession() {
  await close();
  console.log(bold("🇵🇱 Do zobaczenia! 🥦"));
}
