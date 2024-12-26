import * as express from "express";
import { getMovies, searchMovies, createMovies } from "../controller/movies";
export const movieRoute = express.Router();

movieRoute.get("/movies", getMovies);
movieRoute.get("/search", searchMovies);
movieRoute.post("/movies", createMovies);