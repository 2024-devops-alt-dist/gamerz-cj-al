import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import logger from "../utils/logger";
import config from "../config";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const login = async (req: Request, res: Response): Promise<void> => {
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
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        
        user.refreshToken = refreshToken;
        user.save(); 

        logger.info('User authenticated');
        res.status(200)
            .cookie("access_token", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 60 * 60 * 1000
            })
            .cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            .json({ status: 200, message: "Authenticated" });
    } catch (error) {
        res.status(500).json({ status: 500, error: "Internal Server Error" });
    }
}

export const register = async (req: Request, res: Response): Promise<void> => {
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

export const logout = async (req: Request, res: Response): Promise<void> => {
    res.status(200)
        .clearCookie('access_token', { httpOnly: true, sameSite: 'strict', path: '/' })
        .clearCookie('refresh_token', { httpOnly: true, sameSite: 'strict', path: '/' })
        .json({ message: 'Logout successful' });
};

export const me = async (req: Request, res: Response) => {
    const token = req.cookies.access_token;
    if (!token) {
        res.status(403).json({ message: 'No token, access forbidden' });
        return;
    }
    try {
        const decoded = jwt.verify(token, config.accessSecret) as jwt.JwtPayload;
        const user = await User.findOne({
            _id: decoded._id
        }).select(['-password', '-refreshToken']);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        logger.info('Api return authenticated user')
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed, expired or invalid token' });
    }
}

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    if (!accessToken || !refreshToken) {
        res.status(403).json({ message: 'Access or refresh token is missing, access forbidden' });
        return;
    }
    try {
        jwt.verify(accessToken, config.accessSecret);
    } catch (error) {
        if(error instanceof JsonWebTokenError) {
            res.status(401).json({ message: 'Access token is invalid' });
            return;
        }
    }
    const decoded = jwt.decode(accessToken) as jwt.JwtPayload;
    const user = await User.findOne({
        _id: decoded._id
    });
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    if (!user.refreshToken) {
        res.status(401).json({ message: 'Refresh token is missing, user have to login' });
        return;
    }
    if (user.refreshToken !== refreshToken) {
        res.status(401).json({ message: 'Refresh token is invaild' });
    }
    try {
        jwt.verify(user.refreshToken, config.refreshSecret);
        const newAccessToken = generateAccessToken(user);
        logger.info('User authenticated');
        res.status(200)
            .cookie("access_token", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 1000
            })
            .json({ status: 200, message: "Authenticated, api send back new access token" });
    } catch (error) {
        res.status(401).json({ message: 'Refresh token is invalid or expired' });
    }
}