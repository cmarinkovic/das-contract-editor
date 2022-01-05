import DataModelArrayFieldTemplate from "./DataModelArrayFieldTemplate";
import { prettyDOM, render } from "@testing-library/react";

describe("<DataModelArrayFieldTemplate/>", () => {
  let component;

  beforeEach(() => {
    component = render(<DataModelArrayFieldTemplate />);
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
    component.getByText("");
  });
});
