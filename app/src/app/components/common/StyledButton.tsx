import React from "react";
import styled from "styled-components/native";

interface ButtonInterface {
  disabled: boolean;
  color: "primary" | "warn" | "success" | "cancel";
}

export const StyledButton = styled.TouchableOpacity<ButtonInterface>`
  background-color: ${props => props.disabled ? "#CCCCCC" : backgroundColors.get(props.color)};
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
`;

const backgroundColors = new Map([
  ["primary", "#000"],
  ["warn", "#BC1C61"],
  ["success", "#38D99C"],
  ["cancel", "#666"]
]);
