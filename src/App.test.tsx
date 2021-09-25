import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import App from "./App";
import { renderWithProviders, sleep } from "./utils/test-helpers";
import { rootReducer } from "./store";
import { configureStore } from "@reduxjs/toolkit";

describe("App integrated tests", () => {
  beforeEach((cb) => {
    renderWithProviders(<App />, configureStore({ reducer: rootReducer }));
    sleep(2000).then(cb);
  });

  test("shows categories in sidebar", async () => {
    expect(
      screen.getByTestId("categories-list").children.length
    ).toBeGreaterThan(0);
  });

  test("shows 10 images for selected category on initial", async () => {
    expect(screen.getByTestId("images-container").children.length).toEqual(10);
  });

  test("add 10 more images after clicking load more", async () => {
    const imagesCount = screen.getByTestId("images-container").children.length;
    fireEvent.click(screen.getByTestId("load-more"));
    await sleep(2000);
    expect(screen.getByTestId("images-container").children.length).toEqual(
      imagesCount + 10
    );
  });
});
