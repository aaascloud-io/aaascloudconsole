package com.ifocus.aaascloud.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReturnModel {

	public ReturnModel(String key, String value) {
		this.key = key;
		this.value = value;
	}

	String key;
	String value;

}
