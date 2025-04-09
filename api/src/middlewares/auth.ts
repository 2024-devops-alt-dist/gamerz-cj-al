import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import config from "../config";
import User from "../models/User";

const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;
    if (!token) {
		res.status(403).json({ message: 'Access token is missing, access forbidden' });
		return;
    }
    try {
        const valideToken = jwt.verify(token, config.accessSecret) as jwt.JwtPayload;
        const user = await User.findOne({
          	_id: valideToken._id
        })
        if (!user) {
			res.status(404).json({ message: 'User not found' });
			return;
        }
        next();
    } catch (error) {
		if(error instanceof JsonWebTokenError) {
			res.status(401).json({ message: 'Invalid access token' });
			return;
		}
		if(error instanceof TokenExpiredError) {
			res.status(401).json({ message: 'Expired access token' });
			return;
		}
		res.status(500).json({ message: 'Authentication failed, internal server error' });
		return;
    }
}

export default auth