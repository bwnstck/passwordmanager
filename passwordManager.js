const inquirer = require("inquirer");
const crypto = require("./utils/crypto");
const fs = require("fs").promises;
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const masterPwd = "admin";
const { bold, green, red, yellow, bgRed } = require("kleur");

const url =
  "mongodb+srv://benji:oaTFzcd3OwyV7kFI@cluster0.7pj4b.mongodb.net/pwmanager?retryWrites=true&w=majority";

MongoClient.connect(url, function (err, client) {
  const db = client.db();
  assert.strictEqual(null, err);

  db.collection("passwords")
    .insertOne({
      mongodbAtlas: {
        email: "benji@blubb.de",
        pwd: "adfa0df0a0faf",
      },
    })
    .then(function (result) {
      console.log("🚀 entry saved", result.ops);
    });
  // client.close();
});

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
  const pwdObj = await crypto.getPwdObj();

  const { query } = await inquirer.prompt(askForPassword);

  const entry = pwdObj[query];

  if (entry) {
    const pwd = crypto.decrypt(entry.pwd, crypto.encryptKey);
    const email = crypto.decrypt(entry.email, crypto.encryptKey);
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
  const newEntryObj = await crypto.getNewEncryptedEntry();
  const pwdObj = await crypto.getPwdObj();

  const dataEntry = JSON.stringify(Object.assign(pwdObj, newEntryObj));
  await fs.writeFile("./pwd.json", dataEntry);
  console.log(Object.keys(newEntryObj)[0], "Entry saved 🚀");
}
