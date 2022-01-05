import UserActivityArrayFieldTemplate from "./UserActivityArrayFieldTemplate";
import { prettyDOM, render } from "@testing-library/react";

describe("<UserActivityArrayFieldTemplate/>", () => {
  let component;

  beforeEach(() => {
    component = render(<UserActivityArrayFieldTemplate />);
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
    component.getByText("");
  });
});
