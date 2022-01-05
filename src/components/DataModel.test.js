import DataModel from "./DataModel";
import { prettyDOM, render } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../redux/store";

describe("<DataModel/>", () => {
  let component;

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <DataModel />
      </Provider>
    );
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
  });
});
