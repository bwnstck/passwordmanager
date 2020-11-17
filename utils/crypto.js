const CryptoJS = require("crypto-js");
const fs = require("fs").promises;
const inquirer = require("inquirer");

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
  return CryptoJS.AES.encrypt(data, pwd).toString();
}
function decrypt(data) {
  const bytes = CryptoJS.AES.decrypt(data, process.env.CRYPTO_PWD);
  return bytes.toString(CryptoJS.enc.Utf8);
}

const getPwdObj = async () => {
  const data = await fs.readFile("./pwd.json", "utf8");
  const pwdObj = await JSON.parse(data);
  return pwdObj;
};

async function encryptEntry(newEntryObj) {
  newEntryObj.email = encrypt(newEntryObj.email, process.env.CRYPTO_PWD);
  newEntryObj.pwd = encrypt(newEntryObj.pwd, process.env.CRYPTO_PWD);
  return newEntryObj;
}
async function getNewEncryptedEntry() {
  const { title } = await inquirer.prompt(askForTitel);
  const { mail } = await inquirer.prompt(askForMail);
  const encryptedMail = encrypt(mail, process.env.CRYPTO_PWD);
  const { pwd } = await inquirer.prompt(askForNewPassword);
  const encryptedPw = encrypt(pwd, process.env.CRYPTO_PWD);

  return { title, email: encryptedMail, pwd: encryptedPw };
}

module.exports = {
  encrypt,
  decrypt,
  getPwdObj,
  encryptEntry,
  getNewEncryptedEntry,
};
