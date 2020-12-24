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
import com.ifocus.aaascloud.service.Cloud_userService;

import net.sf.json.JSONObject;

@Controller
public class LoginController {

	@Autowired
	private Cloud_userService cloud_userService;
//	@Autowired
//	private Cloud_companyService cloud_companyService;

	/**
	 * ログイン認証
	 * @param cloud_userModel Cloud_userModel
	 *         loginId
	 *         password
	 * @return BaseHttpResponse<String> JSON形式
	 * @throws Exception
	 */
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> login(@RequestBody Cloud_userModel cloud_userModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		JSONObject resJasonObj = new JSONObject();

		String loginId = cloud_userModel.getLoginid();
		String password = cloud_userModel.getPassword();

		if (null != loginId && null != password) {

			try {
				// ログイン認証
				Cloud_userModel model = cloud_userService.login(loginId, password);

				if (model.getUserid() >= 0) {

					// 管理者情報設定
					resJasonObj.put("loginuserid", model.getUserid());
					resJasonObj.put("loginusername", model.getUsername());
					resJasonObj.put("logincompanyid", model.getCompanyid());
					resJasonObj.put("loginid", model.getLoginid());
					resJasonObj.put("loginrole", model.getRole());
					resJasonObj.put("loginupperuserid", model.getUpperuserid());
//					// 会社情報取得
//					Cloud_companyModel cloud_companyModel = cloud_companyService.getCompanyInfo(model.getCompanyid());
//
//					// 会社情報設定
//					resJasonObj.put("companyname", cloud_companyModel.getCompanyname());
//					resJasonObj.put("address", cloud_companyModel.getAddress());
//					resJasonObj.put("industry", cloud_companyModel.getIndustry());
//					resJasonObj.put("mail", cloud_companyModel.getMail());
//					resJasonObj.put("tel", cloud_companyModel.getTel());
//					resJasonObj.put("fax", cloud_companyModel.getFax());
//					resJasonObj.put("level", cloud_companyModel.getLevel());

					resJasonObj.put("result", true);

				} else {

					/* 異常系 */
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0005);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0005 + "login:");
					return response;
				}

			} catch (Exception e) {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0005);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0005 + "login:" + e.getMessage());
				return response;
			}

		} else {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0001);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0001 + "loginId & passwordが必須です。");
			return response;
		}

		response.setStatus(200);
		response.setResultCode(ErrorConstant.ERROR_CODE_0000);
		response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
		response.setData(resJasonObj.toString());
		return response;
	}
}