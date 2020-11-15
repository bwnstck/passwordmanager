const askForMasterPassword = [
  {
    type: "password",
    name: "masterInput",
    message: "🔒 Enter MasterPassword 🔒 ",
  },
];
const askForEntry = [
  {
    type: "input",
    name: "query",
    message: "🔘 For which entry?",
  },
];

const SEARCH = "Search in your database";
const DELETE = "Delete";
const ADD = "Add";
const EXIT = "Exit";

const areYouSure = [
  {
    type: "confirm",
    name: "answer",
    message: "Are you sure? (YES/NO)",
  },
];
const choices = [
  {
    type: "list",
    name: "choice",
    message: "What you wanna do? 🍭",
    choices: [SEARCH, ADD, DELETE, EXIT],
  },
];

const DELETEONE = "Delete a single entry";
const DELETEALL = "Delete EVERYTHING ... 🤦️";

const deleteGeneral = [
  {
    type: "list",
    name: "choice",
    message: "What you wanna do? 🍭",
    choices: [DELETEONE, DELETEALL],
  },
];

const SEARCHONE = "Search one entry";
const SEARCHALL = "Show all";
const SEARCHMAIL = "Search for specific mail";

const dbSearchChoices = [
  {
    type: "list",
    name: "dbChoice",
    message: "What you wanna do? 🍭",
    choices: [SEARCHONE, SEARCHMAIL, SEARCHALL],
  },
];

const mailSearch = [
  {
    type: "input",
    name: "mailPicked",
    message: "Enter e-mail you want to show entries from:",
  },
];
module.exports = {
  askForMasterPassword,
  askForEntry,
  SEARCH,
  DELETE,
  ADD,
  EXIT,
  areYouSure,
  choices,
  DELETEONE,
  DELETEALL,
  deleteGeneral,
  SEARCHONE,
  SEARCHALL,
  SEARCHMAIL,
  dbSearchChoices,
  mailSearch,
};
