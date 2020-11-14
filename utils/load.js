const ora = require("ora");
const { connect } = require("./database");

async function loadingAnimation() {
  const spinner = ora("searching for Mongo-DB 🍃").start();

  await waitASecond();
  spinner.color = "magenta";
  spinner.text = "find your DB on the Map 🗺 ";

  await waitASecond();
  spinner.color = "green";
  spinner.text = "running through the forest  🌳🦌🌳";

  // actual DB-Connect
  await waitASecond();
  spinner.color = "magenta";
  spinner.text = "Fighting against the security guards 🥷 💂💂";
  await connect(process.env.DB_URL, "pwmanager");

  await waitASecond();
  spinner.color = "magenta";
  spinner.succeed("Guards defeated... acces granted 🏆");
  spinner.stop();
}

async function waitASecond() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

exports.loadingAnimation = loadingAnimation;
