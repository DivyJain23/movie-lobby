import * as express from 'express';

import { getMovies, searchMovies, createMovie, updateMovie, deleteMovie } from '../controller/movies';
export const movieRoute = express.Router();

movieRoute.get('/movies', getMovies);
movieRoute.get('/search', searchMovies);
movieRoute.post('/movies', createMovie);
movieRoute.put('/movies/:id', updateMovie);
movieRoute.delete('/movies/:id', deleteMovie);