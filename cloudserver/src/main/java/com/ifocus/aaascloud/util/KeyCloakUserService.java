package com.ifocus.aaascloud.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ifocus.aaascloud.model.UserModel;

public class KeyCloakUserService {

	private Map<String, UserModel> userIdNameMap = new HashMap<String, UserModel>();

	public static KeyCloakUserService INSTANCE = new KeyCloakUserService();
	private KeyCloakUserService() {
		init();
	}

	private void init() {
		// fetch all users
		List<org.keycloak.representations.idm.UserRepresentation> userReps = KeyCloakAdminClient.INSTANCE.getUserRepresentations();
		// init map
		for (org.keycloak.representations.idm.UserRepresentation userRep : userReps) {
			UserModel userModel = new UserModel(userRep.getId(),userRep.getUsername(),userRep.getFirstName(),userRep.getLastName(),userRep.getEmail());
			userIdNameMap.put(userRep.getUsername(), userModel);
		}
	}

	/*
	 * UserModel取得
	 * @param username String ユーザー名（CloudのログインID）
	 * @return UserModel ユーザー情報
	 */
	public UserModel getUserModelFromUsername(String username) {
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
