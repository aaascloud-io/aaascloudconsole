package com.ifocus.aaascloud.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ifocus.aaascloud.api.common.BaseHttpResponse;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.model.LoginInfo;
import com.ifocus.aaascloud.service.Cloud_companyService;
import com.ifocus.aaascloud.service.Cloud_userService;

import net.sf.json.JSONObject;

@Controller
public class Cloud_userController {

	@Autowired
	private Cloud_userService cloud_userService;
	@Autowired
	private Cloud_companyService cloud_companyService;

	/**
	 * ユーザ一覧を取得する
	 * @param json
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getSonUsers", method = RequestMethod.GET)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getSonUsers(@RequestBody LoginInfo loginInfo,Cloud_userModel cloud_userModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		Integer loginuserid = loginInfo.getLoginuserid();
		Integer targetuserid = cloud_userModel.getTargetuserid();

		if (null != loginuserid && null != targetuserid) {

			List<Cloud_userModel> list = new ArrayList();
			if (loginuserid.equals(targetuserid)) {
				list = cloud_userService.getSonUsers(targetuserid);
			} else {
				// 権限判断
				if (cloud_userService.isAncestor(loginuserid, targetuserid)) {
					list = cloud_userService.getSonUsers(targetuserid);
				} else {
					/* 異常系 */
					response.setStatus(200);
					response.setResultCode("0002");
					response.setResultMsg("権限なし：loginuserid&targetuseridが必須です。");
					return response;
				}
			}

			String responseData = new String();
			List<JSONObject> returnList = new ArrayList();
			for (Cloud_userModel model:list) {
				if (returnList.isEmpty()) {
					responseData = responseData + "[";
				} else {
					responseData = responseData + ",";
				}
				JSONObject resJasonObj = new JSONObject();
				// 情報設定
				resJasonObj.put("userid", model.getUserid());
				resJasonObj.put("username", model.getUsername());
				resJasonObj.put("companyid", model.getCompanyid());
				resJasonObj.put("loginid", model.getLoginid());
				resJasonObj.put("role", model.getRole());
				resJasonObj.put("upperuserid", model.getUpperuserid());
				resJasonObj.put("companyName", model.getCompanyName());
				resJasonObj.put("devicecount", model.getDevicecount());

				returnList.add(resJasonObj);
				responseData = responseData + resJasonObj.toString();
			}
			responseData = responseData + "]";

			response.setStatus(200);
			response.setResultCode("0000");
			response.setCount(list.size());
			response.setData(responseData);
		} else {
			/* 異常系 */
			response.setStatus(200);
			response.setResultCode("0001");
			response.setResultMsg("パラメータ設定エラー：userid&targetuseridが必須です。");
			return response;
		}

		return response;
	}

	/**
	 * ユーザを登録する
	 * @param loginInfo LoginInfo
	 * @param cloud_userModel Cloud_userModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/registerUser", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> registerUser(@RequestBody LoginInfo loginInfo,Cloud_userModel cloud_userModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		Integer registeredUserid = cloud_userService.registerSonUser(loginInfo,cloud_userModel);

		if (null != registeredUserid ) {
			/* 正常系 */
			response.setStatus(200);
			response.setResultCode("0000");
			response.setResultMsg("登録成功。");
		} else {
			/* 異常系 */
			response.setStatus(200);
			response.setResultCode("0100");
			response.setResultMsg("登録失敗:cloud_user");
		}

		return response;
	}
}