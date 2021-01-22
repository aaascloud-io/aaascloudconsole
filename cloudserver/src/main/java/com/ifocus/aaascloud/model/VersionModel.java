package com.ifocus.aaascloud.model;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class VersionModel {
	@Getter
	@Setter
	private Cloud_productModel product;

	public List<Cloud_versionModel> versionList;

	public VersionModel(Cloud_productModel product) {
		this.versionList = new ArrayList<Cloud_versionModel>();
		this.product = product;
	}

}
