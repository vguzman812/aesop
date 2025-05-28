const PersonForm = ({
    handleFormSubmit,
    name,
    handleNameChange,
    number,
    handleNumberChange,
}: {
    handleFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    name: string;
    handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    number: string;
    handleNumberChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <form onSubmit={handleFormSubmit}>
            <div>
                name:{" "}
                <input
                    value={name}
                    onChange={handleNameChange}
                />
            </div>
            <div>
                number:{" "}
                <input
                    value={number}
                    onChange={handleNumberChange}
                />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    );
};

export default PersonForm;
