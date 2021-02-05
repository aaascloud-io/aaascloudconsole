package com.ifocus.aaascloud.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccessModel {

	// アクセス権限ユーザ一覧
	private List<Integer> accessableUserIdList;
}
