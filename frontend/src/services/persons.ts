import axios from "axios";
const baseUrl = "/api/persons";
import { Person } from "../Types/types";

const getAll = async (signal?: AbortSignal): Promise<Person[]> => {
    try {
        const response = await axios.get<Person[]>(baseUrl, { signal });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const createOne = async (newObject: Omit<Person, "id">): Promise<Person> => {
    try {
        const reponse = await axios.post<Person>(baseUrl, newObject);
        return reponse.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const updateOne = async (
    id: string,
    updatedFields: Omit<Person, "id">
): Promise<Person> => {
    try {
        const response = await axios.put<Person>(
            `${baseUrl}/${id}`,
            updatedFields
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const deleteOne = async (id: string): Promise<Person> => {
    try {
        const response = await axios.delete<Person>(`${baseUrl}/${id}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default {
    getAll,
    createOne,
    updateOne,
    deleteOne,
};
