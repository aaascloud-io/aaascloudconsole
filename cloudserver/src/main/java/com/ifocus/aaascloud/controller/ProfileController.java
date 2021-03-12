package com.ifocus.aaascloud.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ifocus.aaascloud.api.common.BaseHttpResponse;
import com.ifocus.aaascloud.constant.ErrorConstant;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.model.UserModel;
import com.ifocus.aaascloud.service.Cloud_userService;
import com.ifocus.aaascloud.util.Util;

@Controller
public class ProfileController {

	@Autowired
	private Cloud_userService cloud_userService;

	/**
	 * プロファイルを取得する
	 * @param cloud_userModel Cloud_userModel
	 *         username
	 * @return BaseHttpResponse<String> JSON形式
	 * @throws Exception
	 */
	@RequestMapping(value = "/getUserProfile", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getUserProfile(@RequestBody Cloud_userModel cloud_userModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		// ユーザ名必須判定
		if (null != cloud_userModel.getUsername()) {

			try {
				// プロファイルを取得する
				UserModel model = Util.getUserModel(cloud_userModel);
				if (model != null ) {
					response.setCount(1);
				}

				// プロファイル情報設定
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
				response.setData(Util.getJsonString(model));

			} catch (Exception e) {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0006);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0006 + "getUserProfile:" + e.getMessage());
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

	/**
	 * プロファイルを変更する
	 * @param cloud_userModel Cloud_userModel
	 *         username
	 *         password
	 * @return BaseHttpResponse<String> JSON形式
	 * @throws Exception
	 */
	@RequestMapping(value = "/updateProfile", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> updateProfile(@RequestBody Cloud_userModel cloud_userModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		// ユーザ名必須判定
		if (null != cloud_userModel.getUsername()) {

			// 本人判定
			if (cloud_userModel.getUsername().equals(cloud_userModel.getLoginInfo().getLoginusername())) {

				try {
					// パスワードを変更する
					cloud_userService.changePassword(cloud_userModel.getUsername(), cloud_userModel.getPassword());

					// 正常終了
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0000);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0000);

				} catch (Exception e) {
					/* 異常系 */
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0006);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0006 + "cloud_userService.changePassword:" + e.getMessage());
					return response;
				}

			} else {
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0002);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0002 + "本人限定です。");

			}

		} else {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0001);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0001 + "usernameが必須です。");
			return response;
		}

		return response;
	}

}
