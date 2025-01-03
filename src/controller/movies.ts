import { Request, Response } from 'express';
import mongoose from 'mongoose'; // Import mongoose for ObjectId validation
import * as redis from 'redis';

import { formatErrorMessage, formatSuccessMessage } from '../common/handleResponse';
import { MovieModel } from '../models/movies';
import { AppError, ErrorCode } from '../constants/appCode';
import { config } from '../config';
const redisUrl = `redis://${config.REDIS.HOST}:${config.REDIS.PORT}`;
const createClient = redis.createClient({ url: redisUrl });
createClient.connect();

export const searchMovies = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string; // Extract the 'q' parameter from the query string.

    if (!query) {
      return res.status(400).json(formatErrorMessage({ message: 'Query parameter \'q\' is required' }));
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
    console.log('Search Movies: failed', error);
    return res.status(error?.status || 500).json(formatErrorMessage(error));
  }
};

export const getMovies = async (req: Request, res: Response) => {
  try {
    const getData = await createClient.get('movies');
    let movies = JSON.parse(getData);
    if (!movies?.length) { 
      movies = await MovieModel.find().sort({ created_at: -1 }); 
      await createClient.set('movies', JSON.stringify(movies));
    }
    return res.status(200).json(formatSuccessMessage({ movies }));
  } catch (error) {
    console.log('Get Movie: failed', error);
    return res.status(error?.status || 400).json(formatErrorMessage(error));
  }
};

export const createMovie = async (req: Request, res: Response) => {
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
    await createClient.del('movies');

    // Return success response with the created movie
    return res.status(200).json(formatSuccessMessage({ savedMovie }));
  } catch (error) {
    console.log('Create Movie: failed', error?.message);
    return res.status(error?.status || 400).json(formatErrorMessage(error));
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  try {
    // Extract movie ID and details from the request
    const movieId = req.params.id;
    const { title, genre, rating, streaming_link } = req.body;
    console.log("here")
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

    // Check if the movieId is a valid ObjectId (24 characters long and hex characters only)
    if (!mongoose.Types.ObjectId.isValid(movieId) || movieId.length !== 24) {
      throw { msg: AppError.INVALID_MOVIE_ID, status: ErrorCode.BAD_REQUEST }; // If the ID is not valid, throw an error
    }

    // Find the movie by ID
    const movie = await MovieModel.findById(movieId);
    if (!movie) {
      throw { msg: AppError.MOVIE_NOT_FOUND, status: ErrorCode.NOT_FOUND };
    }

    // Check if the new title is already taken by another movie
    const titleTaken = await MovieModel.findOne({ title, _id: { $ne: movieId } });
    if (titleTaken) {
      throw { msg: AppError.MOVIE_ALREADY_EXIST, status: ErrorCode.NOT_FOUND };
    }

    // Update movie details
    movie.title = title;
    movie.genre = genre;
    movie.rating = rating;
    movie.streaming_link = streaming_link;

    // Save updated movie data
    const updatedMovie = await movie.save();
    await createClient.del('movies');

    // Return success response with the updated movie
    return res.status(200).json(formatSuccessMessage({ updatedMovie }));
  } catch (error) {
    console.log('Update Movie: failed', error?.message);
    return res.status(error?.status || 400).json(formatErrorMessage(error));
  }
};

// Delete Movie API
export const deleteMovie = async (req: Request, res: Response) => {
  try {
    // Extract movie ID from the URL parameters
    const movieId = req.params.id;

    // Check if the movieId is a valid ObjectId (24 characters long and hex characters only)
    if (!mongoose.Types.ObjectId.isValid(movieId) || movieId.length !== 24) {
      throw { msg: AppError.INVALID_MOVIE_ID, status: ErrorCode.BAD_REQUEST }; // If the ID is not valid, throw an error
    }

    // Find the movie by ID
    const movie = await MovieModel.findById(movieId);
    if (!movie) {
      throw { msg: AppError.MOVIE_NOT_FOUND, status: ErrorCode.NOT_FOUND }; // If movie doesn't exist
    }

    // Delete the movie
    await MovieModel.deleteOne({ _id: movieId }); // Delete the movie from the database
    await createClient.del('movies');
    // Return success response
    return res.status(200).json(formatSuccessMessage({ message: 'Movie deleted successfully' }));
  } catch (error) {
    console.log('Delete Movie: failed', error?.message);
    return res.status(error?.status || 400).json(formatErrorMessage(error)); // Error handling
  }
};
