import { Router as createRouter, type Router, type Request } from "express";
import { personService } from "../services/personService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import type Person from "../types/Person.js";
import { Types } from "mongoose";

const router: Router = createRouter();

/**
 * GET /api/persons/info
 * Get information about available routes and number of persons
 */
router.get(
    "/info",
    asyncHandler(async (req, res) => {
        const count = await personService.getPersonCount();
        res.send(
            `<h1>Phonebook API</h1>
                <p>Phonebook has info for ${count.toString()} people</p>
                <p>${new Date().toString()}</p>
                <h2>Available Endpoints:</h2>
                <ul>
                    <li>GET /api/persons - Get all persons</li>
                    <li>GET /api/persons/:id - Get a person by ID</li>
                    <li>GET /api/persons/search?name=searchTerm - Search persons by name</li>
                    <li>GET /api/persons/info - This info page</li>
                    <li>POST /api/persons - Create a new person</li>
                    <li>PUT /api/persons/:id - Update a person (complete replacement)</li>
                    <li>PATCH /api/persons/:id - Partially update a person</li>
                    <li>DELETE /api/persons/:id - Delete a person</li>
                </ul>`
        );
    })
);

/**
 * GET /api/persons
 * Get all persons
 */
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const persons = await personService.getAll();
        res.json(persons);
    })
);

/**
 * GET /api/persons/search?name=searchTerm
 * Search persons by name
 */
router.get(
    "/search",
    asyncHandler(async (req, res) => {
        const { name } = req.query;

        if (!name || typeof name !== "string") {
            res.status(400).json({ error: "Name query parameter is required" });
            return;
        }

        const persons = await personService.searchByName(name);
        res.json(persons);
    })
);

/**
 * GET /api/persons/:id
 * Get a single person by ID
 */
router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: "Person ID is required" });
            return;
        }

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid person ID" });
            return;
        }
        const person = await personService.getOne(id);

        if (!person) {
            res.status(404).json({ error: "Person not found" });
            return;
        }

        res.json(person);
    })
);

/**
 * POST /api/persons
 * Create a new person
 */
router.post(
    "/",
    asyncHandler(async (req: Request<object, object, Person>, res) => {
        const { name, number } = req.body;

        // Validation
        if (!name || !number) {
            res.status(400).json({ error: "Name and number are required" });
            return;
        }

        // Check if person already exists
        const exists = await personService.personExists(name, number);
        if (exists) {
            res.status(400).json({
                error: "A person with this name or number already exists",
            });
            return;
        }

        try {
            const newPerson = await personService.createOne({
                name,
                number,
            });
            res.status(201).json(newPerson);
        } catch (error: unknown) {
            // if Mongoose validation fails, repackage it
            if (error instanceof Error && error.name === "ValidationError") {
                res.status(400).json({ error: error.message });
            } else {
                // otherwise bubble up
                throw error;
            }
        }
    })
);

/**
 * PUT /api/persons/:id
 * Update a person (complete replacement)
 */
router.put(
    "/:id",
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const updates = req.body as Person;

        // No ID
        if (!id) {
            res.status(400).json({ error: "Person ID is required" });
            return;
        }

        // Invalid ID format
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid person ID" });
            return;
        }

        // PUT requires all fields
        if (!updates.name || !updates.number) {
            res.status(400).json({
                error: "PUT requires all fields. Both 'name' and 'number' must be provided",
            });
            return;
        }

        try {
            const updatedPerson = await personService.updateOne(id, updates);

            if (!updatedPerson) {
                res.status(404).json({ error: "Person not found" });
                return;
            }

            res.json(updatedPerson);
        } catch (error: unknown) {
            // if Mongoose validation fails, repackage it
            if (error instanceof Error && error.name === "ValidationError") {
                res.status(400).json({ error: error.message });
            } else {
                // otherwise bubble up
                throw error;
            }
        }
    })
);

/**
 * PATCH /api/persons/:id
 * Partially update a person
 */
router.patch(
    "/:id",
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const updates = req.body as Partial<Person>;

        // No ID
        if (!id) {
            res.status(400).json({ error: "Person ID is required" });
            return;
        }

        // Invalid ID format
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid person ID" });
            return;
        }

        // Check if there are any updates
        if (Object.keys(updates).length === 0) {
            res.status(400).json({ error: "No updates provided" });
            return;
        }

        try {
            const updatedPerson = await personService.patchOne(id, updates);

            if (!updatedPerson) {
                res.status(404).json({ error: "Person not found" });
                return;
            }

            res.json(updatedPerson);
        } catch (error: unknown) {
            // if Mongoose validation fails, repackage it
            if (error instanceof Error && error.name === "ValidationError") {
                res.status(400).json({ error: error.message });
            } else {
                // otherwise bubble up
                throw error;
            }
        }
    })
);

/**
 * DELETE /api/persons/:id
 * Delete a person
 */
router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
        const { id } = req.params;

        // No ID
        if (!id) {
            res.status(400).json({ error: "Person ID is required" });
            return;
        }

        // Invalid ID format
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid person ID" });
            return;
        }

        const deleted = await personService.deleteOne(id);

        if (!deleted) {
            res.status(404).json({ error: "Person not found" });
            return;
        }

        res.status(204).end();
    })
);

export default router;
