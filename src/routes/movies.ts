import * as express from "express";
import { getMovies, searchMovies } from "../controller/movies";
export const movieRoute = express.Router();

movieRoute.get("/movies", getMovies);
movieRoute.get("/search", searchMovies);