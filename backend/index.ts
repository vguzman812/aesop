import express, {type Request} from "express";
import morgan from "morgan";

import data from "./data.json" with { type: "json" };
import type PhoneBookEntry from "./types/PhoneBookEntries.ts";
import type Person from "./types/Person.js";

const PORT = process.env.PORT ?? 3001;
const app = express();

const morganMiddleware = morgan((tokens, req: Request) => {
    if (req.method === "POST") {
        return req.method + " " + JSON.stringify(req.body);
    }
})

app.use(express.json());
app.use(morganMiddleware);
app.use(express.static("dist"));


let phoneBookEntries = data as PhoneBookEntry[];

app.get("/info", (request, response) => {
    response.send(
        `<p>Phonebook has info for ${phoneBookEntries.length.toString()} people</p>
        <p>${new Date().toString()}</p>`
    );
});

app.get("/api/persons", (request, response) => {
    response.json(phoneBookEntries);
});

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const person = phoneBookEntries.find((p) => p.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const person = phoneBookEntries.find((p) => p.id === id);
    if (person) {
        phoneBookEntries = phoneBookEntries.filter((p) => p.id !== id);
        response.status(204).end();
    } else {
        response.status(404).end();
    }
})

app.post<object, PhoneBookEntry | { error: string }, Person>("/api/persons", (request, response) => {
    if (!request.body.name || !request.body.number) {
        response.status(400)
        .json({ error: "name or number is missing" });
        return;
    }

    const { name, number } = request.body;
    const newPerson: PhoneBookEntry = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        number,
    };

    phoneBookEntries = phoneBookEntries.concat(newPerson);

    response.json(newPerson);
    return
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT.toString()}`);
});
