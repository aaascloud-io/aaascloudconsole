package com.ifocus.aaascloud.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ifocus.aaascloud.util.KeyCloakAdminClient;

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



}
