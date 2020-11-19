require("dotenv").config();

const { request } = require("express");
const express = require("express");
const path = require("path");

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

const port = process.env.port || 3002;

//! List all entries
app.get("/api/passwords", async (request, response) => {
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
  try {
    const { name } = request.params;
    const passwordValue = await findInDataBase(name);
    // passwordValue.json();
    console.log("pwValue", passwordValue);

    if (!passwordValue) {
      response.status(404).send("No password for input");
      return;
    }
    response.json(passwordValue);
  } catch (error) {
    console.error(error);
    response.status(419).send("Internal Server Error because of TeaPot");
  }
});

//! Add a entry
app.post("/api/passwords", async (request, response) => {
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

app.use(express.static(path.join(__dirname, "client/build")));

app.use(
  "/storybook",
  express.static(path.join(__dirname, "client/storybook-static"))
);

app.get("*", (request, response) => {
  response.sendFile(path.join(__dirname, "client/build", "index.html"));
});

async function run() {
  await loadingAnimation();

  app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
  });
}
run();
