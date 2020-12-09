package com.ifocus.aaascloud.model;

import lombok.Getter;
import lombok.Setter;

public class LoginInfo {

	// ログイン情報
	@Getter
	@Setter
	private Integer loginuserid;
	@Getter
	@Setter
	private Integer logincompanyid;
	@Getter
	@Setter
	private String loginusername;
	@Getter
	@Setter
	private String loginid;
	@Getter
	@Setter
	private Integer loginrole;
	@Getter
	@Setter
	private Integer loginupperuserid;

}