require("dotenv").config();

const { request } = require("express");
const express = require("express");
const {
  findInDataBase,
  replaceOne,
  listDbEntries,
  addEntryToDB,
  deleteOne,
} = require("./utils/database");
const { loadingAnimation } = require("./utils/load");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});

const port = 3001;

//! List all entries
app.get("/api/passwords/", async (request, response) => {
  console.log("test");
  const allEntries = await listDbEntries(false);
  console.log({ allEntries });
  response.send(allEntries);
});

app.delete("/api/passwords/:title", function (req, res) {
  const { title } = req.params;
  try {
    deleteOne(title);
    res.send(`${title} was deleted! say goodby`);
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send(
        "An unexpected error occured. Please reboot your Computer or Press ALT+F4"
      );
    s;
  }
});

//! List a specific name
app.get("/api/passwords/:name", async (request, response) => {
  const { name } = request.params;
  const passwordValue = await findInDataBase(name);
  response.send(passwordValue);
});

//! Add a entry
app.post("/api/passwords/", async (request, response) => {
  const newEntry = request.body;
  try {
    await addEntryToDB((terminal = false), {
      title: newEntry.title,
      email: newEntry.email,
      pwd: newEntry.pwd,
    });
    response.send(`Yay, password for ${newEntry.title} set! `);
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send(
        "An unexpected error occured. Please reboot your Computer or Press ALT+F4"
      );
  }
});

// app.put("/api/passwords/", function (req, res) {
//   res.send("Got a PUT request at /user");
// });

async function run() {
  await loadingAnimation();

  app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
  });
}
run();
