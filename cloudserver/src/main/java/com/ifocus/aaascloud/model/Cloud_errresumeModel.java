package com.ifocus.aaascloud.model;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Cloud_errresumeModel {

	private LoginInfo loginInfo;
	private TargetUserInfo targetUserInfo;

	private Integer rowid;
	private Integer errlogid;
	private Integer statusflagbefore;
	private Integer statusflagafter;
	private String contents;
	private Integer alive;
	private Integer i_uid;
	private Timestamp i_time;

	// 対応完了フラグ（1=対応完了）
	private Integer doneFlag;
}