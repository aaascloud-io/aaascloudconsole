package com.ifocus.aaascloud.constant;

public class CommonConstant {

//	// グループ未設定
//	public static final Integer GROUP_NOT_SET = 0;
//
//	// プロジェクト未設定
//	public static final Integer PROJECT_NOT_SET = 0;

	// 検索用デフォルト文字列
	public static final String DEFAULT_MATCH_ALL = "%%";

	// 認証サーバURL
	public static final String AUTH_SERVER_PREFIX = "https://auth.aaascloud.io";

	// トークン取得コマンド
	public static final String COMMAND_GET_TOKEN = "/v1.0/user/login";

	// トークン取得キー
	public static final String JSON_KEY_ACCESS_TOKEN = "access_token";

	// UID取得コマンド
	public static final String COMMAND_GET_UID = "/auth/realms/trackun/account";

	// UID取得キー
	public static final String JSON_KEY_ATTRIBUTES = "attributes";

	// UID取得キー
	public static final String JSON_KEY_ACCESS_UID = "uid";

}
