package com.ifocus.aaascloud.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ifocus.aaascloud.api.common.BaseHttpResponse;
import com.ifocus.aaascloud.model.Cloud_companyModel;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.service.Cloud_companyService;
import com.ifocus.aaascloud.service.Cloud_userService;

import net.sf.json.JSONObject;

@Controller
public class LoginController {

	@Autowired
	private Cloud_userService cloud_userService;
	@Autowired
	private Cloud_companyService cloud_companyService;

	/**
	 * loginユーザーを取得する
	 * @param json
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getuser", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	///public BaseHttpResponse<String> getLoginUser(@RequestBody String json) throws Exception {
	public BaseHttpResponse<String> getLoginUser(@RequestBody Cloud_userModel cloud_userModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();
//
		JSONObject resJasonObj = new JSONObject();
//
//		ObjectMapper objectMapper = new ObjectMapper();
//
//		JsonNode rootNode = objectMapper.readValue(URLDecoder.decode(json, "UTF-8"), JsonNode.class);

//		String loginId = rootNode.get("loginid").asText();
//		String password = rootNode.get("password").asText();

		String loginId = cloud_userModel.getLoginid();
		String password = cloud_userModel.getPassword();

		if (null != loginId && null != password) {

			Cloud_userModel model = cloud_userService.login(loginId, password);

			if (model.getUserid() >= 0) {

				// 管理者情報設定
				resJasonObj.put("userid", model.getUserid());
				resJasonObj.put("username", model.getUsername());
				resJasonObj.put("companyid", model.getCompanyid());
				resJasonObj.put("loginid", model.getLoginid());
				resJasonObj.put("role", model.getRole());
				resJasonObj.put("upperuserid", model.getUpperuserid());
				// 会社情報取得
				Cloud_companyModel cloud_companyModel = cloud_companyService.getCompanyInfo(model.getCompanyid());

				// 会社情報設定
				resJasonObj.put("companyname", cloud_companyModel.getCompanyname());
				resJasonObj.put("address", cloud_companyModel.getAddress());
				resJasonObj.put("industry", cloud_companyModel.getIndustry());
				resJasonObj.put("mail", cloud_companyModel.getMail());
				resJasonObj.put("tel", cloud_companyModel.getTel());
				resJasonObj.put("fax", cloud_companyModel.getFax());
				resJasonObj.put("level", cloud_companyModel.getLevel());

				resJasonObj.put("result", true);

			} else {

				resJasonObj.put("result", false);
			}
		} else {
			resJasonObj.put("result", false);
		}

		response.setStatus(200);
		response.setData(resJasonObj.toString());
		//	response.setHeader("Access-Control-Allow-Origin", "*");
		return response;
	}
}