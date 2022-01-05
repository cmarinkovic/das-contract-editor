import ProcessEditor from "./ProcessEditor";
import { prettyDOM, render } from "@testing-library/react";

describe("<ProcessEditor/>", () => {
  let component;

  beforeEach(() => {
    component = render(<ProcessEditor />);
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
    component.getByText("");
  });
});
