import React, { Suspense, lazy } from "react";
import { css } from "@emotion/css";
import Sidebar from "./features/sidebar";
import { Switch } from "react-router";
import { Redirect, Route } from "react-router-dom";
import Loading from "./components/loading";
import { mediaQuery } from "./utils/css-commons";

const Images = lazy(() => import("features/images"));

const App = () => {
  return (
    <div
      className={css`
        display: flex;
        height: calc(100vh - 2rem);
        ${mediaQuery.sm} {
          flex-direction: column;
        }
      `}
    >
      <Sidebar />
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/:categoryId" exact component={Images} />
          <Redirect from="/" exact to="/1" />
        </Switch>
      </Suspense>
    </div>
  );
};

export default App;
