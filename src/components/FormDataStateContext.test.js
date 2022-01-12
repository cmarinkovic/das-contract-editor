import FormDataStateContext from "./FormDataStateContext";
import { prettyDOM, render } from "@testing-library/react";

describe("<FormDataStateContext/>", () => {
  let component;

  beforeEach(() => {
    component = render(<FormDataStateContext />);
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
  });
});
