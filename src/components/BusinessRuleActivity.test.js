import BusinessRuleActivityTest from "./BusinessRuleActivityTest";
import { prettyDOM, render } from "@testing-library/react";

describe("<BusinessRuleActivityTest/>", () => {
  let component;

  beforeEach(() => {
    component = render(<BusinessRuleActivityTest />);
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
    component.getByText("");
  });
});
