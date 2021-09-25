import { render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { initialState as imagesInitialState } from "features/images/slice";
import { initialState as categoriesInitialState } from "features/sidebar/slice";
import { RootState } from "store";

const mockStore = configureStore([thunk]);

export const rootInitialState = {
  images: imagesInitialState,
  categories: categoriesInitialState,
};

export const renderWithProviders = (
  ui: JSX.Element,
  initialState: RootState = rootInitialState
) => {
  const history = createMemoryHistory();
  const store = mockStore(initialState);
  return {
    ...render(
      <Router history={history}>
        <Provider store={store}>{ui}</Provider>
      </Router>
    ),
    mockStore: store,
  };
};
