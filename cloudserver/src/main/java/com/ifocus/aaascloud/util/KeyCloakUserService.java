package com.ifocus.aaascloud.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ifocus.aaascloud.model.UserModel;

@Component
public class KeyCloakUserService {
	
	@Autowired
	private KeyCloakAdminClient keyCloakAdminClient;

	private Map<String, UserModel> userIdNameMap = new HashMap<String, UserModel>();

	@PostConstruct
	private void init() {
		// fetch all users
		List<org.keycloak.representations.idm.UserRepresentation> userReps = keyCloakAdminClient.getUserRepresentations();
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
		if (!StringUtils.isEmpty(username)) {
			// fetch all users
			List<org.keycloak.representations.idm.UserRepresentation> userReps = keyCloakAdminClient.getUserRepresentations();

			for (org.keycloak.representations.idm.UserRepresentation userRep:userReps) {
				if (username.equals(userRep.getUsername())) {
					// 有効
					flag = true;
					break;
				}
			}
		}
		return flag;
	}

}
