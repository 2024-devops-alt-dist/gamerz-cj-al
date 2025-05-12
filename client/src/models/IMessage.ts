import { IRoom } from "./IRoom";
import { IUser } from "./IUser";

export interface IMessage  {
	_id?: string;
    content : string;
    user: IUser | null;
    room: IRoom | null;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
}
