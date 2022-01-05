import ActivityDasContractProperties from "./ActivityDasContractProperties";
import { prettyDOM, render } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../redux/store";

describe("<ActivityDasContractProperties/>", () => {
  let component;

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <ActivityDasContractProperties />
      </Provider>
    );
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
    component.getByText("asdf");
  });
});
