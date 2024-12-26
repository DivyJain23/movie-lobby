import mongoose, { Schema } from "mongoose";
import { IMovie } from "../interface/index";
const movieModel = new Schema<IMovie>(
    {
        title: {
            type: String,
            required: true
        },
        genre: {
            type: String,
            required: false
        },
        rating: {
            type: Number,
            required: true
        },
        streaming_link: {
            type: String,
            required: true
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, strict: false }
);

export const MovieModel = mongoose.model<IMovie>('movies', movieModel);
