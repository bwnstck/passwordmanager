const inquirer = require("inquirer");
const fs = require(fs);

fs.readFile("./pwds.json");

const pwd = require("./pwds.json");

var questions = [
  {
    type: "input",
    name: "pwd",
    message: "🔘 Show password for?",
  },
];
var masterPassword = [
  {
    type: "password",
    name: "masterPwd",
    message: "🔒 Enter MasterPassword 🔒 ",
  },
];

function start() {
  inquirer.prompt(masterPassword).then((answer) => {
    if (answer["masterPwd"] === "admin") {
      searchDB();
    } else {
      console.log("so stupid... try again 🦹🏽‍♀ ️ ");
      startPasswordManager();
    }
  });
}

function searchDB() {
  inquirer
    .prompt(questions)
    .then((answers) => {
      if (answers["pwd"] === "wifi") {
        console.log("🔒 ", pwd.name);
        console.log("🔑 ", pwd.pwd);
      } else {
        console.log("No password safed... try again");
        searchDB();
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
}

module.exports = { start, searchDB };
