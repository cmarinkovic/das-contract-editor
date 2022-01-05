import SaveChangesModal from "./SaveChangesModal";
import { prettyDOM, render } from "@testing-library/react";

describe("<SaveChangesModal/>", () => {
  let component;

  beforeEach(() => {
    component = render(<SaveChangesModal />);
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
    component.getByText("");
  });
});
