import { screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Sidebar from "./index";
import React from "react";
import { categoriesReducer } from "./slice";
import {
  mockStoreCreator,
  renderWithProviders,
  rootInitialState,
} from "utils/test-helpers";
import api from "api";
import { fetchCategories } from "./slice";

jest.mock("api");
const mockedAxios = api as jest.Mocked<typeof api>;

describe("<Sidebar />", () => {
  beforeAll(() => jest.useFakeTimers());

  test("shows empty list as initial value", () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByTestId("categories-list").children.length).toBe(0);
  });

  test("shows loading message", () => {
    const mockStore = mockStoreCreator({
      ...rootInitialState,
      categories: { ...rootInitialState.categories, loading: true },
    });
    renderWithProviders(<Sidebar />, mockStore);
    expect(screen.getByText(/Loading/i)).toBeVisible();
  });

  test("shows error message", () => {
    const errorMessage = "An error occured";
    const mockStore = mockStoreCreator({
      ...rootInitialState,
      categories: { ...rootInitialState.categories, error: errorMessage },
    });
    renderWithProviders(<Sidebar />, mockStore);
    expect(screen.getByText(errorMessage)).toBeVisible();
  });

  test("dispatch mounting actions", async () => {
    mockedAxios.get.mockResolvedValue({ status: 200, data: [] });
    const mockStore = mockStoreCreator(rootInitialState);
    renderWithProviders(<Sidebar />, mockStore);
    expect(mockStore.getActions()).toMatchObject([
      { type: fetchCategories.pending.type },
    ]);
    mockStore.clearActions();
    await waitFor(() => null, { timeout: 500 });
    expect(mockStore.getActions()).toMatchObject([
      { type: fetchCategories.fulfilled.type, payload: [] },
    ]);
    mockStore.clearActions();
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
        { type: fetchCategories.fulfilled.type, payload: [] }
      )
    ).toEqual({ ...rootInitialState.categories, loading: false, value: [] });
  });

  test("sets error and stop loading on fetch error", () => {
    expect(
      categoriesReducer(
        { ...rootInitialState.categories, loading: true },
        { type: fetchCategories.rejected, error: "Some error message." }
      )
    ).toEqual({
      ...rootInitialState.categories,
      loading: false,
      error: "Some error message.",
    });
  });
});
