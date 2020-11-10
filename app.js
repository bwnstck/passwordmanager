const wifi = {
  name: "MartinRouterKing",
  pwd: "a0f-2faw-vajv3-a0a-",
};
// ! First Try with minimist
// const args = require("minimist")(process.argv.slice(2));
// if (args["pwd"] === "wifi") console.log(wifi);

// ! 2.Try with readline
// const readline = require("readline").createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// readline.question(`Show password for... `, (name) => {
//   if (name === "wifi") console.log(wifi);
//   readline.close();
// });

// ! Inquirer.js

const inquirer = require("inquirer");

var questions = [
  {
    type: "input",
    name: "pwd",
    message: "Show password for?",
  },
];
var masterPassword = [
  {
    type: "password",
    name: "masterPwd",
    message: "Enter MasterPassword:",
  },
];

function startPasswordManager() {
  inquirer.prompt(masterPassword).then((answer) => {
    if (answer["masterPwd"] === "admin") {
      (function searchDB() {
        inquirer
          .prompt(questions)
          .then((answers) => {
            if (answers["pwd"] === "wifi") {
              console.log(wifi);
            } else {
              console.log("No password safed... try again");
              searchDB();
            }
          })
          .catch((error) => {
            console.log("error", error);
          });
      })();
    } else {
      console.log("so stupid... try again");
      startPasswordManager();
    }
  });
}

startPasswordManager();
