package com.ifocus.aaascloud.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DashboardModel {

	// ユーザ数を設定する
	private Integer userCount;

	// プロジェクト数を設定する
	private Integer projectCount;

	// プロダクト一覧を設定する
	private List<Cloud_productModel> productList;

	// プロダクト数を設定する
	private Integer productCount;

	// デバイス数（全部）を設定する
	private Integer deviceCount;

	// デバイス数（オンライン数）を設定する
	private Integer onlineDeviceCount;

	// ユーザ一覧を設定する
	private List<UserModel> userList;

	// エラーログ一覧を設定する
	private List<Cloud_errlogModel> errlogList;

	// エラーログ数を設定する
	private Integer errlogCount;
}
