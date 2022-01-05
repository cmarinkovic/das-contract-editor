import DataModelFormFields from "./DataModelFormFields";
import { prettyDOM, render } from "@testing-library/react";

describe("<DataModelFormFields/>", () => {
  let component;

  beforeEach(() => {
    const process = {
      attributes: {
        id: "Foo",
      },
    };
    const updateProcesMock = jest.fn();

    component = render(
      <DataModelFormFields process={process} updateProcess={updateProcesMock} />
    );
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
  });
});
