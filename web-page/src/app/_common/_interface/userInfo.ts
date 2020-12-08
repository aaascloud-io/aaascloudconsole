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
// export interface loginUser {
// 	Userid: string;
// 	username: string;
// 	login_id: string;
// 	block: boolean;
// 	permissions: Array<String>;
// }