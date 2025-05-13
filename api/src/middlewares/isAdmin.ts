import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import logger from "../utils/logger";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;
    if (!token) {
        res.status(403).json({ message: 'Access token is missing, access forbidden' });
        return;
    }
    try {
        const decoded = jwt.verify(token, config.accessSecret) as jwt.JwtPayload;
        if(!decoded.role.includes('admin')) {
            res.status(403).json({ message: 'Access denied, insufficient role' });
            return;
        }
        logger.info('User role authorized');
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed, expired or invalid token' });
    }

}

export default isAdmin;