import React from "react";

const Notification = ({
    message,
    displayType = "info",
}: {
    message: string | null;
    displayType: "error" | "success" | "info";
}) => {
    const errorStyle: React.CSSProperties = {
        color: "red",
        background: "lightgrey",
        fontSize: "20px",
        borderStyle: "solid",
        borderRadius: "5px",
        padding: "10px",
        marginBottom: "10px",
    };

    const defaultStyle: React.CSSProperties = {
        color: "green",
        background: "lightgrey",
        fontSize: "20px",
        borderStyle: "solid",
        borderRadius: "5px",
        padding: "10px",
        marginBottom: "10px",
    };

    let chosenStyle: React.CSSProperties = {};

    switch (displayType) {
        case "error":
            chosenStyle = errorStyle;
            break;

        default:
            chosenStyle = defaultStyle;
            break;
    }
    if (message) return <div style={chosenStyle}>{message}</div>;
};

export default Notification;
