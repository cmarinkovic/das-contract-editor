import BusinessRuleActivity from "./BusinessRuleActivity";
import { prettyDOM, render } from "@testing-library/react";

describe("<BusinessRuleActivity/>", () => {
  let component;

  beforeEach(() => {
    const task = {
      attributes: {
        id: "Foo",
        name: "Bar",
      },
    };
    const updateTaskMock = jest.fn();

    component = render(
      <BusinessRuleActivity task={task} updateTask={updateTaskMock} />
    );
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));

    expect(component.container).toHaveTextContent("Foo");
    expect(component.container).toHaveTextContent("Bar");
  });
});
