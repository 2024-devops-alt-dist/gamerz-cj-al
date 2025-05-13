import mongoose, { Schema, Document } from 'mongoose';
import { IRoom } from './Room';
import { IUser } from './User';

export interface IMessage extends Document {
    id: string;
    content : string;
    user: IUser;
    room: IRoom;
    isDeleted: boolean;
}

const messageSchema  = new Schema<IMessage>(
    {
        id: { type: String },
        content: { type: String, required: true },
        user: {type: mongoose.Types.ObjectId, ref: "User"},
        room: {type: mongoose.Types.ObjectId, ref: "Room"},
        isDeleted: { type: Boolean, default: false },
    }, 
    { timestamps: true }
);

const Message  = mongoose.model<IMessage>('Message', messageSchema);

export default Message;