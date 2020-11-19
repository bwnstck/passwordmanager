import styled from "styled-components";
import Safe from "./assets/safe.svg";

export const Wrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  background-color: grey;
  background-image: url(${Safe});
  background-repeat: no-repeat;
  background-size: 30%;
  background-position-y: bottom;
  background-position-x: center;

  color: white;
`;
