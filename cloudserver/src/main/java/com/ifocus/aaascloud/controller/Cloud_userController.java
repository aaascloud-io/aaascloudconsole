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
import com.ifocus.aaascloud.constant.ErrorConstant;
import com.ifocus.aaascloud.entity.Cloud_companyEntity;
import com.ifocus.aaascloud.entity.Cloud_userEntity;
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
				try {
					list = cloud_userService.getSonUsers(targetuserid);
				} catch (Exception e) {
					/* 異常系 */
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0004);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_userService.getSonUsers:" + e.getMessage());
					return response;
				}
			} else {
				// 権限判断
				if (cloud_userService.isAncestor(loginuserid, targetuserid)) {
					try {
						list = cloud_userService.getSonUsers(targetuserid);
					} catch (Exception e) {
						/* 異常系 */
						response.setStatus(200);
						response.setResultCode(ErrorConstant.ERROR_CODE_0004);
						response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_userService.getSonUsers:" + e.getMessage());
						return response;
					}
				} else {
					/* 異常系 */
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0002);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0002 + "loginuserid&targetuseridが必須です。");
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
			response.setResultCode(ErrorConstant.ERROR_CODE_0000);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
			response.setCount(list.size());
			response.setData(responseData);
		} else {
			/* 異常系 */
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0001);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0001 + "userid&targetuseridが必須です。");
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

		// admin権限以外の場合、
		if (1 != loginInfo.getLoginrole() ) {
			/* 異常系 */
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0002);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0002 + "admin権限が必要。");
			return response;
		}

		try {
			Integer registeredUserid = cloud_userService.registerSonUser(loginInfo,cloud_userModel);

			if (null != registeredUserid ) {
				/* 正常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
			} else {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0100);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0100 + "cloud_userService.registerSonUser:cloud_user");
			}
		} catch (Exception e) {
			/* 異常系 */
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0100);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0100 + "cloud_userService.registerSonUser:" + e.getMessage());
			return response;
		}

		return response;
	}

	/**
	 * ユーザを更新する
	 * @param loginInfo LoginInfo
	 * @param cloud_userModel Cloud_userModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/updateUser", method = RequestMethod.PUT)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> updateUser(@RequestBody LoginInfo loginInfo,Cloud_userModel cloud_userModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			Integer registeredUserid = cloud_userService.updateSonUser(loginInfo,cloud_userModel);

			if (null != registeredUserid ) {
				/* 正常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
			} else {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0100);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0100 + "cloud_userService.updateSonUser");
			}
		} catch (Exception e) {
			/* 異常系 */
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0100);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0100 + "cloud_userService.updateSonUser:" + e.getMessage());
			return response;
		}
		return response;
	}

	/**
	 * ユーザを削除する
	 * @param loginInfo LoginInfo
	 * @param cloud_userModel Cloud_userModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteUser", method = RequestMethod.DELETE)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> deleteUser(@RequestBody LoginInfo loginInfo,Cloud_userModel cloud_userModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		// プロジェクトがある場合、削除しないこと。ToDo
//		if () {
//			response.setStatus(200);
//			response.setResultCode("0003");
//			response.setResultMsg("プロジェクトがある。プロジェクトを削除してから再実施してください。");
//			return response;
//		}

		try {
			// 会社ユーザ一覧取得
			List<Cloud_userEntity> entiyList = cloud_userService.getCompanyUsers(cloud_userModel.getCompanyid());

			// 会社の最後のユーザになった場合、会社も削除する。
			if (entiyList.size() == 1) {
				Cloud_companyEntity cloud_companyEntity = new Cloud_companyEntity();
				cloud_companyEntity.setCompanyid(cloud_userModel.getCompanyid());
				// 会社を削除する
				cloud_companyService.deleteCompany(cloud_companyEntity);
			}

			// ユーザを削除する
			cloud_userService.deleteSonUser(loginInfo,cloud_userModel);

		} catch (Exception e) {
			/* 異常系 */
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0102);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0102 + "deleteCompany OR deleteSonUser:" + e.getMessage());
			return response;
		}

		response.setStatus(200);
		response.setResultCode(ErrorConstant.ERROR_CODE_0000);
		response.setResultMsg(ErrorConstant.ERROR_MSG_0000);

		return response;
	}
}