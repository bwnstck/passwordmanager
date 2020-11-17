import { useEffect, useState } from "react";
import "./App.css";

async function getPasswordsExpress() {
  const request = await fetch("http://localhost:3001/api/passwords/");
  const data = await request.json();
  return data;
}

function App() {
  const [passwords, setPasswords] = useState([]);

  return (
    <div className="App">
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
