const inquirer = require("inquirer");
const fs = require("fs").promises;
const crypto = require("./utils/crypto");

const masterPwd = "adminadmin";

const getPwdObj = async () => {
  const data = await fs.readFile("./pwd.json", "utf8");
  const pwdObj = await JSON.parse(data);
  return pwdObj;
};

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

const choices = [
  {
    type: "list",
    name: "choice",
    message: "What you wanna do? 🍭",
    choices: ["Search", "Add"],
  },
];
const askForTitel = [
  {
    type: "text",
    name: "title",
    message: "🥦 Title to save:",
  },
];
const askForMail = [
  {
    type: "text",
    name: "mail",
    message: "📭 Email Adress to save:",
  },
];
const askForNewPassword = [
  {
    type: "text",
    name: "pwd",
    message: "🔒 pwd to save:",
  },
];

function start() {
  inquirer.prompt(askForMasterPassword).then((answer) => {
    if (answer["masterPwd"] === masterPwd) {
      makeChoice();
    } else {
      console.log("so stupid... try again 🦹🏽‍♀");
      start();
    }
  });
}

async function makeChoice() {
  const { choice } = await inquirer.prompt(choices);
  if (choice === "Search") {
    searchDB();
  }
  if (choice === "Add") {
    addEntryToDb();
  }
}

async function searchDB() {
  const pwdObj = await getPwdObj();

  const answers = await inquirer.prompt(askForPassword);

  const searchQuery = answers["query"];
  const entry = pwdObj[searchQuery];
  if (entry) {
    const pwd = crypto.decrypt(entry.pwd, masterPwd);
    const email = crypto.decrypt(entry.email, masterPwd);
    console.log("🔒 ", email);
    console.log("🔑 ", pwd);
  } else {
    console.log("No password safed... try again");
    searchDB();
  }
}

async function addEntryToDb() {
  const { title } = await inquirer.prompt(askForTitel);
  const { mail } = await inquirer.prompt(askForMail);
  const encryptedMail = crypto.encrypt(mail, masterPwd);
  const { pwd } = await inquirer.prompt(askForNewPassword);
  const encryptedPw = crypto.encrypt(pwd, masterPwd);
  //!Warum müssen gleiche prop/keys nur einmal genannt werden
  const newEntryObj = { [title]: { email: encryptedMail, pwd: encryptedPw } };
  const pwdObj = await getPwdObj();

  const dataEntry = JSON.stringify(Object.assign(pwdObj, newEntryObj), null, 2);
  await fs.writeFile("./pwd.json", dataEntry);
  console.log("Entry saved 🚀");
}

module.exports = { start };
