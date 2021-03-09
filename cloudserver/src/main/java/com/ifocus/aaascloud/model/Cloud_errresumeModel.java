package com.ifocus.aaascloud.model;

import java.sql.Timestamp;

import com.ifocus.aaascloud.constant.StatusFlagConstant;

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
	private String statusflagbeforeInStr;	// 画面表示用項目(前)
	private String statusflagafterInStr;	// 画面表示用項目(後)
	private String contents;
	private Integer alive;
	private Integer i_uid;
	private Timestamp i_time;

	// 対応完了フラグ（1=対応完了）
	private Integer doneFlag;

	// 画面表示用項目設定
	public void setStatusInStr() {
		// 画面表示用項目設定(前)
		setStatusflagbeforeInStr();
		// 画面表示用項目設定(後)
		setStatusflagafterInStr();
	}

	// 画面表示用項目設定(前)
	private void setStatusflagbeforeInStr() {
		if (this.statusflagbefore == StatusFlagConstant.FLAG_NEW) {
			this.statusflagbeforeInStr = StatusFlagConstant.FLAG_NEW_IN_STRING;
		} else if (this.statusflagbefore == StatusFlagConstant.FLAG_WIP) {
			this.statusflagbeforeInStr = StatusFlagConstant.FLAG_WIP_IN_STRING;
		} else if (this.statusflagbefore == StatusFlagConstant.FLAG_DONE) {
			this.statusflagbeforeInStr = StatusFlagConstant.FLAG_DONE_IN_STRING;
		}
	}

	// 画面表示用項目設定(後)
	private void setStatusflagafterInStr() {
		if (this.statusflagafter == StatusFlagConstant.FLAG_NEW) {
			this.statusflagafterInStr = StatusFlagConstant.FLAG_NEW_IN_STRING;
		} else if (this.statusflagafter == StatusFlagConstant.FLAG_WIP) {
			this.statusflagafterInStr = StatusFlagConstant.FLAG_WIP_IN_STRING;
		} else if (this.statusflagafter == StatusFlagConstant.FLAG_DONE) {
			this.statusflagafterInStr = StatusFlagConstant.FLAG_DONE_IN_STRING;
		}
	}

}