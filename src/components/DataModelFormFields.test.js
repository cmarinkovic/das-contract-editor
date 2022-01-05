import DataModelFormFields from "./DataModelFormFields";
import { prettyDOM, render } from "@testing-library/react";

describe("<DataModelFormFields/>", () => {
  let component;

  beforeEach(() => {
    component = render(<DataModelFormFields />);
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
    component.getByText("");
  });
});
