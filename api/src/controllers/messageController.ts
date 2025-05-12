import { Request, Response } from "express";
import Message from "../models/Message";
import logger from "../utils/logger";

export const getMessages = async (req: Request, res: Response): Promise<any> => {
    try {
		const messages = await Message.find();

    if (!messages || messages.length === 0) {
        return res.status(404).json({
            message: 'Aucun message trouvé.',
        });
    }
		res.status(200).json(messages);
    } catch (error) {
		res.status(500).json({ status: 500, error: "Internal Server Error" });
    }
};

export const getMessagesById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id: string = req.params.id;
        const message = await Message.findById(id);
        if(!message) {
            res.status(404).json({ status: 404, error: "Aucun message trouvé avec cet identifiant." });
            return;
        }
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ status: 500, error: "Internal Server Error" });
    }
};

export const createMessages = async (req: Request, res: Response) => {
    try {
        const message = new Message({
            content: req.body.content
        });

        const createdMessage = await message.save();

        logger.info('Message created');

        res.status(201).json({
            id: createdMessage._id,
            content: createdMessage.content
        });
    } catch (error) {
        res.status(500).json({ status: 500, error: "Internal Server Error" });
    }
};

export const updateMessages = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const body = req.body;	
        let message = await Message.findById(id);
        if(!message) {
            res.status(404).json({ status: 404, error: "Message not found" });
            return;
        }
        
        for(let i = 0; i < body.length; i ++ ) {
            const prop = body[i].property;
            for(const key in message) {
                if(key === prop) {
                    message.set(key, body[i].value);
                }
            }
        }
        await message.save();
        logger.info('Message updated');
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ status: 500, error: "Internal Server Error" });        
    }
};

export const deleteMessages = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const message = await Message.findById(id);
        if(!message) {
            res.status(404).json({ status: 404, error: "Message not found" });
            return;
        }
        const result = await Message.deleteOne({ _id: id });
        if(result.deletedCount === 0) {
            res.status(400).json({ status: 404, error: "Message deletion failed" });
            return;
        }
        logger.info('Message deleted.')
        res.status(200).json({
            message: "Message deleted successfully",
            id: id
        });
    } catch (error) {
        res.status(500).json({ status: 500, error: "Internal Server Error" });
    }
};

export const getMessagesByRoomId = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const messages = await Message.find({ room: roomId }).populate('user').populate('room');
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des messages." });
    }
};

