import { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import config from "../config";

export function generateAccessToken(user: IUser): string {
    const token = jwt.sign(
        {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved,
            isBanned: user.isBanned
        },
        config.accessSecret,
        {
            expiresIn: "1h",
        }
    );
    return token;
}

export function generateRefreshToken(user: IUser): string {
    const token = jwt.sign(
        {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved,
            isBanned: user.isBanned
        },
        config.refreshSecret,
        {
            expiresIn: "7d",
        }
    );
    return token;
}