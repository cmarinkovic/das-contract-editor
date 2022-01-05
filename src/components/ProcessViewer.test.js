import ProcessViewer from "./ProcessViewer";
import { prettyDOM, render } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../redux/store";

describe("<ProcessViewer/>", () => {
  let component;

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <ProcessViewer />
      </Provider>
    );
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
  });
});
