package com.ifocus.aaascloud.util;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.ifocus.aaascloud.model.AccessUserModel;
import com.ifocus.aaascloud.model.Cloud_deviceModel;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.model.UserModel;

@Component
public class Util {
	
	@Autowired
	private static KeyCloakUserService keyCloakUserService;
	
	public static int size(Iterable<?> data) {

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
	 * ユーザープロファイル取得
	 * @param model Cloud_userModel ユーザモデル
	 * @return UserModel UserModel
	 */
	public static UserModel getUserModel(Cloud_userModel model) {

		// KeyCloakサービスを呼び出し
		// ユーザ情報取得
		UserModel userModel = keyCloakUserService.getUserModelFromUsername(model.getUsername());

		return userModel;
	}

	/**
	 * リストから配列作成
	 * @param userList List<Cloud_userModel> ユーザのリスト
	 * @return AccessUserModel ユーザIDの配列
	 */
	public static AccessUserModel getAccessUserModel(List<Cloud_userModel> userList) {

		// KeyCloakサービスを呼び出し
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

	/**
	 * モデルからIMEI取得
	 * @param deviceList List<Cloud_deviceModel> デバイスリスト
	 * @return List<String> デバイスのIMEIリスト
	 */
	public static List<String> getImeiList(List<Cloud_deviceModel> deviceList) {
		List<String> returnList = new ArrayList<String>();
		for (Cloud_deviceModel model:deviceList) {
			if (model.getImei() != null) {
				returnList.add(model.getImei().trim());
			}
		}
		return returnList;
	}

	/**
	 * モデルからICCID取得
	 * @param deviceList List<Cloud_deviceModel> デバイスリスト
	 * @return List<String> デバイスのICCIDリスト
	 */
	public static List<String> getIccidList(List<Cloud_deviceModel> deviceList) {
		List<String> returnList = new ArrayList<String>();
		for (Cloud_deviceModel model:deviceList) {
			if (model.getIccid() != null) {
				returnList.add(model.getIccid().trim());
			}
		}
		return returnList;
	}

	/**
	 * モデルからSN取得
	 * @param deviceList List<Cloud_deviceModel> デバイスリスト
	 * @return List<String> デバイスのSNリスト
	 */
	public static List<String> getSnList(List<Cloud_deviceModel> deviceList) {
		List<String> returnList = new ArrayList<String>();
		for (Cloud_deviceModel model:deviceList) {
			if (model.getSn() != null) {
				returnList.add(model.getSn().trim());
			}
		}
		return returnList;
	}

	/**
	 * モデルからSN取得
	 * @param src Object 任意のJavaオブジェクト
	 * @return String オブジェクトのJSON形式
	 */
	public static String getJsonString(Object src) {
		Gson gson  = new Gson ();
		return gson.toJson(src);

	}
}
