import mongoose, { Schema, type Document, type Types } from "mongoose";
import type Person from "../types/Person.js";

export interface IPersonDocument extends Person, Document {
    createdAt: Date;
    updatedAt: Date;
}

/*
    What this allows
        - Optional country code (+1 or just 1):
        - Area code with or without parentheses ((212) or 212)
        - Separators:
            Dash: -
            Dot: .
            Space: (space)
            Or no separator at all
        - Valid North American numbers:
            First digit of area and prefix must be 2–9 (per NANP rules)
    What this rejects
        - Too few/many digits
        - Letters or extensions (ext)
        - Extra characters before/after
*/
const usPhoneRE =
    /^(?:\+1\s?|-1\s?)?(?:\([2-9]\d{2}\)|[2-9]\d{2})(?:[-.\s]?\d{3})(?:[-.\s]?\d{4})$/;

const PersonSchema = new Schema<IPersonDocument>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [3, "Name must be at least 3 characters long"],
        },
        number: {
            type: String,
            required: [true, "Number is required"],
            validate: {
                validator: (v: string) => usPhoneRE.test(v),
                message:
                    "Please enter a valid 10-digit US phone number (e.g. (212) 555-1234)",
            },
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                ret.id = (ret._id as Types.ObjectId).toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Create indexes for better performance
PersonSchema.index({ name: 1 });
PersonSchema.index({ number: 1 });

export const PersonModel = mongoose.model<IPersonDocument>(
    "Person",
    PersonSchema
);
