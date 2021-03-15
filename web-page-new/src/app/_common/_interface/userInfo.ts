//ログインしたユーザーの情報（cookie に格納）
export interface UserInfo{
    uid:string ;
	login_id:string;
	company:string;
	role:number;
	upperuserid:string;
	access_token:string;
	fullname:string;
}
