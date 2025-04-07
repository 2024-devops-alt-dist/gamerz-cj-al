export interface IUser  {
	id : string;
    username : string;
    email : string;
	password : string;
    role : ('admin' | 'user')[];
	description : string,
	isApproved : boolean;
	isBanned : boolean;
}
