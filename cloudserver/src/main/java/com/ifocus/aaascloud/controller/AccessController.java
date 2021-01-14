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
import com.ifocus.aaascloud.entity.Cloud_userRepository;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.service.AccessService;
import com.ifocus.aaascloud.util.Util;

import net.sf.json.JSONObject;

@Controller
public class AccessController {

	@Autowired
	private AccessService accessService;
	@Autowired
	private Cloud_userRepository cloud_userRepository;

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

		JSONObject resJasonObj = new JSONObject();

		// ユーザID必須判定
		if (null != cloud_userModel.getUsername()) {

			try {
				// ログインユーザ取得
				Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername(cloud_userModel.getUsername());

				// アクセス権限ユーザ一覧を取得する
				List<Integer> list = accessService.getAccessUsers(loginUserEntity.getUserid());

				// ユーザID情報設定
				resJasonObj.put("accessableUserIdList", this.getJsonListFromUseridList(list));

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
			response.setResultMsg(ErrorConstant.ERROR_MSG_0001 + "useridが必須です。");
			return response;
		}

		response.setStatus(200);
		response.setResultCode(ErrorConstant.ERROR_CODE_0000);
		response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
		response.setData(resJasonObj.toString());
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

		Util util = new Util();
		JSONObject resJasonObj = new JSONObject();

		// ユーザID必須判定
		if (null != cloud_userModel.getUsername()) {

			try {
				// ログインユーザ取得
				Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername(cloud_userModel.getUsername());

				// アクセス権限ユーザ一覧を取得する
				List<Cloud_userModel> list = accessService.getAccessModelUsers(loginUserEntity.getUserid());

				// ユーザID情報設定
				resJasonObj.put("UIDList", util.getUIDJsonList(list));

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

		response.setStatus(200);
		response.setResultCode(ErrorConstant.ERROR_CODE_0000);
		response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
		response.setData(resJasonObj.toString());
		return response;
	}

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

}