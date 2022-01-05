import UserActivityArrayFieldTemplate from "./UserActivityArrayFieldTemplate";
import { prettyDOM, render } from "@testing-library/react";
import FormDataStateContext from "./FormDataStateContext";

describe("<UserActivityArrayFieldTemplate/>", () => {
  let component;

  beforeEach(() => {
    const setFormDataMock = jest.fn();

    component = render(
      <FormDataStateContext.Provider value={["", setFormDataMock]}>
        <UserActivityArrayFieldTemplate />
      </FormDataStateContext.Provider>
    );
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));
  });
});
