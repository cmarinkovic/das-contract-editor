import NavbarImpl from "./NavbarImpl";
import { prettyDOM, render } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../redux/store";

describe("<NavbarImpl/>", () => {
  let component;

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <NavbarImpl />
      </Provider>
    );
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
    component.getByText("DasContract Editor");
  });
});
