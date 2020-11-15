require("dotenv").config();

const inquirer = require("inquirer");
const crypto = require("./utils/crypto");

const { loadingAnimation } = require("./utils/load");
const { bold, yellow, red, magenta, dim, white } = require("kleur");
const {
  close,
  setCollection,
  replaceOne,
  findInDataBase,
  listDbEntries,
  deleteOne,
  listEntriesFromMail,
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

const SEARCH = "Search in your database";
const DELETE = "Delete";
const ADD = "Add";
const EXIT = "Exit";

const choices = [
  {
    type: "list",
    name: "choice",
    message: "What you wanna do? 🍭",
    choices: [SEARCH, ADD, DELETE, EXIT],
  },
];

const SEARCHONE = "Search one entry";
const SEARCHALL = "Show all";
const SEARCHMAIL = "Search for specific mail";

const dbSearchChoices = [
  {
    type: "list",
    name: "dbChoice",
    message: "What you wanna do? 🍭",
    choices: [SEARCHONE, SEARCHMAIL, SEARCHALL],
  },
];

const mailSearch = [
  {
    type: "input",
    name: "mailPicked",
    message: "Enter e-mail you want to show entries from:",
  },
];

start();

async function start() {
  console.log("\n", "-----------------------------------");
  console.log(magenta().bold(`--== ${white("Password Safe 2000")} ==--`));
  console.log("-----------------------------------", "\n");
  await loadingAnimation();
  console.log("\n", "-----------------------------------", "\n");

  const { masterInput } = await inquirer.prompt(askForMasterPassword);

  if (masterInput === process.env.MASTER_PWD) {
    await makeChoice();
  } else {
    console.log(yellow().bgRed("...so stupid... try again 🦹"));
    start();
  }
}

async function makeChoice() {
  const { choice } = await inquirer.prompt(choices);

  if (choice === SEARCH) {
    const { dbChoice } = await inquirer.prompt(dbSearchChoices);
    if (dbChoice === SEARCHONE) {
      searchDB();
    }
    if (dbChoice === SEARCHALL) {
      await listDbEntries();
      await makeChoice();
    }
    if (dbChoice === SEARCHMAIL) {
      const { mailPicked } = await inquirer.prompt(mailSearch);
      await listEntriesFromMail(mailPicked);
      await makeChoice();
    }
  } else if (choice === ADD) {
    await addEntryToDB();
  } else if (choice === DELETE) {
    await deleteEntry();
  } else if (choice === EXIT) {
    await closeSession();
  } else {
    makeChoice();
  }
}

async function deleteEntry() {
  const { query } = await inquirer.prompt(askForEntry);

  await deleteOne(query);
  return makeChoice();
}

async function searchDB() {
  const { query } = await inquirer.prompt(askForEntry);

  const entry = await findInDataBase(query);

  if (entry) {
    const pwd = crypto.decrypt(entry.pwd, process.env.CRYPTO_PWD);
    const email = crypto.decrypt(entry.email, process.env.CRYPTO_PWD);
    console.log("-----------------------------------");
    console.log("🎯 Titel: ", red().bold(entry.title));
    console.log("📧 Mail: ", bold(email));
    console.log("🔐 Pwd: ", bold().green(pwd));
    console.log("-----------------------------------");
    return makeChoice();
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
  return makeChoice();
}

async function closeSession() {
  await close();
  console.log("\n", bold("🇵🇱🥦 Do zobaczenia! 🖖"), "\n");
}
