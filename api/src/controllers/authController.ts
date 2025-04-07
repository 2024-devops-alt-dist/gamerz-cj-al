import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import config from "../config";

function generateToken(user: IUser): string {
    const token = jwt.sign(
        {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved,
            isBanned: user.isBanned
        },
        config.secret,
        {
            expiresIn: "1h",
        }
    );
    return token;
}

export const login = async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const password: string = req.body.password;
    try {
        const user = await User.findOne({ email: email });
        if(!user) {
            res.status(404).json({ status: 404, error: "User not Found" });
            return;
        }
        if(!bcrypt.compareSync(password, user.password)) {
            res.status(400).json({ status: 400, error: "Wrong password" });
            return;
        }
        const token = generateToken(user);
        logger.info('User authenticated');
        res.status(200).cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 1000
        }).json({ status: 200, message: "Authenticated" });
    } catch (error) {
        res.status(500).json({ status: 500, error: "Internal Server Error" });
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            description: req.body.description ? req.body.description : "",
        });
        user.password = await bcrypt.hash(req.body.password, 10);        
        const createdUser = await User.insertOne(user);            
        if(!createdUser) {
            res.status(404).json({ status: 404, error: "Not Found" });
            return;
        }
        res.status(201).json({
            _id: createdUser._id,
            username: createdUser.username,
            email: createdUser.email,
            role: createdUser.role,
            description: createdUser.description,
            isApproved: createdUser.isApproved,
            isBanned: createdUser.isBanned,
            createdAt: createdUser.createdAt,
            updatedAt: createdUser.updatedAt
        });
    } catch (error) {
        res.status(500).json({ status: 500, error: "Internal Server Error" });        
    }
};

export const logout = async (req: Request, res: Response) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'strict', path: '/' });
    res.status(200).json({ message: 'Logout successful' });
};

export const me = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(403).json({ message: 'No token, access forbidden' });
            return;
        }
        const decoded = jwt.verify(token, config.secret) as jwt.JwtPayload;
        const user = await User.findOne({
            _id: decoded._id
        })
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        logger.info('Api return authenticated user')
        res.status(200).json({ 
            _id: user._id, 
            usernanme: user.username,
            email: user.email,
            role: user.role,
            description: user.description,
            isApproved: user.isApproved,
            isBanned: user.isBanned,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed, expired or invalid token' });
    }
}
