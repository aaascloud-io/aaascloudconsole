package com.ifocus.aaascloud.model;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.ifocus.aaascloud.constant.CommonConstant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Cloud_deviceModel {

	private LoginInfo loginInfo;
	private TargetUserInfo targetUserInfo;

	private Integer deviceid;
	private Integer projectid;
	private String projectname;
	private Integer groupid;
	private String groupname;
	private String devicename;
	private String imei;
	private String sn;
	private String sim_iccid;
	private String sim_imsi;
	private String sim_tel;
	private Integer encryptedcommunications;
	private String encryptedkey;
	private String connectserverurl;
	private String connectserverport;
	private Integer bindingflag;
	private String fmlastestversion;
	private Timestamp versioncomfirmtime;
	private Integer companyid;
	private String companyname;
	private Integer userid;
	private Integer lastprojectId;
	private Integer lastgroupid;
	private Integer alive;
	private Integer productid;
	private String productname;
	private String industry;

	private List<Integer> deviceidlist;	// デバイスIDのリスト
	private List<Cloud_deviceDetailModel> deviceDetailList;	// デバイス詳細のリスト
	@Getter
	@Setter
	private Cloud_deviceDetailModel deviceDetail;	// デバイス詳細

	// 検索条件

	/*
	 * imei情報検索条件取得
	 *
	 */
	public String getImeiForSearch() {

		if (this.imei == null) {
			return CommonConstant.DEFAULT_MATCH_ALL;
		} else {
			return "%" + this.imei.trim() + "%";
		}
	}

	/*
	 * productname情報検索条件取得
	 *
	 */
	public String getProductnameForSearch() {

		if (this.productname == null) {
			return CommonConstant.DEFAULT_MATCH_ALL;
		} else {
			return "%" + this.productname.trim() + "%";
		}
	}

	/*
	 * projectname情報検索条件取得
	 *
	 */
	public String getProjectnameForSearch() {

		if (this.projectname == null) {
			return CommonConstant.DEFAULT_MATCH_ALL;
		} else {
			return "%" + this.projectname.trim() + "%";
		}
	}

	/*
	 * industry情報検索条件取得
	 *
	 */
	public String getIndustryForSearch() {

		if (this.industry == null) {
			return CommonConstant.DEFAULT_MATCH_ALL;
		} else {
			return "%" + this.industry.trim() + "%";
		}
	}

	/*
	 * group情報検索条件取得
	 *
	 */
	public String getGroupForSearch() {

		if (this.groupname == null) {
			return CommonConstant.DEFAULT_MATCH_ALL;
		} else {
			return "%" + this.groupname.trim() + "%";
		}
	}

	/*
	 * add DeviceDetail To DeviceDetailList
	 *
	 */
	public void addDeviceDetailToDeviceDetailList() {

		if (this.deviceDetailList == null) {
			deviceDetailList = new ArrayList<Cloud_deviceDetailModel>();
		}
		deviceDetailList.add(this.getDeviceDetail());
	}

}
