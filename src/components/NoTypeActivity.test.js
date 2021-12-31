import NoTypeActivity from "./NoTypeActivity";
import {prettyDOM, render} from "@testing-library/react";

describe("<NoTypeActivity/>", () => {
    let component;

    beforeEach(() => {
        const task = {
            attributes: {
                id: "Foo",
                name: "Bar"
            }
        };

        component = render(
            <NoTypeActivity task={task}/>
        );
    });

    test("Renders content", () => {
        console.log(prettyDOM(component.container));

        expect(component.container).toHaveTextContent("Foo");
        expect(component.container).toHaveTextContent("Bar");
        expect(component.container).toHaveTextContent("Please assign a task type.");
    })
})
