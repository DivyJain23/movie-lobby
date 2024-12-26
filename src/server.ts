import * as dotenv from 'dotenv';
dotenv.config();
import * as cors from 'cors';
import * as express from 'express';

import { config } from './config';
import connectDb from './db';
import { router } from './routes';

const app = express();

connectDb().then(() => {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  app.use(cors());

  app.use(express.urlencoded({ extended: false }));

  app.use(express.json());

  app.use('/api/v1', router);
    
  app.listen(config.NODE_ENV, () => {
    // eslint-disable-next-line no-console
    console.log('App listening at: ', config.NODE_ENV);
  });
}).catch(err => {
  // eslint-disable-next-line no-console
  console.log('Unable to connect to database: ', JSON.stringify(err, null, 2));
});

