package com.ifocus.aaascloud.model;

import java.util.ArrayList;
import java.util.List;

import com.ifocus.aaascloud.constant.CommonConstant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Cloud_groupModel {

	private LoginInfo loginInfo;
	private TargetUserInfo targetUserInfo;

	private Integer groupid;
	private Integer projectid;
	private String projectname;
	private String groupname;
	private String summary;
	private Integer alive;
	private Integer groupDeviceCounts;
	private List<Cloud_deviceModel> deviceList;
	private List<Integer> groupidList = new ArrayList<Integer>();

	/**
	 *  deviceidリスト
	 */
	public List<Integer> getDeviceIdList() {
		List<Integer> returnDeviceIdList = new ArrayList<Integer>();
		this.getDeviceList().forEach(model->{
			returnDeviceIdList.add(model.getDeviceid());
		});
		return returnDeviceIdList;
	}

	/*
	 * projectname情報検索条件取得
	 *
	 */
	public String getProjectnameForSearch() {

		if (this.projectname == null || this.projectname.isEmpty()) {
			return CommonConstant.DEFAULT_MATCH_ALL;
		} else {
			return "%" + this.projectname.trim() + "%";
		}
	}

	/*
	 * groupname情報検索条件取得
	 *
	 */
	public String getGroupnameForSearch() {

		if (this.groupname == null || this.groupname.isEmpty()) {
			return CommonConstant.DEFAULT_MATCH_ALL;
		} else {
			return "%" + this.groupname.trim() + "%";
		}
	}

}
