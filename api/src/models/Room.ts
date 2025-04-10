import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
	id: string;
    name : string;
    description : string;
}

const roomSchema = new Schema<IRoom>(
    {
        id: { type: String },
        name: { type: String, required: true },
        description: { type: String },
    }, 
    { timestamps: true }
);

const Room = mongoose.model<IRoom>('Room', roomSchema);

export default Room;