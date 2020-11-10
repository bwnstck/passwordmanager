const inquirer = require("inquirer");
const fs = require("fs").promises;
// const CryptoJS = require("crypto-js");

// const data = "Super wichtiges Passwort";
// console.log("Text", data);
// // Encrypt
// const ciphertext = CryptoJS.AES.encrypt(
//   JSON.stringify(data),
//   "adminadmin"
// ).toString();
// console.log("encrypted", ciphertext);
// // Decrypt
// const bytes = CryptoJS.AES.decrypt(ciphertext, "adminadmin");
// const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
// console.log("decrypted", decryptedData);

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

const getPwd = async () => {
  const data = await fs.readFile("./pwd.json", "utf8");
  const pwdObj = await JSON.parse(data);
  return pwdObj;
};

function start() {
  inquirer.prompt(askForMasterPassword).then((answer) => {
    if (answer["masterPwd"] === "admin") {
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
    console.log("Add Item");
  }
}

async function searchDB() {
  const pwdObj = await getPwd();

  const answers = await inquirer.prompt(askForPassword);

  const searchQuery = answers["query"];
  const entry = pwdObj[searchQuery];
  if (entry) {
    console.log("🔒 ", entry.name);
    console.log("🔑 ", entry.pwd);
  } else {
    console.log("No password safed... try again");
    searchDB();
  }
}

// const askForTitel = [
//   {
//     type: "text",
//     name: "title",
//     message: "Title to save:",
//   },
// ];
// const askForName = [
//   {
//     type: "text",
//     name: "name",
//     message: "Name to save:",
//   },
// ];
// const askForPassword = [
//   {
//     type: "text",
//     name: "pwd",
//     message: "pwd to save:",
//   },
// ];

// function getEntry() {
//   const titel = inquirer.prompt(askForTitel);
//   const name = inquirer.prompt(askForName);
//   const pwd = inquirer.prompt(askForPassword);
//   return `${titel}:{name: ${name}, pwd: ${pwd}}`;
// }

module.exports = { start, searchDB };
