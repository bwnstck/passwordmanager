const CryptoJS = require("crypto-js");
const fs = require("fs").promises;
const inquirer = require("inquirer");
const encryptKey = "adminadmin";

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

function encrypt(data, pwd) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), pwd).toString();
}
function decrypt(data, pwd) {
  const bytes = CryptoJS.AES.decrypt(data, pwd);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

const getPwdObj = async () => {
  const data = await fs.readFile("./pwd.json", "utf8");
  const pwdObj = await JSON.parse(data);
  return pwdObj;
};

async function getNewEncryptedEntry() {
  const { title } = await inquirer.prompt(askForTitel);
  const { mail } = await inquirer.prompt(askForMail);
  const encryptedMail = encrypt(mail, encryptKey);
  const { pwd } = await inquirer.prompt(askForNewPassword);
  const encryptedPw = encrypt(pwd, encryptKey);

  return { [title]: { email: encryptedMail, pwd: encryptedPw } };
}

module.exports = {
  encrypt,
  decrypt,
  getPwdObj,
  getNewEncryptedEntry,
  encryptKey,
};
