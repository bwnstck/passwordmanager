const inquirer = require("inquirer");

const crypto = require("./utils/crypto");

const masterPwd = "admin";
const encryptKey = "adminadmin";

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

const SEARCH = "Search";

const choices = [
  {
    type: "list",
    name: "choice",
    message: "What you wanna do? 🍭",
    choices: [SEARCH, "Add"],
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
  //! Wie kann man abgleichen ohne den ganzen Wert angeben zu müssen
  if (choice === SEARCH) {
    return searchDB();
  } else if (choice === "Add") {
    return addEntryToDB();
  }
}

async function searchDB() {
  const pwdObj = await crypto.getPwdObj();

  const answers = await inquirer.prompt(askForPassword);

  const searchQuery = answers["query"];
  const entry = pwdObj[searchQuery];
  if (entry) {
    const pwd = crypto.decrypt(entry.pwd, encryptKey);
    const email = crypto.decrypt(entry.email, encryptKey);
    console.log("🔒 ", email);
    console.log("🔑 ", pwd);
  } else {
    console.log("No password safed... try again");
    searchDB();
  }
}

async function addEntryToDB() {
  const { title } = await inquirer.prompt(askForTitel);
  const { mail } = await inquirer.prompt(askForMail);
  const encryptedMail = crypto.encrypt(mail, encryptKey);
  const { pwd } = await inquirer.prompt(askForNewPassword);
  const encryptedPw = crypto.encrypt(pwd, encryptKey);
  //!Warum müssen gleiche prop/keys nur einmal genannt werden
  const newEntryObj = { [title]: { email: encryptedMail, pwd: encryptedPw } };
  const pwdObj = await getPwdObj();

  const dataEntry = JSON.stringify(Object.assign(pwdObj, newEntryObj), null, 2);
  await fs.writeFile("./pwd.json", dataEntry);
  console.log("Entry saved 🚀");
}

module.exports = { start };
