import { useEffect, useState } from "react";
import "./App.css";

async function getPasswordsExpress() {
  const request = await fetch("http://localhost:3001/api/passwords/");
  const data = await request.json();
  return data;
}

function App() {
  const [passwords, setPasswords] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setPasswords(await getPasswordsExpress());
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      <button
        onClick={(event) => {
          event.preventDefault();
          getPasswordsExpress();
        }}
      >
        Click me
      </button>
      <div className="output">
        {passwords &&
          passwords.map((pwd, index) => {
            return <li key={index}>{pwd.title}</li>;
          })}
      </div>
    </div>
  );
}

export default App;
