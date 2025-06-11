import { PersonModel, type IPersonDocument } from "../models/person.js";
import type Person from "../types/Person.js";

export class PersonService {
    /**
     * Get all persons from the database
     */
    async getAll(): Promise<IPersonDocument[]> {
        return await PersonModel.find({}).sort({ createdAt: -1 });
    }

    /**
     * Get a single person by ID
     */
    async getOne(id: string): Promise<IPersonDocument | null> {
        const person = await PersonModel.findById(id);
        return person ?? null;
    }

    /**
     * Create a new person
     */
    async createOne(personData: Person): Promise<IPersonDocument> {
        const person = new PersonModel(personData);
        return await person.save();
    }

    /**
     * Update a person (PUT - complete replacement)
     */
    async updateOne(
        id: string,
        personData: Person
    ): Promise<IPersonDocument | null> {
        const person = await PersonModel.findByIdAndUpdate(id, personData, {
            new: true,
            runValidators: true,
            strict: true,
        });
        return person ?? null;
    }

    /**
     * Partially update a person (PATCH)
     */
    async patchOne(
        id: string,
        updates: Partial<Person>
    ): Promise<IPersonDocument | null> {
        const person = await PersonModel.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
            strict: true,
        });
        return person ?? null;
    }

    /**
     * Delete a person
     */
    async deleteOne(id: string): Promise<boolean> {
        const result = await PersonModel.findByIdAndDelete(id);
        return result !== null;
    }

    /**
     * Get count of all persons in the database
     */
    async getPersonCount(): Promise<number> {
        return await PersonModel.countDocuments();
    }

    /**
     * Check if a person with given name and number already exists
     */
    async personExists(name: string, number: string): Promise<boolean> {
        const person = await PersonModel.findOne({
            $or: [{ name: name }, { number: number }],
        });
        return person !== null;
    }

    /**
     * Search persons by name (case-insensitive partial match)
     */
    async searchByName(searchTerm: string): Promise<IPersonDocument[]> {
        return await PersonModel.find({
            name: { $regex: searchTerm, $options: "i" },
        }).sort({ name: 1 });
    }
}

// Export a singleton instance
export const personService = new PersonService();
