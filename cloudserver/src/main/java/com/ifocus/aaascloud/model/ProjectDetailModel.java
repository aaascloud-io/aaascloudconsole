package com.ifocus.aaascloud.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectDetailModel {

	private Integer projectid;
	private Integer userid;
	private String projectname;
	private Integer productid;
	private String productname;
	private String projectsummary;
	private Integer groupCounts;
	private Integer deviceCounts;

	private List<Cloud_groupModel> groupList;
	private List<Cloud_deviceModel> deviceList;

}
