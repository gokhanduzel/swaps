import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import asyncHandler from 'express-async-handler';

const authenticate = asyncHandler(async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies['accessToken']) {
        try {
            // Extract the token from cookies
            token = req.cookies['accessToken'];

            // Verify token
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-passwordHash');
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

export { authenticate };
