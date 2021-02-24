package com.ifocus.aaascloud.model;

import java.sql.Timestamp;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Cloud_userModel {

	private LoginInfo loginInfo;
	private TargetUserInfo targetUserInfo;
	private List<Cloud_userModel> cloud_userModelList;

	// 管理者情報
	private Integer userid;
	private Integer companyid;
	private String username;
	private String loginid;
	private String password;
	private Integer role;
	private Integer upperuserid;
	private Integer alive;
	private Integer i_uid;
	private Timestamp i_time;
	private Integer u_uid;
	private Timestamp u_time;

	// 会社情報
	private String corporatenumber;
	private String companyname;
	private String address;
	private String industry;
	private String mail;
	private String tel;
	private String fax;
	private Integer level;
	// デバイス数
	private Integer devicecount;
	// ユーザ数
	private Integer usercount;

}