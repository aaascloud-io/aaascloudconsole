package com.ifocus.aaascloud.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class KeyCloakUserService {

	private Map<String, String> userIdNameMap = new HashMap<String, String>();

	public static KeyCloakUserService INSTANCE = new KeyCloakUserService();
	private KeyCloakUserService() {
		init();
	}

	private void init() {
		// fetch all users
		List<org.keycloak.representations.idm.UserRepresentation> userReps = KeyCloakAdminClient.INSTANCE.getUserRepresentations();
		// init map
		for (org.keycloak.representations.idm.UserRepresentation userRep : userReps) {
			userIdNameMap.put(userRep.getUsername(), userRep.getId());
		}
	}

	/*
	 * UID取得
	 * @param username String ユーザー名（CloudのログインID）
	 * @return String UID
	 */
	public String getUidFromUsername(String username) {
		return userIdNameMap.get(username);
	}

	/*
	 * 有効ユーザ名称をチェック
	 * @param username String ユーザー名（CloudのログインID）
	 * @return boolean
	 *         true = 有効
	 *         false = 無効
	 *
	 */
	public boolean isValidUsername(String username) {
		boolean  flag = false;
		// fetch all users
		List<org.keycloak.representations.idm.UserRepresentation> userReps = KeyCloakAdminClient.INSTANCE.getUserRepresentations();

		for (org.keycloak.representations.idm.UserRepresentation userRep:userReps) {
			if (userRep.getUsername() == username) {
				// 有効
				flag = true;
				break;
			}
		}
		return flag;
	}

}