import styled from "styled-components";

import React from "react";

const PasswordSearchForm = styled.form`
  width: 80%;
`;
export const PasswordInput = styled.input`
  margin: 1rem auto;
  padding: 1rem 0;
  border-radius: 3px;
`;

export default function Form() {
  return (
    <PasswordSearchForm>
      <PasswordInput />
    </PasswordSearchForm>
  );
}
