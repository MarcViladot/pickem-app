import React from "react";
import styled from "styled-components/native";

interface ButtonInterface {
  disabled: boolean;
  color: "primary" | "warn" | "success" | "cancel" | "accent" | "gray";
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
  ["warn", "#FF1E44"],
  ["success", "#38D99C"],
  ["cancel", "#666"],
  ["accent", "#ff7e23"],
  ["gray", "#f8f8f8"]
]);
