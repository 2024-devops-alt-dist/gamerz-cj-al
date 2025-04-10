import { Request, Response } from "express";
import Room from "../models/Room";
import logger from "../utils/logger";

export const getRooms = async (req: Request, res: Response): Promise<any> => {
    try {
		const rooms = await Room.find();

    if (!rooms || rooms.length === 0) {
        return res.status(404).json({
            message: 'Aucun salon trouvé.',
        });
    }
		res.status(200).json(rooms);
    } catch (error) {
		res.status(500).json({ status: 500, error: "Internal Server Error" });
    }
};

export const getRoomById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id: string = req.params.id;
        const room = await Room.findById(id);
        if(!room) {
            res.status(404).json({ status: 404, error: "Aucun salon trouvé avec cet identifiant." });
            return;
        }
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ status: 500, error: "Internal Server Error" });
    }
};

export const createRoom = async (req: Request, res: Response) => {
    try {
        const room = new Room({
            name: req.body.name,
            description: req.body.description,
			picture: req.body.picture
        });

        const createdRoom = await room.save();

        logger.info('Room created');

        res.status(201).json({
            id: createdRoom._id,
            name: createdRoom.name,
            description: createdRoom.description,
			picture: createdRoom.picture
        });
    } catch (error) {
        res.status(500).json({ status: 500, error: "Internal Server Error" });
    }
};

export const updateRoom = async (req: Request, res: Response) => {
	try {
		const id: string = req.params.id;
		const body = req.body;	
		let room = await Room.findById(id);
		if(!room) {
			res.status(404).json({ status: 404, error: "Room not found" });
			return;
		}
		for(let i = 0; i < body.length; i ++ ) {
			const prop = body[i].property;
			for(const key in room) {
				if(key === prop) {
					room.set(key, body[i].value);
				}
			}
		}
		await room.save();
		logger.info('Room updated');
		res.status(200).json();
	} catch (error) {
		res.status(500).json({ status: 500, error: "Internal Server Error" });        
	}
};

export const deleteRoom = async (req: Request, res: Response) => {
	try {
		const id: string = req.params.id;
		const room = await Room.findById(id);
		if(!room) {
			res.status(404).json({ status: 404, error: "Room not found" });
			return;
		}
		const result = await Room.deleteOne({ _id: id });
		if(result.deletedCount === 0) {
			res.status(400).json({ status: 404, error: "Room deletion failed" });
			return;
		}
		logger.info('Room deleted.')
		res.status(200).json({
            message: "Room deleted successfully",
            id: id
        });
	} catch (error) {
		res.status(500).json({ status: 500, error: "Internal Server Error" });
	}
}