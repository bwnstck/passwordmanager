import { useState } from "react";
import styled from "styled-components/macro";
import "./App.css";

import Safe from "./assets/safe.svg";
import useAsync from "./hooks/useAsync";

const PasswordSearchForm = styled.form`
  width: 80%;
`;
const PasswordInput = styled.input`
  margin: 1rem auto;
  padding: 1rem 0;
  border-radius: 3px;
`;
const Title = styled.h1``;

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  background-color: grey;
  background-image: url(${Safe});
  background-repeat: no-repeat;
  background-size: contain;
  background-position-y: bottom;
  background-position-x: center;

  color: white;
`;
const DimmedBG = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 3px;
`;

const Button = styled.button`
  padding: 1rem;
  background-color: palegoldenrod;
  border-radius: 5px;
`;

function App() {
  const [dataContainer, setDataContainer] = useState([]);

  const [inputValue, setInputValue] = useState("");

  const {
    data: specificQuery,
    loading,
    error,
    doFetch: setSpecificEntry,
  } = useAsync(getSpecificEntryExpress);

  const {
    data: allQuery,
    // loading: loadingAll,
    // error: errorAll,
    doFetch: setAllQuery,
  } = useAsync(async () => getAllPwdsExpress());

  return (
    <Wrapper className="App">
      <DimmedBG>
        <Title>--== PasswordManager 2000 ==--</Title>
        <PasswordSearchForm
          onSubmit={async (event) => {
            event.preventDefault();
            await setSpecificEntry(inputValue);
            setDataContainer(specificQuery);
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
          <Button onClick={async () => {}}>Click me</Button>
        </PasswordSearchForm>
        <Button
          onClick={async () => {
            setAllQuery();
            setDataContainer(allQuery);
            console.log("search all");
          }}
        >
          Show all
        </Button>

        <div className="output">
          {loading && <h3>Loading...</h3>}
          {error && <h3>{error.message}</h3>}
          {dataContainer &&
            dataContainer.map((pwd) => {
              return (
                <li key={pwd._id}>
                  <h5>{pwd.title}</h5>
                  <h6>{pwd.pwd}</h6>
                </li>
              );
            })}
        </div>
      </DimmedBG>
    </Wrapper>
  );
}

export default App;

async function getAllPwdsExpress() {
  const request = await fetch("/api/passwords/");
  const data = await request.json();
  return data;
}
async function getSpecificEntryExpress(input) {
  const response = await fetch(`/api/passwords/${input}`);
  if (!response.ok) {
    const errorMessage = "Kein Eintrag gefudnen";
    throw new Error(errorMessage);
  }
  const data = await response.json();
  console.log(data);
  return [data];
}
