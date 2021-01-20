package com.ifocus.aaascloud.model;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class AccessUserModel {

	public List<UserModel> userList;

	@Getter
	@Setter
	private SettingInfo settingInfo;

	public AccessUserModel(SettingInfo settingInfo) {
		this.userList = new ArrayList<UserModel>();
		this.settingInfo = settingInfo;
	}

	public AccessUserModel() {
		this.userList = new ArrayList<UserModel>();
	}
}
