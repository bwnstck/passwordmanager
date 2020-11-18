import { useState } from "react";
import styled from "styled-components/macro";
import "./App.css";
// import crypto from "../../utils/crypto";
const PasswordSearchForm = styled.form`
  width: 80%;
`;
const PasswordInput = styled.input``;

function App() {
  const [searchEntries, setSearchEntries] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // function decryptEntries(entries) {
  //   const encryptedEntries = entries.map((entry) => {
  //     entry.pwd = crypto.decrypt(entry.pwd, process.env.CRYPTO_PWD);
  //     entry.email = crypto.decrypt(entry.email, process.env.CRYPTO_PWD);
  //   });
  //   return encryptedEntries;
  // }

  const handleSubmit = async (inputValue) => {
    const passwords = await getSpecificEntryExpress(inputValue);
    // const encryptedEntries = decryptEntries(passwords);
    setSearchEntries(passwords);
  };

  return (
    <div className="App">
      <PasswordSearchForm
        onSubmit={async (event) => {
          event.preventDefault();
          await handleSubmit(inputValue);
        }}
      >
        <PasswordInput
          type="text"
          placeholder="🕵️ Search your entries"
          onChange={(event) => {
            event.preventDefault();
            setInputValue(event.target.value);
          }}
        />
        <button onClick={async () => {}}>Click me</button>
      </PasswordSearchForm>
      <button
        onClick={async () => {
          setSearchEntries(await getAllPwdsExpress());
        }}
      >
        Show all
      </button>
      <div className="output">
        {searchEntries &&
          searchEntries.map((pwd) => {
            return (
              <li key={pwd._id}>
                <h5>{pwd.title}</h5>
                <h6>{pwd.pwd}</h6>
              </li>
            );
          })}
      </div>
    </div>
  );
}

export default App;

async function getAllPwdsExpress() {
  const request = await fetch("/api/passwords/");
  const data = await request.json();
  return data;
}
async function getSpecificEntryExpress(input) {
  const request = await fetch(`/api/passwords/${input}`);
  const data = await request.json();
  return [data];
}
