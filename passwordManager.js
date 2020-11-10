const inquirer = require("inquirer");
const fs = require("fs").promises;

const questions = [
  {
    type: "input",
    name: "query",
    message: "🔘 Show password for?",
  },
];

const masterPassword = [
  {
    type: "password",
    name: "masterPwd",
    message: "🔒 Enter MasterPassword 🔒 ",
  },
];

const getPwd = async () => {
  const data = await fs.readFile("./pwd.json", "utf8");
  const pwd = await JSON.parse(data);
  return pwd;
};

function start() {
  inquirer.prompt(masterPassword).then((answer) => {
    if (answer["masterPwd"] === "admin") {
      searchDB();
    } else {
      console.log("so stupid... try again 🦹🏽‍♀ ️ ");
      start();
    }
  });
}

async function searchDB() {
  //   console.log("blubb", await getPwd());
  const pwdObj = await getPwd();

  inquirer
    .prompt(questions)
    .then((answers) => {
      const searchQuery = answers["query"];
      if (pwdObj[searchQuery]) {
        console.log("🔒 ", pwdObj[searchQuery].name);
        console.log("🔑 ", pwdObj[searchQuery].pwd);
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
