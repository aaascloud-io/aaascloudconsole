package com.ifocus.aaascloud.model;

import java.util.List;

import com.ifocus.aaascloud.constant.CommonConstant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Cloud_productModel {

	private LoginInfo loginInfo;
	private TargetUserInfo targetUserInfo;

	private Integer productid;
	private Integer producttypeid;
	private String producttypename;
	private String productcode;
	private String productname;
	private String model;
	private String version;
	private Integer simflag;
	private String summary;
	private Integer createuserid;
	private String createusername;
	private String lastname;
	private String firstname;
	private Integer alive;
	// 一括削除用リスト
	private List<Integer> productidlist;

	// 検索条件

	/*
	 * producttypename情報検索条件取得
	 *
	 */
	public String getProducttypenameForSearch() {

		if (this.producttypename == null) {
			return CommonConstant.DEFAULT_MATCH_ALL;
		} else {
			return "%" + this.producttypename.trim() + "%";
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
	 * createusername情報検索条件取得
	 *
	 */
	public String getCreateusernameForSearch() {

		if (this.createusername == null) {
			return CommonConstant.DEFAULT_MATCH_ALL;
		} else {
			return "%" + this.createusername.trim() + "%";
		}
	}

}
