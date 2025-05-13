export interface IUser  {
	_id? : string;
    username : string;
    email : string;
	password? : string;
    role : string[];
	description : string,
	isApproved : boolean;
	isBanned : boolean;
}
