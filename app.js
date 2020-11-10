const wifi = {
  name: "MartinRouterKing",
  pwd: "a0f-2faw-vajv3-a0a-",
};
// ! First Try with minimist
// const args = require("minimist")(process.argv.slice(2));
// if (args["pwd"] === "wifi") console.log(wifi);

// ! 2.Try with readline
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question(`Show password for... `, (name) => {
  if (name === "wifi") console.log(wifi);
  readline.close();
});
