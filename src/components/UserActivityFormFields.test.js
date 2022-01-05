import UserActivityFormFields from "./UserActivityFormFields";
import { prettyDOM, render } from "@testing-library/react";

describe("<UserActivityFormFields/>", () => {
  let component;

  beforeEach(() => {
    component = render(<UserActivityFormFields />);
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
    component.getByText("");
  });
});
