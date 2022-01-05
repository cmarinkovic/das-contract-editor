import ProcessEditor from "./ProcessEditor";
import { prettyDOM, render } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../redux/store";

describe("<ProcessEditor/>", () => {
  let component;

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <ProcessEditor />
      </Provider>
    );
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
  });
});
