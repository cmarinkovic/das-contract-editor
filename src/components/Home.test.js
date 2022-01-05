import Home from "./Home";
import { prettyDOM, render } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../redux/store";

describe("<Home/>", () => {
  let component;

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
  });
});
