package com.ifocus.aaascloud.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ifocus.aaascloud.api.common.BaseHttpResponse;
import com.ifocus.aaascloud.constant.ErrorConstant;
import com.ifocus.aaascloud.entity.Cloud_userEntity;
import com.ifocus.aaascloud.repository.Cloud_userRepository;
import com.ifocus.aaascloud.model.AccessModel;
import com.ifocus.aaascloud.model.AccessUserModel;
import com.ifocus.aaascloud.model.Cloud_displaysettingsModel;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.model.DisplayItem;
import com.ifocus.aaascloud.model.SettingInfo;
import com.ifocus.aaascloud.service.AccessService;
import com.ifocus.aaascloud.service.Cloud_userService;
import com.ifocus.aaascloud.util.Util;

@Controller
public class AccessController {

	@Autowired
	private Cloud_userRepository cloud_userRepository;

	@Autowired
	private AccessService accessService;
	@Autowired
	private Cloud_userService cloud_userService;

	/**
	 * アクセス権限ユーザ一覧を取得する
	 * @param cloud_userModel Cloud_userModel
	 *         userid
	 * @return BaseHttpResponse<String> JSON形式
	 * @throws Exception
	 */
	@RequestMapping(value = "/getAccessUsers", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getAccessUsers(@RequestBody Cloud_userModel cloud_userModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// トークン認証
			if (!cloud_userService.checkToken(cloud_userModel.getLoginInfo())) {
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0300);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0300);
				return response;
			}

		} catch( Exception e) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0300);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0300 + e.getMessage());
			return response;
		}

		AccessModel accessModel = new AccessModel();

		// ユーザID必須判定
		if (null != cloud_userModel.getUsername()) {

			try {
				// ログインユーザ取得
				Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername(cloud_userModel.getUsername());

				// アクセス権限ユーザ一覧を取得する
				List<Integer> list = accessService.getAccessUsers(loginUserEntity.getUserid());

				// ユーザID情報設定
				accessModel.setAccessableUserIdList(list);

			} catch (Exception e) {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0006);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0006 + "getAccessUsers:" + e.getMessage());
				return response;
			}

		} else {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0001);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0001 + "usernameが必須です。");
			return response;
		}

		response.setStatus(200);
		response.setResultCode(ErrorConstant.ERROR_CODE_0000);
		response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
		response.setData(Util.getJsonString(accessModel));
		return response;
	}

	/**
	 * アクセス権限ユーザ一覧を取得する(trackun用)
	 * @param cloud_userModel Cloud_userModel
	 *         userid
	 * @return BaseHttpResponse<String> JSON形式
	 * @throws Exception
	 */
	@RequestMapping(value = "/getAccessUsersForTrackun", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getAccessUsersForTrackun(@RequestBody Cloud_userModel cloud_userModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// トークン認証
			if (!cloud_userService.checkToken(cloud_userModel.getLoginInfo())) {
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0300);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0300);
				return response;
			}

		} catch( Exception e) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0300);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0300 + e.getMessage());
			return response;
		}

		// ユーザID必須判定
		if (null != cloud_userModel.getUsername()) {

			try {
				// ログインユーザ取得
				Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername(cloud_userModel.getUsername());

				// アクセス権限ユーザ一覧を取得する
				List<Cloud_userModel> list = accessService.getAccessModelUsers(loginUserEntity.getUserid());

				// ユーザ情報設定
				AccessUserModel accessUserModel = Util.getAccessUserModel(list);

				// 代理店情報を取得する
				Cloud_userModel agencyCompany = accessService.getAgencyCompany(loginUserEntity.getUserid());

				// 画面表示項目情報を取得する
				List<Cloud_displaysettingsModel> modelList = accessService.getCompanyDisplayInfo(agencyCompany.getCompanyid());

				// 画面表示項目情報設定
				accessUserModel.setSettingInfo(getSettingInfo(agencyCompany,modelList));

				/* 正常終了 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
//				response.setData(gson.toJson(accessUserModel));
				response.setData(Util.getJsonString(accessUserModel));

			} catch (Exception e) {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0006);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0006 + "getAccessUsersForTrackun:" + e.getMessage());
				return response;
			}

		} else {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0001);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0001 + "usernameが必須です。");
			return response;
		}

		return response;
	}

//	/**
//	 * 所属代理店を取得する(trackun用)
//	 * @param cloud_userModel Cloud_userModel
//	 *         userid
//	 * @return BaseHttpResponse<String> JSON形式
//	 * @throws Exception
//	 */
//	@RequestMapping(value = "/getAgencyCompanyForTrackun", method = RequestMethod.POST)
//	@ResponseBody
//	@CrossOrigin(origins = "*", maxAge = 3600)
//	public BaseHttpResponse<String> getAgencyCompanyForTrackun(@RequestBody Cloud_userModel cloud_userModel) throws Exception {
//
//		BaseHttpResponse<String> response = new BaseHttpResponse<String>();
//
//		Util util = new Util();
//		JSONObject resJasonObj = new JSONObject();
//
//		// ユーザ名必須判定
//		if (null != cloud_userModel.getUsername()) {
//
//			try {
//				// ログインユーザ取得
//				Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername(cloud_userModel.getUsername());
//
//				// アクセス権限ユーザ一覧を取得する
//				Cloud_userModel agencyCompany = accessService.getAgencyCompany(loginUserEntity.getUserid());
//
//				// ユーザID情報設定
//				resJasonObj.put("corporatenumber", agencyCompany.getCorporatenumber());
//
//			} catch (Exception e) {
//				/* 異常系 */
//				response.setStatus(200);
//				response.setResultCode(ErrorConstant.ERROR_CODE_0009);
//				response.setResultMsg(ErrorConstant.ERROR_MSG_0009 + "getAgencyCompanyForTrackun:" + e.getMessage());
//				return response;
//			}
//
//		} else {
//			response.setStatus(200);
//			response.setResultCode(ErrorConstant.ERROR_CODE_0001);
//			response.setResultMsg(ErrorConstant.ERROR_MSG_0001 + "usernameが必須です。");
//			return response;
//		}
//
//		response.setStatus(200);
//		response.setResultCode(ErrorConstant.ERROR_CODE_0000);
//		response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
//		response.setData(resJasonObj.toString());
//		return response;
//	}

	/**
	 * リストから配列作成
	 * @param useridList List<Integer> ユーザIDのリスト
	 * @return String ユーザIDの配列
	 */
	private String getJsonListFromUseridList(List<Integer> useridList) {

		String returnStr = new String();
		returnStr = returnStr + "[";

		for (Integer userid:useridList) {
			if (returnStr.length() > 1) {
				returnStr = returnStr + ",";
			}
			// ユーザID設定
			returnStr = returnStr + userid;
		}

		returnStr = returnStr + "]";

		return returnStr;
	}
	/**
	 * リストから配列作成
	 * @param useridList List<Cloud_userModel> ユーザのリスト
	 * @return String ユーザIDの配列
	 */
	private String getUIDJsonListFromUseridList(List<Cloud_userModel> userList) {

		String returnStr = new String();
		returnStr = returnStr + "[";

		for (Cloud_userModel model:userList) {
			if (returnStr.length() > 1) {
				returnStr = returnStr + ",";
			}
			// ユーザID設定
			returnStr = returnStr + model.getLoginid();
		}

		returnStr = returnStr + "]";

		return returnStr;
	}

//	/**
//	 * 画面表示項目情報設定JSON作成
//	 * @param userModel Cloud_userModel 代理店情報モデル
//	 * @param modelList List<Cloud_displaysettingsModel> 画面表示項目情報のリスト
//	 * @return String 画面表示項目情報設定JSON
//	 */
//	private String getSettingInfoJsonList(Cloud_userModel userModel, List<Cloud_displaysettingsModel> modelList) {
//
//		String returnStr = new String();
//		returnStr = returnStr + "{";
//
//		// 代理店情報
//		returnStr = returnStr + "corporateNumber" + ":" + userModel.getCorporatenumber();
//		returnStr = returnStr + ",";
//
//		// 画面表示項目情報
//		returnStr = returnStr + "displayInfo" + ":" + "{";				// Start of displayInfo
//
//		String strSettingInfo = new String();
//		for (Cloud_displaysettingsModel model:modelList) {
//			if (strSettingInfo.length() > 1) {
//				strSettingInfo = strSettingInfo + ",";
//			}
//			// 項目英語名設定
//			strSettingInfo = strSettingInfo + model.getTitleitemname() + ":" + "{";		// Start of Item
//			// 表示順設定
//			strSettingInfo = strSettingInfo + "displayOrder" + ":" + model.getDisplayorder();
//			strSettingInfo = strSettingInfo + ",";
//			// 画面表示名設定
//			strSettingInfo = strSettingInfo + "title" + ":" + model.getTitledisplayname();
//			strSettingInfo = strSettingInfo + "}";										// End of Item
//		}
//		returnStr = returnStr + strSettingInfo;
//		returnStr = returnStr + "}";									// End of displayInfo
//
//		returnStr = returnStr + "}";
//
//		return returnStr;
//	}

	/**
	 * 画面表示項目情報設定JSON作成
	 * @param userModel Cloud_userModel 代理店情報モデル
	 * @param modelList List<Cloud_displaysettingsModel> 画面表示項目情報のリスト
	 * @return String 画面表示項目情報設定JSON
	 */
	private SettingInfo getSettingInfo(Cloud_userModel userModel, List<Cloud_displaysettingsModel> modelList) {

		// 代理店情報
		SettingInfo settingInfo = new SettingInfo(userModel.getCorporatenumber());

		// 画面表示項目情報
		String strSettingInfo = new String();
		for (Cloud_displaysettingsModel model:modelList) {
			settingInfo.displayInfo.add(new DisplayItem(model.getDisplayorder(), model.getTitleitemname(),model.getTitledisplayname()));
		}

		return settingInfo;
	}
}