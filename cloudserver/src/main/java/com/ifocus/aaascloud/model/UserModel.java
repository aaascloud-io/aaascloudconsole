package com.ifocus.aaascloud.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserModel {

	private String uid;

	private String username;

	private String firstName;

	private String lastName;

	public UserModel(String uid, String username, String firstName, String lastName) {
		this.uid = uid;
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
	}
}
