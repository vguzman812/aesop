export interface NoteType {
    id: string;
    content: string;
    important: boolean;
    date?: string;
    user?: string;
}

export interface Person {
    name: string;
    number?: string;
    id: string;
}
