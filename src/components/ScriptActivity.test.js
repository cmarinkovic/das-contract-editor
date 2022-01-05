import ScriptActivity from "./ScriptActivity";
import { prettyDOM, render } from "@testing-library/react";

describe("<ScriptActivity/>", () => {
  let component;

  beforeEach(() => {
    component = render(<ScriptActivity task="" updateTask="" />);
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
    component.getByText("");
  });
});
