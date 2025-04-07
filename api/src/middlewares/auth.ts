import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import User from "../models/User";
import { log } from "console";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(403).json({ message: 'No token, access forbidden' });
      return;
    }
    const decoded = jwt.verify(token, config.secret) as jwt.JwtPayload;
    console.log(token);
    console.log(decoded);
    const user = await User.findOne({
      _id: decoded._id
    })
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed, expired or invalid token' });
    return;
  }
}

export default auth