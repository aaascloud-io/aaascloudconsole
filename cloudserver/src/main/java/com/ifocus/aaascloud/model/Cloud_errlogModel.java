package com.ifocus.aaascloud.model;

import java.sql.Timestamp;

import com.ifocus.aaascloud.constant.StatusFlagConstant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Cloud_errlogModel {

	private LoginInfo loginInfo;
	private TargetUserInfo targetUserInfo;

	private Integer rowid;
	private Integer userid;
	private String username;
	private String device;
	private Integer statusflag;
	private Timestamp datatime;
	private String systemsort;
	private String systemid;
	private String componentid;
	private String messageid;
	private String messagesort;
	private String errcode;
	private String errMessage;
	private Integer alive;
	private Integer i_uid;
	private Timestamp i_time;
	private Integer u_uid;
	private Timestamp u_time;

	// 画面表示用項目
	public String getStatusInStr() {
		String statusInStr = "";
		if (this.statusflag == StatusFlagConstant.FLAG_NEW) {
			statusInStr = StatusFlagConstant.FLAG_NEW_IN_STRING;
		} else if (this.statusflag == StatusFlagConstant.FLAG_WIP) {
			statusInStr = StatusFlagConstant.FLAG_WIP_IN_STRING;
		} else if (this.statusflag == StatusFlagConstant.FLAG_DONE) {
			statusInStr = StatusFlagConstant.FLAG_DONE_IN_STRING;
		}
		return statusInStr;

	}

}