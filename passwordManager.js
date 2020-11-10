const inquirer = require("inquirer");
const fs = require("fs").promises;
const CryptoJS = require("crypto-js");

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

const getPwdObj = async () => {
  const data = await fs.readFile("./pwd.json", "utf8");
  const pwdObj = await JSON.parse(data);
  return pwdObj;
};

function start() {
  inquirer.prompt(askForMasterPassword).then((answer) => {
    if (answer["masterPwd"] === "adminadmin") {
      makeChoice();
    } else {
      console.log("so stupid... try again 🦹🏽‍♀");
      start();
    }
  });
}

const choices = [
  {
    type: "list",
    name: "choice",
    message: "What you wanna do? 🍭",
    choices: ["Search", "Add"],
  },
];

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
    const name = decryptData(entry.name, "adminadmin");
    const pwd = decryptData(entry.pwd, "adminadmin");
    console.log("🔒 ", name);
    console.log("🔑 ", pwd);
  } else {
    console.log("No password safed... try again");
    searchDB();
  }
}

const askForTitel = [
  {
    type: "text",
    name: "title",
    message: "Title to save:",
  },
];
const askForName = [
  {
    type: "text",
    name: "name",
    message: "Name to save:",
  },
];
const askForNewPassword = [
  {
    type: "text",
    name: "pwd",
    message: "pwd to save:",
  },
];

async function addEntryToDb() {
  const { title } = await inquirer.prompt(askForTitel);
  const { name } = await inquirer.prompt(askForName);
  const encryptedName = encryptData(name, "adminadmin");
  const { pwd } = await inquirer.prompt(askForNewPassword);
  const encryptedPw = encryptData(pwd, "adminadmin");
  //!Warum müssen gleiche prop/keys nur einmal genannt werden
  const newEntryObj = { [title]: { name: encryptedName, pwd: encryptedPw } };
  const pwdObj = await getPwdObj();

  const dataEntry = JSON.stringify(Object.assign(pwdObj, newEntryObj));
  await fs.writeFile("./pwd.json", dataEntry);
  console.log("Entry saved 🚀");
}

function encryptData(data, pwd) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), pwd).toString();
}
function decryptData(data, pwd) {
  const bytes = CryptoJS.AES.decrypt(data, pwd);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

module.exports = { start };
