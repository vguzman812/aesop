const Filter = ({
    searchInput,
    handleSearchInputChange,
}: {
    searchInput: string;
    handleSearchInputChange: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => void;
}) => {
    return (
        <div>
            filter:{" "}
            <input
                value={searchInput}
                onChange={handleSearchInputChange}
            />
        </div>
    );
};

export default Filter;
