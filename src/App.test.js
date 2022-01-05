import App from "./App";
import { prettyDOM, render } from "@testing-library/react";

describe("<App/>", () => {
  let component;

  beforeEach(() => {
    component = render(<App />);
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
    component.getByText("DasContract"); //Sub-components rendered.
  });
});
