import NotFound from "./NotFound";
import {prettyDOM, render} from "@testing-library/react";
import {screen} from '@testing-library/dom';
import {Router} from "@reach/router";

describe("<NotFound/>", () => {
    let component;

    beforeEach(() => {
        component = render(
            <Router>
                <NotFound default/>
            </Router>
        );
    });

    test("Renders content", () => {
        console.log(prettyDOM(component.container));

        component.getByText("Sorry, nothing here...");
    })
})
