//ログインしたユーザーの情報（cookie に格納）
export interface UserInfo{
    uid:string ;
	login_id:string;
	company:string;
	address:string;
	industry_type:string;
	mail:string;
	tel:string;
	created:string;
	creatid:string;
	set_1:string;
	set_2:string;
	set_3:string;
	role:number;
}

//ログインしたユーザーの情報（cookieに格納）
export interface loginUser{
	uid:string;
	uname:string;
	login_id:string;
	block: boolean;
	permissions: Array<String>;
}