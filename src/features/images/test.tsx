import { screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Images from "./index";
import React from "react";
import { imagesActions, imagesReducer } from "./slice";
import {
  mockStoreCreator,
  renderWithProviders,
  rootInitialState,
} from "utils/test-helpers";
import api from "api";
import { fetchImagesByCategory } from "./slice";

jest.mock("api");
const mockedAxios = api as jest.Mocked<typeof api>;

describe("<Images />", () => {
  beforeAll(() => jest.useFakeTimers());

  test("shows empty list as initial value", () => {
    renderWithProviders(<Images />);
    expect(screen.getByTestId("images-container").children.length).toBe(0);
  });

  test("shows loading message", () => {
    const mockStore = mockStoreCreator({
      ...rootInitialState,
      images: { ...rootInitialState.images, loading: true },
    });
    renderWithProviders(<Images />, mockStore);
    expect(screen.getByText(/Loading/i)).toBeVisible();
  });

  test("shows error message", () => {
    const errorMessage = "An error occured";
    const mockStore = mockStoreCreator({
      ...rootInitialState,
      images: { ...rootInitialState.images, error: errorMessage },
    });
    renderWithProviders(<Images />, mockStore);
    expect(screen.getByText(errorMessage)).toBeVisible();
  });

  test("dispatch mounting actions", async () => {
    mockedAxios.get.mockResolvedValue({ status: 200, data: [] });

    const mockStore = mockStoreCreator(rootInitialState);
    renderWithProviders(<Images />, mockStore);
    expect(mockStore.getActions()).toMatchObject([
      { type: imagesActions.clear.type },
      { type: fetchImagesByCategory.pending.type },
    ]);
    mockStore.clearActions();
    await waitFor(() => null, { timeout: 500 });
    expect(mockStore.getActions()).toMatchObject([
      { type: fetchImagesByCategory.fulfilled.type, payload: [] },
    ]);
    mockStore.clearActions();
  });

  test("load more success", async () => {
    mockedAxios.get.mockResolvedValue({ status: 200, data: [] });
    const mockStore = mockStoreCreator(rootInitialState);
    renderWithProviders(<Images />, mockStore);
    await waitFor(() => null, { timeout: 500 });
    mockStore.clearActions();
    fireEvent.click(screen.getByRole("button", { name: /Load More/i }));
    await waitFor(() => null, { timeout: 500 });
    expect(mockStore.getActions()).toMatchObject([
      { type: fetchImagesByCategory.pending.type },
      { type: fetchImagesByCategory.fulfilled.type, payload: [] },
    ]);
  });

  test("load more error", async () => {
    mockedAxios.get.mockRejectedValue({ status: 500, data: null });
    const mockStore = mockStoreCreator(rootInitialState);
    renderWithProviders(<Images />, mockStore);

    await waitFor(() => null, { timeout: 500 });
    mockStore.clearActions();
    fireEvent.click(screen.getByRole("button", { name: /Load More/i }));
    await waitFor(() => null, { timeout: 500 });
    console.log(mockStore.getActions());
    expect(mockStore.getActions()).toMatchObject([
      { type: fetchImagesByCategory.pending.type },
      {
        type: fetchImagesByCategory.rejected.type,
        error: { message: "Something went wrong." },
      },
    ]);
  });
});

describe("ImagesSlice", () => {
  test("sets loading on fetch start", () => {
    expect(
      imagesReducer(
        { ...rootInitialState.images, loading: false },
        fetchImagesByCategory.pending
      )
    ).toEqual({ ...rootInitialState.images, loading: true });
  });

  test("sets value and stop loading on fetch success", () => {
    expect(
      imagesReducer(
        { ...rootInitialState.images, loading: true },
        { type: fetchImagesByCategory.fulfilled.type, payload: [] }
      )
    ).toEqual({ ...rootInitialState.images, loading: false, value: [] });
  });

  test("sets error and stop loading on fetch error", () => {
    expect(
      imagesReducer(
        { ...rootInitialState.images, loading: true },
        { type: fetchImagesByCategory.rejected, error: "Some error message." }
      )
    ).toEqual({
      ...rootInitialState.images,
      loading: false,
      error: "Some error message.",
    });
  });
});
