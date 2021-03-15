package com.ifocus.aaascloud.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginInfo {

	// ログイン情報
	private Integer loginuserid;
	private Integer logincompanyid;
	private String loginusername;
	private Integer loginrole;
	private Integer loginupperuserid;
	
	@Getter
	@Setter
	private String access_token;

	// トークン情報
	private String access_token;
}