package com.ifocus.aaascloud.model;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Cloud_deviceDetailModel {

	private LoginInfo loginInfo;
	private TargetUserInfo targetUserInfo;

	private Integer productid;
	private String productcode;
	private String productname;
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
	private String industry;
	private Integer userid;
	private Integer lastprojectId;
	private Integer lastgroupid;
	private Integer alive;
	private Integer deleteflag;
}
