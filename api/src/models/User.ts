import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
	id?: string;
    username: string;
    email: string;
	password: string;
    role: ('admin' | 'user')[];
	description: string,
	isApproved: boolean;
	isBanned: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new Schema<IUser>(
	{
		id: { type: String },
		username: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: [String], enum: ['admin', 'user'], default: ['user'] },
		description: { type: String },
		isApproved: { type: Boolean, default: false },
		isBanned: { type: Boolean, default: false },
	}, 
	{ timestamps: true }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;