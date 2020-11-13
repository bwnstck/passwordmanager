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
} = require("./utils/database");

const askForMasterPassword = [
  {
    type: "password",
    name: "masterPwd",
    message: "🔒 Enter MasterPassword 🔒 ",
  },
];
const askForEntry = [
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
async function start() {
  console.log("Connecting to database...");
  await connect(
    "mongodb+srv://benji:oaTFzcd3OwyV7kFI@cluster0.7pj4b.mongodb.net/pwmanager?retryWrites=true&w=majority",
    "pwmanager"
  );
  console.log("Connected to database 🎉");

  inquirer.prompt(askForMasterPassword).then(async (answer) => {
    if (answer["masterPwd"] === masterPwd) {
      return await makeChoice();
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
    return await addEntryToDB();
  }
}

async function searchDB() {
  // const pwdObj = await crypto.getPwdObj();

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
  // // const pwdObj = await crypto.getPwdObj();
  const collection = await setCollection("passwords");
  // const dataEntry = JSON.stringify(Object.assign(pwdObj, newEntryObj));
  // await fs.writeFile("./pwd.json", dataEntry);
  // await setCollection("passwords").insertOne(newEntryObj);
  await replaceOne(collection, newEntryObj);
  console.log(newEntryObj.title, "Entry saved 🚀");
  await closeSession();
}

async function closeSession() {
  await close();
  console.log(bold("tschüssi!🥦"));
}
