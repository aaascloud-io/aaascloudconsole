package com.ifocus.aaascloud.model;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.ifocus.aaascloud.constant.CommonConstant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Cloud_userModel extends UserModel {

	public Cloud_userModel() {
		super(null, null, null, null, null);
	}

	public Cloud_userModel(String uid, String username, String firstName, String lastName, String email) {
		super(uid, username, firstName, lastName, email);
	}

	private LoginInfo loginInfo;
	private TargetUserInfo targetUserInfo;
	private List<Cloud_userModel> cloud_userModelList;

	private String access_token;
	// 管理者情報
	private Integer userid;
	private Integer companyid;
	private String username;
	private String firstName;
	private String lastName;
	private String fullName;
	private String email;
	private String loginid;
	private String password;
	private Integer role;
	private Integer upperuserid;
	private Integer alive;
	private Integer i_uid;
	private Timestamp i_time;
	private Integer u_uid;
	private Timestamp u_time;

	// 会社情報
	private String corporatenumber;
	private String companyname;
	private String address;
	private String industry;
	private String mail;
	private String tel;
	private String fax;
	private Integer level;
	// デバイス数
	private Integer devicecount;
	// ユーザ数
	private Integer usercount;
	private Cloud_userModel parent;

	/*
	 * companyname情報検索条件取得
	 *
	 */
	public String getCompanynameForSearch() {

		if (this.companyname == null || this.companyname.isEmpty()) {
			return CommonConstant.DEFAULT_MATCH_ALL;
		} else {
			return "%" + this.companyname.trim() + "%";
		}
	}

	/*
	 * firstName情報検索条件取得
	 *
	 */
	public String getFirstNameForSearch() {

		if (this.firstName == null || this.firstName.isEmpty()) {
			return CommonConstant.DEFAULT_MATCH_ALL;
		} else {
			return "%" + this.firstName.trim() + "%";
		}
	}

	/*
	 * lastName情報検索条件取得
	 *
	 */
	public String getLastNameForSearch() {

		if (this.lastName == null || this.lastName.isEmpty()) {
			return CommonConstant.DEFAULT_MATCH_ALL;
		} else {
			return "%" + this.lastName.trim() + "%";
		}
	}

	/*
	 * email情報検索条件取得
	 *
	 */
	public String getEmailForSearch() {

		if (this.email == null || this.email.isEmpty()) {
			return CommonConstant.DEFAULT_MATCH_ALL;
		} else {
			return "%" + this.email.trim() + "%";
		}
	}

	public void addToCloud_userModelList(Cloud_userModel model) {
		if (this.cloud_userModelList == null) {
			cloud_userModelList = new ArrayList<Cloud_userModel>();
		}
		this.cloud_userModelList.add(model);
	}
}