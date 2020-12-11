package com.ifocus.aaascloud.model;

import lombok.Getter;
import lombok.Setter;

public class Cloud_groupModel {

	@Getter
	@Setter
	private Integer groupid;
	@Getter
	@Setter
	private String projectid;
	@Getter
	@Setter
	private String groupname;
	@Getter
	@Setter
	private String summary;
	@Getter
	@Setter
	private Integer alive;
	@Getter
	@Setter
	private Integer groupDeviceCounts;
}
