import { type Person } from "../Types/types";
const PersonList = ({
    persons,
    handleOnClick,
}: {
    persons: Person[];
    handleOnClick: (id: string) => void;
}) => {
    return (
        <>
            <ul></ul>
            {persons.map((person) => {
                return (
                    <li key={person.id}>
                        {person.name}: {person.number}{" "}
                        <button
                            type="button"
                            onClick={() => {
                                if (person.id) {
                                    handleOnClick(person.id);
                                }
                            }}
                        >
                            delete
                        </button>
                    </li>
                );
            })}
        </>
    );
};

export default PersonList;
