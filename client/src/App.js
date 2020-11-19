import { useState } from "react";
import styled from "styled-components/macro";
import "./App.css";

import useAsync from "./hooks/useAsync";
import { Button } from "./stories/Button";
import Form from "./stories/Form";
import { Wrapper } from "./stories/Wrapper";

const DimmedBG = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 3px;
`;

const Title = styled.h1``;

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
        <Form
          onChangeInput={(event) => {
            event.preventDefault();
            setInputValue(event.target.value);
          }}
          onSubmitForm={async (event) => {
            event.preventDefault();
            await setSpecificEntry(inputValue);
            setDataContainer(specificQuery);
          }}
          inputPlaceholder="🕵️ Search your entries"
        >
          <Button onClick={async () => {}}>Click me</Button>
        </Form>
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
