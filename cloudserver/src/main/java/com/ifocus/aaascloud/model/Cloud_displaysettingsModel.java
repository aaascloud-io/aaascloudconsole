package com.ifocus.aaascloud.model;

import lombok.Getter;
import lombok.Setter;

public class Cloud_displaysettingsModel {

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
	private Integer companyid;
	@Getter
	@Setter
	private Integer displayorder;
	@Getter
	@Setter
	private String titleitemname;
	@Getter
	@Setter
	private String titledisplayname;
	@Getter
	@Setter
	private Integer alive;

}