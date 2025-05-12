import mongoose, { Schema, Document } from 'mongoose';
import Message from './Message';

export interface IUser extends Document {
	id: string;
    username: string;
    email: string;
	password: string;
    role: ('admin' | 'user')[];
	description: string,
	isApproved: boolean;
	isBanned: boolean;
	createdAt: Date;
	updatedAt: Date;
	refreshToken: string;
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
		refreshToken: { type: String, default: null }
	}, 
	{ timestamps: true }
);


// 🔁 Hook post-suppression
userSchema.post("findOneAndDelete", async function (doc) {
	if (doc) {
		await Message.updateMany(
			{ user: doc._id },
			{ $set: { content: "Utilisateur supprimé", user: null } }
		);
	}
});


const User = mongoose.model<IUser>('User', userSchema);

export default User;