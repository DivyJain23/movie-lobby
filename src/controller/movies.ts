import { Request, Response } from "express";
import { formatErrorMessage, formatSuccessMessage } from "../common/handleResponse";
import { MovieModel } from "../models/movies";
import { IMovie } from "../interface";
import { AppError, ErrorCode } from "../constants/appCode";

export const searchMovies = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string; // Extract the 'q' parameter from the query string.

        if (!query) {
            return res.status(400).json(formatErrorMessage({ message: "Query parameter 'q' is required" }));
        }

        // Perform case-insensitive search on title or genre.
        const movies = await MovieModel.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, // Case-insensitive search on title.
                { genre: { $regex: query, $options: 'i' } }, // Case-insensitive search on genre.
            ],
        }).sort({ created_at: -1 });

        return res.status(200).json(formatSuccessMessage({ movies }));
    } catch (error) {
        console.log("Search Movies: failed", error);
        return res.status(error?.status || 500).json(formatErrorMessage(error));
    }
}

export const getMovies = async (req: Request, res: Response) => {
        try {
            const movies = await MovieModel.find().sort({ created_at: -1 }); 
            return res.status(200).json(formatSuccessMessage({ movies }));
        } catch (error) {
            console.log("Get Feed: failed", error);
            return res.status(error?.status || 400).json(formatErrorMessage(error));
        }
}

export const createMovies = async (req: Request, res: Response) => {
    try {
        // Extract movie details from the request body
        const { title, genre, rating, streaming_link } = req.body;

        // Validate required fields
        if (!title) {
            throw { msg: AppError.TITLE_NOT_FOUND, status: ErrorCode.NOT_FOUND };
        }
        if (!genre) {
            throw { msg: AppError.GENRE_NOT_FOUND, status: ErrorCode.NOT_FOUND };
        }
        if (!rating) {
            throw { msg: AppError.RATING_NOT_FOUND, status: ErrorCode.NOT_FOUND };
        }
        if (!streaming_link) {
            throw { msg: AppError.STREAMING_LINK_NOT_FOUND, status: ErrorCode.NOT_FOUND };
        }

        // Check if the movie already exists in the database
        const movieExists = await MovieModel.findOne({ title });
        if (movieExists) {
            throw { msg: AppError.MOVIE_ALREADY_EXIST, status: ErrorCode.NOT_FOUND };
        }

        // Create movie payload
        const moviePayload = {
            title,
            genre,
            rating,
            streaming_link,
        };

        // Create a new movie document and save it to the database
        const newMovie = new MovieModel(moviePayload);
        const savedMovie = await newMovie.save();

        // Return success response with the created movie
        return res.status(200).json(formatSuccessMessage({ data: savedMovie }));
    } catch (error) {
        console.log("Create Movie: failed", error?.message);
        return res.status(error?.status || 400).json(formatErrorMessage(error));
    }
};

