package com.ifocus.aaascloud.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserModel {

	private String uid;

	private String username;

	protected String firstname;

	protected String lastname;

	private String email;

	private String companyname;

	public UserModel(String uid, String username, String firstName, String lastName, String email) {
		this.uid = uid;
		this.username = username;
		this.firstname = firstName;
		this.lastname = lastName;
		this.email = email;
	}
}
