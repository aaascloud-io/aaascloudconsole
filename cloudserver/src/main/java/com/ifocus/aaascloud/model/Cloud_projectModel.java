package com.ifocus.aaascloud.model;

import java.util.List;

import com.ifocus.aaascloud.constant.CommonConstant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Cloud_projectModel {

	private LoginInfo loginInfo;
	private TargetUserInfo targetUserInfo;

	private Integer projectid;
	private Integer userid;
	private String projectname;
	private Integer productid;
	private String productname;
	private String projectsummary;
	private Integer alive;
	private Integer groupCounts;
	private Integer deviceCounts;

	// 一括削除用
	private List<Cloud_projectModel> projectlist;

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

}
