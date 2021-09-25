import React from "react";
import { screen } from "@testing-library/react";
import App from "./App";
import { renderWithProviders } from "./utils/test-helpers";

test("renders initial count", () => {
  renderWithProviders(<App />);
  const zero = screen.getByText("0");
  expect(zero).toBeInTheDocument();
});
