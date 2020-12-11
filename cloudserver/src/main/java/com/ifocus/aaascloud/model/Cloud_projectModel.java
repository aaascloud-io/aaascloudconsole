package com.ifocus.aaascloud.model;

import lombok.Getter;
import lombok.Setter;

public class Cloud_projectModel {

	@Getter
	@Setter
	private LoginInfo loginInfo;
	@Getter
	@Setter
	private TargetUserInfo targetUserInfo;
	@Getter
	@Setter
	private Integer projectid;
	@Getter
	@Setter
	private Integer userid;
	@Getter
	@Setter
	private String projectname;
	@Getter
	@Setter
	private Integer productid;
	@Getter
	@Setter
	private String productname;
	@Getter
	@Setter
	private String projectsummary;
	@Getter
	@Setter
	private Integer alive;
	@Getter
	@Setter
	private Integer groupCounts;
	@Getter
	@Setter
	private Integer deviceCounts;

}
