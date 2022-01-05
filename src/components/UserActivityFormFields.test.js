import UserActivityFormFields from "./UserActivityFormFields";
import { prettyDOM, render } from "@testing-library/react";

describe("<UserActivityFormFields/>", () => {
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
      <UserActivityFormFields task={task} updateTask={updateTaskMock} />
    );
  });

  test("Renders content", () => {
    console.log(prettyDOM(component.container));

    expect(component.container).toHaveTextContent("Foo");
    expect(component.container).toHaveTextContent("Bar");
  });
});
