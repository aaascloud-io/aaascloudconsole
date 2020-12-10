package com.ifocus.aaascloud.model;

import lombok.Getter;
import lombok.Setter;

public class Cloud_productModel {

	@Getter
	@Setter
	private LoginInfo loginInfo;
	@Getter
	@Setter
	private TargetUserInfo targetUserInfo;
	@Getter
	@Setter
	private Integer productid;
	@Getter
	@Setter
	private String productcode;
	@Getter
	@Setter
	private String productname;
	@Getter
	@Setter
	private String model;
	@Getter
	@Setter
	private String version;
	@Getter
	@Setter
	private Integer simflag;
	@Getter
	@Setter
	private String summary;
	@Getter
	@Setter
	private Integer alive;

}
