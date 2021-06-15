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
	private String firstname;
	private String lastname;
	private String fullname;
	private String email;
	private String loginid;
	private String password;
	private Integer role;
	private Integer upperuserid;
	private Integer alive;
	private Integer deleteflag;
	private Integer i_uid;
	private Timestamp i_time;
	private Integer u_uid;
	private Timestamp u_time;

	// 会社情報
	private String corporatenumber;
	private String companyName;
	private String address;
	private String industry;
	private String mail;
	private String tel;
	private String fax;
	private Integer level;
	// デバイス数
	private Integer devicecount;
	// ユーザ数
	private Integer userSize;
	private Cloud_userModel parent;


	// 配下ユーザ数
	private Integer userCount;

	// 配下ユーザ数(削除以外)
	private Integer notDelUserCount;

	// 配下プロジェクト数
	private Integer projectCount;


	/*
	 * companyname情報検索条件取得
	 *
	 */
	public String getCompanynameForSearch() {

		if (this.companyName == null || this.companyName.isEmpty()) {
			return CommonConstant.DEFAULT_MATCH_ALL;
		} else {
			return "%" + this.companyName.trim() + "%";
		}
	}

	/*
	 * firstName情報検索条件取得
	 *
	 */
	public String getFirstNameForSearch() {

		if (this.firstname == null || this.firstname.isEmpty()) {
			return CommonConstant.DEFAULT_MATCH_ALL;
		} else {
			return "%" + this.firstname.trim() + "%";
		}
	}

	/*
	 * lastName情報検索条件取得
	 *
	 */
	public String getLastNameForSearch() {

		if (this.lastname == null || this.lastname.isEmpty()) {
			return CommonConstant.DEFAULT_MATCH_ALL;
		} else {
			return "%" + this.lastname.trim() + "%";
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