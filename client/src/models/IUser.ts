export interface IUser  {
	id : string;
    username : string;
    email : string;
	password : string;
    role : ('admin' | 'user')[];
	registrationRequest : string,
	isApproved : boolean;
	isBanned : boolean;
}
