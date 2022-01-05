import ProcessViewer from "./ProcessViewer";
import { prettyDOM, render } from "@testing-library/react";

describe("<ProcessViewer/>", () => {
  let component;

  beforeEach(() => {
    component = render(<ProcessViewer />);
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
    component.getByText("");
  });
});
