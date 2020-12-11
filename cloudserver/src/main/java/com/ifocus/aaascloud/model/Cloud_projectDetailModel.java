package com.ifocus.aaascloud.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class Cloud_projectDetailModel {

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
	@Getter
	@Setter
	private List<Cloud_groupModel> groupList;
	@Getter
	@Setter
	private List<Cloud_deviceModel> deviceList;

}
