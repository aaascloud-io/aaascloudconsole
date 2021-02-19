package com.ifocus.aaascloud.model;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;

public class Cloud_errlogModel {

	@Getter
	@Setter
	private LoginInfo loginInfo;
	@Getter
	@Setter
	private TargetUserInfo targetUserInfo;

	@Getter
	@Setter
	private Integer rowid;
	@Getter
	@Setter
	private Integer userid;
	@Getter
	@Setter
	private String device;
	@Getter
	@Setter
	private Integer statusflag;
	@Getter
	@Setter
	private Timestamp datatime;
	@Getter
	@Setter
	private String systemsort;
	@Getter
	@Setter
	private String systemid;
	@Getter
	@Setter
	private String componentid;
	@Getter
	@Setter
	private String messageid;
	@Getter
	@Setter
	private String messagesort;
	@Getter
	@Setter
	private String errcode;
	@Getter
	@Setter
	private String errMessage;
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