import * as express from 'express';

import { getMovies, searchMovies, createMovie, updateMovie, deleteMovie } from '../controller/movies';
import { isAdmin } from '../middleware/adminMiddleware';
export const movieRoute = express.Router();

movieRoute.get('/movies', getMovies);
movieRoute.get('/search', searchMovies);
movieRoute.post('/movies', isAdmin, createMovie);
movieRoute.put('/movies/:id', isAdmin, updateMovie);
movieRoute.delete('/movies/:id', isAdmin, deleteMovie);