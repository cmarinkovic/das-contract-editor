import SavedToast from "./SavedToast";
import { prettyDOM, render } from "@testing-library/react";

describe("<SavedToast/>", () => {
  let component;

  beforeEach(() => {
    component = render(<SavedToast />);
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
    component.getByText("");
  });
});
