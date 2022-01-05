import SavedToast from "./SavedToast";
import { prettyDOM, render } from "@testing-library/react";

describe("<SavedToast/>", () => {
  let component;

  beforeEach(() => {
    const toggleMock = jest.fn();

    component = render(<SavedToast toggle={toggleMock} ms={500} />);
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
  });
});
