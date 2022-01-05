import PreventUnload from "./PreventUnload";
import { prettyDOM, render } from "@testing-library/react";

describe("<PreventUnload/>", () => {
  let component;

  beforeEach(() => {
    component = render(<PreventUnload />);
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
    //expect(window.beforeunload).toHaveBeenCalled();
  });
});
