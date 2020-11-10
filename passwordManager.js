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
  const pwdObj = await JSON.parse(data);
  return pwdObj;
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
  const pwdObj = await getPwd();

  const answers = await inquirer.prompt(questions);

  const searchQuery = answers["query"];
  const pwd = pwdObj[searchQuery];
  if (pwd) {
    console.log("🔒 ", pwd.name);
    console.log("🔑 ", pwd.pwd);
  } else {
    console.log("No password safed... try again");
    searchDB();
  }

  // .catch((error) => {
  //   console.log("error", error);
  // });
  console.log("wann werde ich aufgerufen???🐺");
}

module.exports = { start, searchDB };
