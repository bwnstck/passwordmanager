import { useState } from "react";
import styled from "styled-components/macro";
import "./App.css";

const PasswordSearchForm = styled.form`
  width: 80%;
`;

async function getPasswordsExpress() {
  const request = await fetch("http://localhost:3001/api/passwords/");
  const data = await request.json();
  return data;
}

function App() {
  const [passwords, setPasswords] = useState([]);

  return (
    <div className="App">
      <PasswordSearchForm />
      <button
        onClick={async () => {
          setPasswords(await getPasswordsExpress());
        }}
      >
        Click me
      </button>
      <div className="output">
        {passwords &&
          passwords.map((pwd) => {
            return <li key={pwd._id}>{pwd.title}</li>;
          })}
      </div>
    </div>
  );
}

export default App;
