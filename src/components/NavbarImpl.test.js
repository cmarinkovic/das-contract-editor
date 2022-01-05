import NavbarImpl from "./NavbarImpl";
import { prettyDOM, render } from "@testing-library/react";

describe("<NavbarImpl/>", () => {
  let component;

  beforeEach(() => {
    component = render(<NavbarImpl />);
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
    component.getByText("");
  });
});
