require("dotenv").config();

const inquirer = require("inquirer");
inquirer.registerPrompt("search-list", require("inquirer-search-list"));

const crypto = require("./utils/crypto");
const questions = require("./lib/questions");

const { loadingAnimation } = require("./utils/load");
const { bold, yellow, red, magenta, dim, white, cyan, blue } = require("kleur");
const {
  close,
  setCollection,
  replaceOne,
  findInDataBase,
  listDbEntries,
  deleteOne,
  deleteAll,
  listEntriesFromMail,
} = require("./utils/database");

const capitalizeFLetter = (string) => string[0].toUpperCase() + string.slice(1);
start();

async function start() {
  console.log("\n", "-----------------------------------");
  console.log(magenta().bold(`--== ${white("Password Safe 2000")} ==--`));
  console.log(
    bold(`\n     Welcome back ${cyan(capitalizeFLetter(process.env.USER))} `)
  );
  console.log(yellow().bold(`\n     You are running on`));
  console.log(blue(`          ${process.env.LC_TERMINAL} `));
  console.log("-----------------------------------", "\n");
  await loadingAnimation();
  console.log("\n", "-----------------------------------", "\n");
  const { masterInput } = await inquirer.prompt(questions.askForMasterPassword);

  if (masterInput === process.env.MASTER_PWD) {
    await makeChoice();
  } else {
    console.log(yellow().bgRed("...so stupid... try again 🦹"));
    start();
  }
}

async function makeChoice() {
  const { choice } = await inquirer.prompt(questions.choices);

  if (choice === questions.SEARCH) {
    const { dbChoice } = await inquirer.prompt(questions.dbSearchChoices);
    if (dbChoice === questions.SEARCHONE) {
      const entries = await listDbEntries();
      if (entries) {
        await searchDB();
      } else {
        await makeChoice();
      }
    }
    if (dbChoice === questions.SEARCHALL) {
      await listDbEntries();
      await makeChoice();
    }
    if (dbChoice === questions.SEARCHMAIL) {
      const { mailPicked } = await inquirer.prompt(questions.mailSearch);
      await listEntriesFromMail(mailPicked);
      await makeChoice();
    }
  } else if (choice === questions.ADD) {
    await addEntryToDB();
  } else if (choice === questions.DELETE) {
    await deleteEntry();
  } else if (choice === questions.EXIT) {
    await closeSession();
  } else {
    makeChoice();
  }
}

async function deleteEntry() {
  await listDbEntries();
  const { choice } = await inquirer.prompt(questions.deleteGeneral);

  if (choice === questions.DELETEONE) {
    const { query } = await inquirer.prompt(questions.askForEntry);
    const { answer } = await inquirer.prompt(questions.areYouSure);
    if (!answer) {
      return makeChoice();
    } else {
      await deleteOne(query);
      return makeChoice();
    }
  } else {
    await deleteAllEntries();
    return makeChoice();
  }
}

async function deleteAllEntries() {
  const { answer } = await inquirer.prompt(questions.areYouSure);
  if (answer === false) {
    return makeChoice();
  } else {
    await deleteAll();
    return makeChoice();
  }
}

async function searchDB() {
  const { query } = await inquirer.prompt(questions.askForEntry);

  const entry = await findInDataBase(query);

  if (entry) {
    const pwd = crypto.decrypt(entry.pwd, process.env.CRYPTO_PWD);
    const email = crypto.decrypt(entry.email, process.env.CRYPTO_PWD);
    console.log("---------You searched for----------");
    console.log("🎯 Titel: ", red().bold(entry.title));
    console.log("📧 Mail: ", bold(email));
    console.log("🔐 Pwd: ", bold().green(pwd));
    console.log("-----------------------------------");
    return makeChoice();
  } else {
    console.log("\n-----------------------------------");
    console.log(" ♦️ No password safed... try again ♦️");
    console.log("-----------------------------------\n");
    return makeChoice();
  }
}

async function addEntryToDB() {
  const newEntryObj = await crypto.getNewEncryptedEntry();
  const collection = await setCollection("passwords");
  await replaceOne(collection, newEntryObj);
  console.log("\n-----Password created------------");
  console.log(newEntryObj.title, " saved in Database 🚀");
  console.log("-----------------------------------\n");

  return makeChoice();
}

async function closeSession() {
  await close();
  console.log("\n", bold("🇵🇱🥦 Do zobaczenia! 🖖"), "\n");
}
