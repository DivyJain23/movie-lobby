import { Request, Response, NextFunction } from 'express';

import { AppError, ErrorCode } from '../constants/appCode'; // Adjust the import based on your app structure

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

const SECRET_KEY = '12345';  // Use your actual JWT secret key

// Middleware to check if the user is an admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];  // Extract token from 'Authorization' header
    if (!token) {
      throw { msg: AppError.UNAUTHORIZED, status: ErrorCode.UNAUTHORIZED };
    }
    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);  // Pass the secret key to jwt.verify
    } catch (verifyError) {
      throw { msg: 'Invalid token', status: ErrorCode.UNAUTHORIZED };
    }

    // Ensure the decoded object contains the role
    if (decoded?.role !== 'admin') {
      throw { msg: AppError.ADMIN_ROLE_REQUIRED, status: ErrorCode.UNAUTHORIZED };
    }

    next();  // Proceed if the user is an admin
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Admin middleware error:', error);
    return res.status(error?.status || 400).json({ success: false, msg: error?.msg || 'An error occurred' });
  }
};
