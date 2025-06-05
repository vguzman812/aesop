import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import PersonList from "./PersonList"

test("renders content", () => {
    const note = {
        content: "Component testing is done with react-testing-library",
        important: true,
    };

    render(
        <PersonList
            persons={personsToShow}
            handleOnClick={(id) => {
                void handleDeletePerson(id);
            }}
        />
    );

    const element = screen.getByText(
        "Component testing is done with react-testing-library"
    );
    expect(element).toBeDefined();
});
