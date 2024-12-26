import { Request, Response } from "express";
import { formatErrorMessage, formatSuccessMessage } from "../common/handleResponse";
import { MovieModel } from "../models/movies";

export const searchMovies = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string; // Extract the 'q' parameter from the query string.

        if (!query) {
            return res.status(400).json(formatErrorMessage({ message: "Query parameter 'q' is required" }));
        }

        // Perform case-insensitive search on title or genre.
        const items = await MovieModel.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, // Case-insensitive search on title.
                { genre: { $regex: query, $options: 'i' } }, // Case-insensitive search on genre.
            ],
        }).sort({ created_at: -1 });

        return res.status(200).json(formatSuccessMessage({ items }));
    } catch (error) {
        console.log("Search Movies: failed", error);
        return res.status(error?.status || 500).json(formatErrorMessage(error));
    }
}

export const getMovies = async (req: Request, res: Response) => {
        try {
            const items = await MovieModel.find().sort({ created_at: -1 }); 
            return res.status(200).json(formatSuccessMessage({ items }));
        } catch (error) {
            console.log("Get Feed: failed", error);
            return res.status(error?.status || 400).json(formatErrorMessage(error));
        }
}
