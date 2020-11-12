const inquirer = require("inquirer");
const crypto = require("./utils/crypto");
const {
  encryptKey,
  getPwdObj,
  getNewEncryptedEntry,
} = require("./utils/pwdHelpers");
const fs = require("fs").promises;
const masterPwd = "admin";

const { bold, green, red, yellow, bgRed } = require("kleur");

const askForMasterPassword = [
  {
    type: "password",
    name: "masterPwd",
    message: "🔒 Enter MasterPassword 🔒 ",
  },
];
const askForPassword = [
  {
    type: "input",
    name: "query",
    message: "🔘 Show password for?",
  },
];

const SEARCH = "Search your database";

const choices = [
  {
    type: "list",
    name: "choice",
    message: "What you wanna do? 🍭",
    choices: [SEARCH, "Add"],
  },
];

start();
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
}

async function makeChoice() {
  const { choice } = await inquirer.prompt(choices);

  if (choice === SEARCH) {
    return searchDB();
  } else if (choice === "Add") {
    return addEntryToDB();
  }
}

async function searchDB() {
  const pwdObj = await getPwdObj();

  const { query } = await inquirer.prompt(askForPassword);

  const entry = pwdObj[query];

  if (entry) {
    const pwd = crypto.decrypt(entry.pwd, encryptKey);
    const email = crypto.decrypt(entry.email, encryptKey);
    console.log("-----------------------------------");
    console.log("📧 Mail: ", bold(email));
    console.log("🔐 Pwd: ", bold().green(pwd));
    console.log("-----------------------------------");
  } else {
    console.log("No password safed... try again");
    return searchDB();
  }
}

async function addEntryToDB() {
  const newEntryObj = await getNewEncryptedEntry();
  const pwdObj = await getPwdObj();

  const dataEntry = JSON.stringify(Object.assign(pwdObj, newEntryObj));
  await fs.writeFile("./pwd.json", dataEntry);
  console.log(Object.keys(newEntryObj)[0], "Entry saved 🚀");
}
