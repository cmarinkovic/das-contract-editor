import NavItems from "./NavItems";
import { prettyDOM, render } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../redux/store";

describe("<NavItems/>", () => {
  let component;

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <NavItems />
      </Provider>
    );
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
    component.getByText("Home");
  });
});