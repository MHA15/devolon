import React from "react";
import styled from "@emotion/styled";

const Button = styled.button<Props>`
  margin: 0.5rem 0.75rem;
  font-size: 1.25rem;
  border-color: #5fd0ae;
  border-radius: 0.25rem;
  padding: 0.5rem 0.75rem;

  &:focus {
    outline: none;
  }
  &:active {
    border-style: solid;
  }
  &:hover {
    cursor: pointer;
  }
`;

interface Props {}

export default Button;
