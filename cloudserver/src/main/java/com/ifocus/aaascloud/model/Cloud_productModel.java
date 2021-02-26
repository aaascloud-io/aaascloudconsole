package com.ifocus.aaascloud.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Cloud_productModel {

	private LoginInfo loginInfo;
	private TargetUserInfo targetUserInfo;

	private Integer productid;
	private Integer producttypeid;
	private String productcode;
	private String productname;
	private String model;
	private String version;
	private Integer simflag;
	private String summary;
	private Integer alive;
	// 一括削除用リスト
	private List<Integer> productidlist;
}
