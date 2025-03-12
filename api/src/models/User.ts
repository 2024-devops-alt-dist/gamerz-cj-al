import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
	id?: string;
    username: string;
    email: string;
	password: string;
    role: ('admin' | 'user')[];
	registrationRequest: string,
	isApproved: boolean;
	isBanned: boolean;
}

const userSchema = new Schema<IUser>(
	{
		id: { type: String },
		username: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: [String], enum: ['admin', 'user'], default: ['user'] },
		registrationRequest: { type: String },
		isApproved: { type: Boolean, default: false },
		isBanned: { type: Boolean, default: false }
	}, 
	{ timestamps: true }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;