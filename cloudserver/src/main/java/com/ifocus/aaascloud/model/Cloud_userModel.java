package com.ifocus.aaascloud.model;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;

public class Cloud_userModel {

	// 検索対象
	@Getter
	@Setter
	private Integer targetuserid;

	// 管理者情報
	@Getter
	@Setter
	private Integer userid;
	@Getter
	@Setter
	private Integer companyid;
	@Getter
	@Setter
	private String username;
	@Getter
	@Setter
	private String loginid;
	@Getter
	@Setter
	private String password;
	@Getter
	@Setter
	private Integer role;
	@Getter
	@Setter
	private Integer upperuserid;
	@Getter
	@Setter
	private Integer alive;
	@Getter
	@Setter
	private Integer i_uid;
	@Getter
	@Setter
	private Timestamp i_time;
	@Getter
	@Setter
	private Integer u_uid;
	@Getter
	@Setter
	private Timestamp u_time;

	// 会社情報
	@Getter
	@Setter
	private String corporatenumber;
	@Getter
	@Setter
	private String companyName;
	@Getter
	@Setter
	private String address;
	@Getter
	@Setter
	private String industry;
	@Getter
	@Setter
	private String mail;
	@Getter
	@Setter
	private String tel;
	@Getter
	@Setter
	private String fax;
	@Getter
	@Setter
	private Integer level;
	// デバイス数
	@Getter
	@Setter
	private Integer devicecount;

}