package com.ifocus.aaascloud.model;

import java.util.List;

import com.ifocus.aaascloud.constant.CommonConstant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Cloud_versionModel {

	private LoginInfo loginInfo;
	private TargetUserInfo targetUserInfo;
	private Integer rowid;
	private Integer productid;
	private String productname;
	private String versioncode;
	private String versionname;
	private String downloadurl;
	private String description;
	private Integer alive;

	// 一括削除用
	private List<Integer> rowidlist;

	/*
	 * productname情報検索条件取得
	 *
	 */
	public String getProductnameForSearch() {

		if (this.productname == null) {
			return CommonConstant.DEFAULT_MATCH_ALL;
		} else {
			return "%" + this.productname.trim() + "%";
		}
	}

	/*
	 * versionname情報検索条件取得
	 *
	 */
	public String getVersionnameForSearch() {

		if (this.versionname == null) {
			return CommonConstant.DEFAULT_MATCH_ALL;
		} else {
			return "%" + this.versionname.trim() + "%";
		}
	}
}