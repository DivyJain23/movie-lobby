import * as express from 'express';

import { movieRoute } from './movies';

export const router = express.Router();

router.use('/movie', movieRoute);