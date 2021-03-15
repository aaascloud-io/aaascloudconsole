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
import com.ifocus.aaascloud.service.Cloud_companyService;
import com.ifocus.aaascloud.service.Cloud_userService;

import net.sf.json.JSONObject;

@Controller
public class LogoutController {

	@Autowired
	private Cloud_userService cloud_userService;
	@Autowired
	private Cloud_companyService cloud_companyService;

	/**
	 * ログアウト
	 * @param cloud_userModel Cloud_userModel
	 *         loginId
	 *         password
	 * @return BaseHttpResponse<String> JSON形式
	 * @throws Exception
	 */
	@RequestMapping(value = "/logout", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> logout(@RequestBody Cloud_userModel cloud_userModel) throws Exception {

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

		JSONObject resJasonObj = new JSONObject();

		if (null != cloud_userModel.getUsername()) {

			try {

				// トークンクリア
				cloud_userService.clearToken(cloud_userModel.getLoginInfo().getLoginusername());
				resJasonObj.put("result", true);

			} catch (Exception e) {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0005);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0005 + "logout:" + e.getMessage());
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
}