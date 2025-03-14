import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import config from "../config";

function generateToken(user: IUser): string {
    const token = jwt.sign(
        {
            _id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved,
            isBanned: user.isBanned
        },
        config.secret,
        {
            expiresIn: "1d",
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
        res.status(200).cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 900000
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
            id: createdUser.id,
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