import { screen, fireEvent, waitFor } from "@testing-library/react";
import Images from "./index";
import React from "react";
import { imagesReducer } from "./slice";
import { renderWithRedux, rootInitialState } from "utils/test-helpers";
import axios from "axios";
import { fetchImagesByCategory } from "./slice";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("<Images />", () => {
  test("shows zero as initial value", () => {
    renderWithRedux(<Images />);
    expect(screen.getByText("0")).toBeVisible();
  });

  test("shows loading message", () => {
    renderWithRedux(<Images />, {
      ...rootInitialState,
      images: { ...rootInitialState.images, loading: true },
    });
    expect(screen.getByText(/Loading/i)).toBeVisible();
  });

  test("shows error message", () => {
    const errorMessage = "An error occured";
    renderWithRedux(<Images />, {
      ...rootInitialState,
      images: { ...rootInitialState.images, error: errorMessage },
    });
    expect(screen.getByText(errorMessage)).toBeVisible();
  });

  test("load more success", async () => {
    const name = "cra-template-typekit";
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: { name } });
    jest.useFakeTimers();

    const { mockStore } = renderWithRedux(<Images />);

    fireEvent.click(screen.getByRole("button", { name: /slow fetch/i }));

    jest.runAllTimers();
    // Normally we would wait for an element to show up
    // https://github.com/testing-library/react-testing-library#complex-example
    await waitFor(() => null, { timeout: 500 });

    expect(mockStore.getActions()[0].type).toEqual(
      fetchImagesByCategory.pending.type
    );
    expect(mockStore.getActions()[1].type).toEqual(
      fetchImagesByCategory.fulfilled.type
    );
    expect(mockStore.getActions()[1].payload).toEqual(name.length);
  });

  test("load more error", async () => {
    mockedAxios.get.mockResolvedValueOnce({ status: 500 });
    jest.useFakeTimers();

    const { mockStore } = renderWithRedux(<Images />);

    fireEvent.click(screen.getByRole("button", { name: /slow fetch/i }));

    jest.runAllTimers();
    // Normally we would wait for an element to show up
    // https://github.com/testing-library/react-testing-library#complex-example
    await waitFor(() => null, { timeout: 500 });

    expect(mockStore.getActions()[0].type).toEqual(
      fetchImagesByCategory.pending.type
    );
    expect(mockStore.getActions()[1].type).toEqual(
      fetchImagesByCategory.rejected.type
    );
    expect(mockStore.getActions()[1].payload).toEqual("Something went wrong.");
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
        { type: fetchImagesByCategory.fulfilled.type, payload: 100 }
      )
    ).toEqual({ ...rootInitialState.images, loading: false, value: 100 });
  });

  test("sets error and stop loading on fetch error", () => {
    expect(
      imagesReducer(
        { ...rootInitialState.images, loading: true },
        { type: fetchImagesByCategory.rejected, payload: "Some error message." }
      )
    ).toEqual({
      ...rootInitialState.images,
      loading: false,
      error: "Some error message.",
    });
  });
});
