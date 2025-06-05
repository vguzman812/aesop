import {
    type FormEvent,
    type ChangeEvent,
    useState,
    type ChangeEventHandler,
    useCallback,
    useMemo,
    useEffect,
} from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";
import Notification from "./components/Notification";
import { type Person } from "./Types/types";
import personService from "./services/persons.ts";

const App = () => {
    const [persons, setPersons] = useState<Person[]>([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [notificationMessage, setNotificationMessage] = useState<
        null | string
    >(null);
    const [notificationType, setNotificationType] = useState<
        "error" | "success" | "info"
    >("info");
    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const existingPerson = persons.find((p) => p.name === newName);

        if (existingPerson) {
            try {
                const updatedPerson = await personService.updateOne(
                    existingPerson.id,
                    {
                        name: existingPerson.name,
                        number: newNumber,
                    }
                );
                setPersons(
                    persons.map((person) =>
                        person.id === existingPerson.id ? updatedPerson : person
                    )
                );
                setNotificationType("success");
                setNotificationMessage("person updated");
                setNewName("");
                setNewNumber("");
            } catch (error) {
                console.error(error);
                setNotificationType("error");
                setNotificationMessage("failed to update person");
            } finally {
                setTimeout(() => {
                    setNotificationMessage(null);
                }, 3000);
            }
        } else {
            try {
                const newPerson = await personService.createOne({
                    name: newName,
                    number: newNumber,
                });
                setPersons([...persons, newPerson]);
                setNotificationType("success");
                setNotificationMessage("person created");
                setNewName("");
                setNewNumber("");
            } catch (error) {
                console.error(error);
                setNotificationType("error");
                setNotificationMessage("failed to create new person");
            } finally {
                setTimeout(() => {
                    setNotificationMessage(null);
                }, 3000);
            }
        }
    };

    const handleDeletePerson = async (id: string) => {
        const person = persons.find((person) => person.id === id)?.name;
        if (person && window.confirm(`Delete ${person}?`)) {
            try {
                await personService.deleteOne(id);
                setPersons(persons.filter((person) => person.id !== id));
                setNotificationType("info");
                setNotificationMessage(
                    `person with ID: ${id} deleted successfully`
                );
            } catch (error) {
                console.error(error);
                setNotificationType("error");
                setNotificationMessage(
                    `failed to delete person with ID: ${id}`
                );
            } finally {
                setTimeout(() => {
                    setNotificationMessage(null);
                }, 3000);
            }
        }
    };

    const handleNameChange: ChangeEventHandler<HTMLInputElement> = (
        e: ChangeEvent<HTMLInputElement>
    ): void => {
        setNewName(e.currentTarget.value);
    };

    const handleNumberChange: ChangeEventHandler<HTMLInputElement> = (
        e: ChangeEvent<HTMLInputElement>
    ): void => {
        setNewNumber(e.currentTarget.value);
    };

    const handleSearchInputChange: ChangeEventHandler<HTMLInputElement> = (
        e: ChangeEvent<HTMLInputElement>
    ): void => {
        const currentFilter = e.currentTarget.value;
        setSearchInput(currentFilter);
    };

    const getFilteredPersons = useCallback((): Person[] => {
        const searchTerm = searchInput.trim().toLowerCase();
        if (searchTerm === "") {
            return persons;
        }
        return persons.filter((person) =>
            person.name.toLowerCase().includes(searchTerm)
        );
    }, [searchInput, persons]);

    const personsToShow = useMemo(getFilteredPersons, [getFilteredPersons]);

    useEffect(() => {
        let isMounted = true;

        const fetchPersons = async () => {
            try {
                const personResponse = await personService.getAll();
                if (isMounted) setPersons(personResponse);
            } catch (error) {
                console.error(error);
                throw new Error("Failed to load persons");
            }
        };
        fetchPersons().catch((err: unknown) => {
            console.error("Failed to load persons:", err);
            setNotificationType("error");
            setNotificationMessage(
                err instanceof Error ? err.message : "Failed to load persons"
            );
            setTimeout(() => {
                setNotificationMessage(null);
            }, 3000);
        });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification
                message={notificationMessage}
                displayType={notificationType}
            />
            <Filter
                searchInput={searchInput}
                handleSearchInputChange={handleSearchInputChange}
            />
            <PersonForm
                name={newName}
                handleNameChange={handleNameChange}
                number={newNumber}
                handleNumberChange={handleNumberChange}
                handleFormSubmit={(e) => {
                    void handleFormSubmit(e);
                }}
            />
            <h2>Numbers</h2>
            <PersonList
                persons={personsToShow}
                handleOnClick={(id: string) => {
                    void handleDeletePerson(id);
                }}
            />
        </div>
    );
};

export default App;
