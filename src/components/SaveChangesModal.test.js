import SaveChangesModal from "./SaveChangesModal";
import { prettyDOM, render } from "@testing-library/react";

describe("<SaveChangesModal/>", () => {
  let component;

  beforeEach(() => {
    const toggleModalButtonRefMock = {
      current: () => {},
    };

    component = render(
      <SaveChangesModal
        context="navLink"
        url="/"
        toggleModalButtonRef={toggleModalButtonRefMock}
      />
    );
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
  });
});
