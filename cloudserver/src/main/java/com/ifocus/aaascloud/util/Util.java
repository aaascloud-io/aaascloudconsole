package com.ifocus.aaascloud.util;

import java.util.Collection;
import java.util.List;

import com.ifocus.aaascloud.model.AccessUserModel;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.model.UserModel;

public class Util {

	public static int size(Iterable data) {

	    if (data instanceof Collection) {
	        return ((Collection<?>) data).size();
	    }
	    int counter = 0;
	    for (Object i : data) {
	        counter++;
	    }
	    return counter;
	}

//	/**
//	 * リストから配列作成
//	 * @param useridList List<Cloud_userModel> ユーザのリスト
//	 * @return String ユーザIDの配列
//	 */
//	public String getUIDJsonList(List<Cloud_userModel> userList) {
//
//		// KeyCloakサービスを呼び出し
//		KeyCloakUserService keyCloakUserService = KeyCloakUserService.INSTANCE;
//
//		String returnStr = new String();
//		returnStr = returnStr + "[";
//
//		for (Cloud_userModel model:userList) {
//			if (returnStr.length() > 1) {
//				returnStr = returnStr + ",";
//			}
//			// ユーザUID設定
//			returnStr = returnStr + keyCloakUserService.getUidFromUsername(model.getUsername());
//		}
//
//		returnStr = returnStr + "]";
//
//		return returnStr;
//	}

	/**
	 * リストから配列作成
	 * @param userList List<Cloud_userModel> ユーザのリスト
	 * @return AccessUserModel ユーザIDの配列
	 */
	public AccessUserModel getAccessUserModel(List<Cloud_userModel> userList) {

		// KeyCloakサービスを呼び出し
		KeyCloakUserService keyCloakUserService = KeyCloakUserService.INSTANCE;

		AccessUserModel accessUserModel = new AccessUserModel();

		for (Cloud_userModel model:userList) {
			// ユーザ情報設定
			UserModel userModel = keyCloakUserService.getUserModelFromUsername(model.getUsername());
			if (userModel != null) {
				accessUserModel.userList.add(userModel);
			}
		}

		return accessUserModel;
	}

}
