package com.ifocus.aaascloud.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Cloud_versionModel {

	private LoginInfo loginInfo;
	private TargetUserInfo targetUserInfo;
	private Integer rowid;
	private Integer productid;
	private String versioncode;
	private String versionname;
	private String downloadurl;
	private String description;
	private Integer alive;

	// 一括削除用
	private List<Integer> rowidlist;

}