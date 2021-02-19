package com.ifocus.aaascloud.model;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;

public class Cloud_companyModel {

	@Getter
	@Setter
	private LoginInfo loginInfo;
	@Getter
	@Setter
	private TargetUserInfo targetUserInfo;

	@Getter
	@Setter
	private Integer companyid;
	@Getter
	@Setter
	private String corporatenumber;
	@Getter
	@Setter
	private String companyname;
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

}
