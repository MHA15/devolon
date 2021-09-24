import { screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { categoriesReducer, fetchCategories } from "./slice";
import { renderWithRedux, rootInitialState } from "utils/test-helpers";
import axios from "axios";
import Sidebar from "./index";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("<Sidebar />", () => {
  test("shows zero as initial value", () => {
    renderWithRedux(<Sidebar />);
    expect(screen.getByText("0")).toBeVisible();
  });

  test("shows loading message", () => {
    renderWithRedux(<Sidebar />, {
      ...rootInitialState,
      categories: { ...rootInitialState.categories, loading: true },
    });
    expect(screen.getByText(/Loading/i)).toBeVisible();
  });

  test("shows error message", () => {
    const errorMessage = "An error occured";
    renderWithRedux(<Sidebar />, {
      ...rootInitialState,
      categories: { ...rootInitialState.categories, error: errorMessage },
    });
    expect(screen.getByText(errorMessage)).toBeVisible();
  });

  test("load more success", async () => {
    const name = "cra-template-typekit";
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: { name } });
    jest.useFakeTimers();

    const { mockStore } = renderWithRedux(<Sidebar />);

    fireEvent.click(screen.getByRole("button", { name: /slow fetch/i }));

    jest.runAllTimers();
    // Normally we would wait for an element to show up
    // https://github.com/testing-library/react-testing-library#complex-example
    await waitFor(() => null, { timeout: 500 });

    expect(mockStore.getActions()[0].type).toEqual(
      fetchCategories.pending.type
    );
    expect(mockStore.getActions()[1].type).toEqual(
      fetchCategories.fulfilled.type
    );
    expect(mockStore.getActions()[1].payload).toEqual(name.length);
  });

  test("load more error", async () => {
    mockedAxios.get.mockResolvedValueOnce({ status: 500 });
    jest.useFakeTimers();

    const { mockStore } = renderWithRedux(<Sidebar />);

    fireEvent.click(screen.getByRole("button", { name: /slow fetch/i }));

    jest.runAllTimers();
    // Normally we would wait for an element to show up
    // https://github.com/testing-library/react-testing-library#complex-example
    await waitFor(() => null, { timeout: 500 });

    expect(mockStore.getActions()[0].type).toEqual(
      fetchCategories.pending.type
    );
    expect(mockStore.getActions()[1].type).toEqual(
      fetchCategories.rejected.type
    );
    expect(mockStore.getActions()[1].payload).toEqual("Something went wrong.");
  });
});

describe("CategoriesSlice", () => {
  test("sets loading on fetch start", () => {
    expect(
      categoriesReducer(
        { ...rootInitialState.categories, loading: false },
        fetchCategories.pending
      )
    ).toEqual({ ...rootInitialState.categories, loading: true });
  });

  test("sets value and stop loading on fetch success", () => {
    expect(
      categoriesReducer(
        { ...rootInitialState.categories, loading: true },
        { type: fetchCategories.fulfilled.type, payload: 100 }
      )
    ).toEqual({ ...rootInitialState.categories, loading: false, value: 100 });
  });

  test("sets error and stop loading on fetch error", () => {
    expect(
      categoriesReducer(
        { ...rootInitialState.categories, loading: true },
        { type: fetchCategories.rejected, payload: "Some error message." }
      )
    ).toEqual({
      ...rootInitialState.categories,
      loading: false,
      error: "Some error message.",
    });
  });
});
