package com.ifocus.aaascloud.model;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class Cloud_groupModel {

	@Getter
	@Setter
	private LoginInfo loginInfo;
	@Getter
	@Setter
	private TargetUserInfo targetUserInfo;
	@Getter
	@Setter
	private Integer groupid;
	@Getter
	@Setter
	private Integer projectid;
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
	@Getter
	@Setter
	private List<Cloud_deviceModel> deviceList;
	/**
	 *  deviceidリスト
	 */
	public List<Integer> getDeviceIdList() {
		List<Integer> returnDeviceIdList = new ArrayList();
		this.getDeviceList().forEach(model->{
			returnDeviceIdList.add(model.getDeviceid());
		});
		return returnDeviceIdList;
	}
}
