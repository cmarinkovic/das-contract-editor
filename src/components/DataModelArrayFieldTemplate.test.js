import DataModelArrayFieldTemplate from "./DataModelArrayFieldTemplate";
import { prettyDOM, render } from "@testing-library/react";
import FormDataStateContext from "./FormDataStateContext";

describe("<DataModelArrayFieldTemplate/>", () => {
  let component;

  beforeEach(() => {
    const setFormDataMock = jest.fn();

    component = render(
      <FormDataStateContext.Provider value={["", setFormDataMock]}>
        <DataModelArrayFieldTemplate />
      </FormDataStateContext.Provider>
    );
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
  });
});
