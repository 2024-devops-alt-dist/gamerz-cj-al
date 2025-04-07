import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import logger from "../utils/logger";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
		const users = await User.find();
		if(!users) {
			res.status(404).json({ status: 404, error: "Not Found" });
			return;
      	}
		res.status(200).json(users);
    } catch (error) {
		res.status(500).json({ status: 500, error: "Internal Server Error" });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
	try {
		const id: string = req.params.id;
		const user = await User.findById(id);
		if(!user) {
			res.status(404).json({ status: 404, error: "Not Found" });
			return;
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ status: 500, error: "Internal Server Error" });
	}
};

export const createUser = async (req: Request, res: Response) => {
	try {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            role: req.body.role,
            description: req.body.description,
            isApproved: req.body.isApproved,
            isBanned: req.body.isBanned
        });
		const createdUser = await User.insertOne(user);            
		if(!createdUser) {
			res.status(404).json({ status: 404, error: "Not Found" });
			return;
		}
		logger.info('User created');
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

export const updateUser = async (req: Request, res: Response) => {
	try {
		const id: string = req.params.id;
		const body = req.body;	
		let user = await User.findById(id);
		if(!user) {
			res.status(404).json({ status: 404, error: "Not Found" });
			return;
		}
		for(let i = 0; i < body.length; i ++ ) {
			const prop = body[i].property;
			for(const key in user) {
				if(key === prop) {
					user.set(key, body[i].value);
				}
			}
		}
		await user.save();
		logger.info('User updated');
		res.status(204).json();
	} catch (error) {
		res.status(500).json({ status: 500, error: "Internal Server Error" });        
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const id: string = req.params.id;
		const user = await User.findById(id);
		if(!user) {
			res.status(404).json({ status: 404, error: "Not Found" });
			return;
		}
		const result = await User.deleteOne({ _id: id });
		if(result.deletedCount === 0) {
			res.status(400).json({ status: 404, error: "User suppression failed" });
			return;
		}
		logger.info('User deleted.')
		res.status(204).json();
	} catch (error) {
		res.status(500).json({ status: 500, error: "Internal Server Error" });
	}
}

