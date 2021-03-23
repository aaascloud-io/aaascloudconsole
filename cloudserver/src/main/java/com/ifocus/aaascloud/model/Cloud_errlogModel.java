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
	private String statusInStr;	// 画面表示用項目
	private Timestamp datatime;
	private String systemsort;
	private String systemid;
	private String componentid;
	private String messageid;
	private String messagesort;
	private String errcode;
	private String errMessage;
	private Integer alive;
	private Integer deleteflag;
	private Integer i_uid;
	private Timestamp i_time;
	private Integer u_uid;
	private Timestamp u_time;

	// 画面表示用項目設定
	public void setStatusInStr() {
		if (this.statusflag == StatusFlagConstant.FLAG_NEW) {
			this.statusInStr = StatusFlagConstant.FLAG_NEW_IN_STRING;
		} else if (this.statusflag == StatusFlagConstant.FLAG_WIP) {
			this.statusInStr = StatusFlagConstant.FLAG_WIP_IN_STRING;
		} else if (this.statusflag == StatusFlagConstant.FLAG_DONE) {
			this.statusInStr = StatusFlagConstant.FLAG_DONE_IN_STRING;
		}
	}

}