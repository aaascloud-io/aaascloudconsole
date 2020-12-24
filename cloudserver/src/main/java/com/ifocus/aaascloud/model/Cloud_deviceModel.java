package com.ifocus.aaascloud.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class Cloud_deviceModel {

	@Getter
	@Setter
	private LoginInfo loginInfo;
	@Getter
	@Setter
	private TargetUserInfo targetUserInfo;
	@Getter
	@Setter
	private Integer deviceid;
	@Getter
	@Setter
	private Integer projectid;
	@Getter
	@Setter
	private String projectname;
	@Getter
	@Setter
	private Integer groupid;
	@Getter
	@Setter
	private String groupname;
	@Getter
	@Setter
	private String devicename;
	@Getter
	@Setter
	private String imei;
	@Getter
	@Setter
	private String iccid;
	@Getter
	@Setter
	private String sn;
	@Getter
	@Setter
	private String sim_iccid;
	@Getter
	@Setter
	private String sim_imei;
	@Getter
	@Setter
	private String sim_tel;
	@Getter
	@Setter
	private Integer companyid;
	@Getter
	@Setter
	private Integer userid;
	@Getter
	@Setter
	private Integer lastprojectId;
	@Getter
	@Setter
	private Integer lastgroupid;
	@Getter
	@Setter
	private Integer alive;
	@Getter
	@Setter
	private String productid;
	@Getter
	@Setter
	private String productname;
	@Getter
	@Setter
	private String industry;
	@Getter
	@Setter
	private List<Integer> deviceidlist;	// デバイスIDのリスト
	@Getter
	@Setter
	private List<Cloud_deviceDetailModel> deviceDetailList;	// デバイス詳細のリスト

	// 検索条件

	/*
	 * imei情報検索条件取得
	 *
	 */
	public String getImeiForSearch() {

		if (this.imei == null) {
			return "'%%'";
		} else {
			return "'%" + this.imei.trim() + "%'";
		}
	}

	/*
	 * productname情報検索条件取得
	 *
	 */
	public String getProductnameForSearch() {

		if (this.productname == null) {
			return "'%%'";
		} else {
			return "'%" + this.productname.trim() + "%'";
		}
	}

	/*
	 * projectname情報検索条件取得
	 *
	 */
	public String getProjectnameForSearch() {

		if (this.projectname == null) {
			return "'%%'";
		} else {
			return "'%" + this.projectname.trim() + "%'";
		}
	}

	/*
	 * industry情報検索条件取得
	 *
	 */
	public String getIndustryForSearch() {

		if (this.industry == null) {
			return "'%%'";
		} else {
			return "'%" + this.industry.trim() + "%'";
		}
	}

}
