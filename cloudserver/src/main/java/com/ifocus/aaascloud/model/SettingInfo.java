package com.ifocus.aaascloud.model;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class SettingInfo {

	@Getter
	@Setter
	private String corporateNumber;

	public List<DisplayItem> displayInfo;

	public SettingInfo(String corporateNumber) {
		this.displayInfo = new ArrayList<DisplayItem>();
		this.corporateNumber = corporateNumber;
	}
}
