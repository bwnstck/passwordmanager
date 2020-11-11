const CryptoJS = require("crypto-js");
const fs = require("fs").promises;

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

module.exports = { encrypt, decrypt, getPwdObj };
