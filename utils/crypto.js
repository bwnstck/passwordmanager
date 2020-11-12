const CryptoJS = require("crypto-js");

function encrypt(data, pwd) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), pwd).toString();
}
function decrypt(data, pwd) {
  const bytes = CryptoJS.AES.decrypt(data, pwd);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

module.exports = {
  encrypt,
  decrypt,
};
