import React from "react";
import { screen } from "@testing-library/react";
import App from "./App";
import { renderWithProviders, sleep } from "./utils/test-helpers";
import Images from "./features/images";

test("renders initial count", () => {
  renderWithProviders(<App />);
  const zero = screen.getByText("0");
  expect(zero).toBeInTheDocument();
});
test("shows loading on initial", async () => {
  renderWithProviders(<Images />, undefined, "/1");
  await sleep(500);
  expect(screen.getByText(/Loading/i)).toBeVisible();
});
