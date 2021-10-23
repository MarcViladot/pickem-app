import React from "react";
import styled from "styled-components/native";

interface TextInputInterface {

}

export const StyledTextField = styled.TextInput<TextInputInterface>`
  background-color: #F0F1F7;
  text-align: center;
  color: black;
  font-size: 14px;
  border-radius: 50px;
  min-width: 100%;
  max-width: 100%;
  border: 0;
  height: 40px;
  margin-bottom: 20px;
`;
