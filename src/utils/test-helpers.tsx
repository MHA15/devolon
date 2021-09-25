import { render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { initialState as imagesInitialState } from "features/images/slice";
import { initialState as categoriesInitialState } from "features/sidebar/slice";
import { MemoryRouter } from "react-router-dom";
import appStore, { RootState } from "store";

export const mockStoreCreator = configureStore<RootState>([thunk]);

export const rootInitialState = {
  images: imagesInitialState,
  categories: categoriesInitialState,
};

export const renderWithProviders = (
  ui: JSX.Element,
  store: typeof appStore = mockStoreCreator(rootInitialState)
) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>{ui}</Provider>
    </MemoryRouter>
  );
};

export function sleep(millisecond: number) {
  return new Promise((r) => setTimeout(r, millisecond));
}
