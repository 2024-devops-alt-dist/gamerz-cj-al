import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import logger from "../utils/logger";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(403).json({ message: 'No token, access forbidden' });
        return;
    }
    const decoded = jwt.verify(token, config.secret) as jwt.JwtPayload;
    if(!decoded.role.includes('admin')) {
        res.status(403).json({ message: 'Access denied, insufficient role' });
        return;
    }
    logger.info('User role authorized');
    next();
}

export default isAdmin;