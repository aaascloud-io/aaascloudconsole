//ログインしたユーザーの情報（cookie に格納）
export interface UserInfo {
	userid: number;
	companyid: string;
	username: string;
	loginid: string;
	password: string;
	role: number;
	upperuserid: number;
	companyname: string;
	address: string;
	industry: string;
	mail: string;
	tel: string;
	fax: string;
	ravel: Number;
}

//ログインしたユーザーの情報（cookieに格納）
export interface LoginInfo {
	loginuserid: number;
	logincompanyid: number;
	loginusername: string;
	loginid: string;
	loginrole: number;
	loginupperuserid: number;
}