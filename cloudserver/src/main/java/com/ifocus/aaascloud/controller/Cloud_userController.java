package com.ifocus.aaascloud.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
import com.ifocus.aaascloud.model.Cloud_deviceModel;
import com.ifocus.aaascloud.model.Cloud_projectModel;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.model.ReturnModel;
import com.ifocus.aaascloud.service.AccessService;
import com.ifocus.aaascloud.service.Cloud_companyService;
import com.ifocus.aaascloud.service.Cloud_deviceService;
import com.ifocus.aaascloud.service.Cloud_projectService;
import com.ifocus.aaascloud.service.Cloud_userService;

import net.sf.json.JSONObject;

@Controller
public class Cloud_userController {

	@Autowired
	private AccessService accessService;
	@Autowired
	private Cloud_projectService cloud_projectService;
	@Autowired
	private Cloud_userService cloud_userService;
	@Autowired
	private Cloud_companyService cloud_companyService;
	@Autowired
	private Cloud_userRepository cloud_userRepository;
	@Autowired
	private Cloud_deviceService cloud_deviceService;

	/**
	 * 配下ユーザ一覧を取得する
	 * @param json
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getUnderUsers", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getUnderUsers(@RequestBody Cloud_userModel cloud_userModel) throws Exception {

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

		Integer loginuserid = cloud_userModel.getLoginInfo().getLoginuserid();
		Integer targetuserid = cloud_userModel.getTargetUserInfo().getTargetuserid();

		if (null != loginuserid && null != targetuserid) {

			List<Cloud_userModel> list = new ArrayList<Cloud_userModel>();
			if (loginuserid.equals(targetuserid)) {
				try {
					List<Integer> userids = accessService.getAccessUsers(targetuserid);
					list = cloud_userService.getUnderUsers(userids);
				} catch (Exception e) {
					/* 異常系 */
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0004);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_userService.getUnderUsers:" + e.getMessage());
					return response;
				}
			} else {
				// 権限判断
				if (cloud_userService.isAncestor(loginuserid, targetuserid)) {
					try {
						List<Integer> userids = accessService.getAccessUsers(targetuserid);
						list = cloud_userService.getUnderUsers(userids);
					} catch (Exception e) {
						/* 異常系 */
						response.setStatus(200);
						response.setResultCode(ErrorConstant.ERROR_CODE_0004);
						response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_userService.getUnderUsers:" + e.getMessage());
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
			List<JSONObject> returnList = new ArrayList<JSONObject>();
			for (Cloud_userModel model : list) {
				if (returnList.isEmpty()) {
					responseData = responseData + "[";
				} else {
					responseData = responseData + ",";
				}
				JSONObject resJasonObj = new JSONObject();
				// 情報設定
				resJasonObj.put("userid", model.getUserid());
				resJasonObj.put("username", model.getUsername());
				resJasonObj.put("firstname", model.getFirstName());
				resJasonObj.put("lastname", model.getLastName());
				resJasonObj.put("email", model.getEmail());
				resJasonObj.put("companyid", model.getCompanyid());
				resJasonObj.put("loginid", model.getLoginid());
				resJasonObj.put("role", model.getRole());
				resJasonObj.put("upperuserid", model.getUpperuserid());
				resJasonObj.put("companyName", model.getCompanyname());
				resJasonObj.put("devicecount", model.getDevicecount());
				resJasonObj.put("userfullname", model.getFullName());


				// アクセス権限ユーザ一覧を取得する
				List<Integer> underUserList = accessService.getAccessUsers(model.getUserid());
				// 配下ユーザ数
				resJasonObj.put("userCount", underUserList.size());

				// プロジェクト一覧を取得する
				List<Cloud_projectModel> projectList = cloud_projectService.getMyUnderProjects(underUserList);
				// 配下プロジェクト数
				resJasonObj.put("projectCount", projectList.size());

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
	 * 配下ユーザ検索
	 * @param json
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/searchUnderUsers", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> searchUnderUsers(@RequestBody Cloud_userModel cloud_userModel) throws Exception {

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

		Integer loginuserid = cloud_userModel.getLoginInfo().getLoginuserid();
		Integer targetuserid = cloud_userModel.getTargetUserInfo().getTargetuserid();

		if (null != loginuserid && null != targetuserid) {

			List<Cloud_userModel> list = new ArrayList<Cloud_userModel>();
			if (loginuserid.equals(targetuserid)) {
				try {
					List<Integer> userids = accessService.getAccessUsers(targetuserid);
					// 自分自身を除外
					userids.remove(targetuserid);
					list = cloud_userService.searchUnderUsers(userids, cloud_userModel);
				} catch (Exception e) {
					/* 異常系 */
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0004);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_userService.getUnderUsers:" + e.getMessage());
					return response;
				}
			} else {
				// 権限判断
				if (cloud_userService.isAncestor(loginuserid, targetuserid)) {
					try {
						List<Integer> userids = accessService.getAccessUsers(targetuserid);
						list = cloud_userService.searchUnderUsers(userids, cloud_userModel);
					} catch (Exception e) {
						/* 異常系 */
						response.setStatus(200);
						response.setResultCode(ErrorConstant.ERROR_CODE_0004);
						response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_userService.getUnderUsers:" + e.getMessage());
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
			List<JSONObject> returnList = new ArrayList<JSONObject>();
			for (Cloud_userModel model : list) {
				if (returnList.isEmpty()) {
					responseData = responseData + "[";
				} else {
					responseData = responseData + ",";
				}
				JSONObject resJasonObj = new JSONObject();
				// 情報設定
				resJasonObj.put("userid", model.getUserid());
				resJasonObj.put("username", model.getUsername());
				resJasonObj.put("firstname", model.getFirstName());
				resJasonObj.put("lastname", model.getLastName());
				resJasonObj.put("email", model.getEmail());
				resJasonObj.put("companyid", model.getCompanyid());
				resJasonObj.put("loginid", model.getLoginid());
				resJasonObj.put("role", model.getRole());
				resJasonObj.put("upperuserid", model.getUpperuserid());
				resJasonObj.put("companyName", model.getCompanyname());
				resJasonObj.put("deleteflag", model.getDeleteflag());
//				resJasonObj.put("devicecount", model.getDevicecount());


				// アクセス権限ユーザ一覧を取得する
				List<Integer> underUserList = accessService.getAccessUsers(model.getUserid());
				// 配下ユーザ数
				resJasonObj.put("userCount", underUserList.size());

				// プロジェクト一覧を取得する
				List<Cloud_projectModel> projectList = cloud_projectService.getMyUnderProjects(underUserList);

				// デバイス一覧を取得する
				List<Cloud_deviceModel> deviceList = cloud_deviceService.getUnderUserDevices(underUserList);
				resJasonObj.put("deviceCount", deviceList.size());

				// 配下プロジェクト数
				resJasonObj.put("projectCount", projectList.size());

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
	 * ユーザ一覧を取得する
	 * @param json
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getSonUsers", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getSonUsers(@RequestBody Cloud_userModel cloud_userModel) throws Exception {

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

		Integer loginuserid = cloud_userModel.getLoginInfo().getLoginuserid();
		Integer targetuserid = cloud_userModel.getTargetUserInfo().getTargetuserid();

		if (null != loginuserid && null != targetuserid) {

			List<Cloud_userModel> list = new ArrayList<Cloud_userModel>();
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
			List<JSONObject> returnList = new ArrayList<JSONObject>();
			for (Cloud_userModel model : list) {
				if (returnList.isEmpty()) {
					responseData = responseData + "[";
				} else {
					responseData = responseData + ",";
				}
				JSONObject resJasonObj = new JSONObject();
				// 情報設定
				resJasonObj.put("userid", model.getUserid());
				resJasonObj.put("username", model.getUsername());
				resJasonObj.put("firstname", model.getFirstName());
				resJasonObj.put("lastname", model.getLastName());
				resJasonObj.put("email", model.getEmail());
				resJasonObj.put("companyid", model.getCompanyid());
				resJasonObj.put("loginid", model.getLoginid());
				resJasonObj.put("role", model.getRole());
				resJasonObj.put("upperuserid", model.getUpperuserid());
				resJasonObj.put("companyName", model.getCompanyname());
				resJasonObj.put("devicecount", model.getDevicecount());


				// アクセス権限ユーザ一覧を取得する
				List<Integer> underUserList = accessService.getAccessUsers(model.getUserid());
				// 配下ユーザ数
				resJasonObj.put("userCount", underUserList.size());

				// プロジェクト一覧を取得する
				List<Cloud_projectModel> projectList = cloud_projectService.getMyUnderProjects(underUserList);
				// 配下プロジェクト数
				resJasonObj.put("projectCount", projectList.size());

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
	public BaseHttpResponse<String> registerUser(@RequestBody Cloud_userModel cloud_userModel) throws Exception {

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

		// 権限チェック
		ReturnModel returnModel = accessService.checkAddUserAccess(cloud_userModel);
		if (!returnModel.getKey().equals(ErrorConstant.ERROR_CODE_0000)) {
			/* 異常系:権限なし */
			response.setStatus(200);
			response.setResultCode(returnModel.getKey());
			response.setResultMsg("accessService.checkAddUserAccess: " + returnModel.getValue());
			return response;
		}

//		// KeyCloakに存在しない場合、
//		if (!cloud_userService.isValidUsername(cloud_userModel.getUsername())) {
//			/* 異常系 */
//			response.setStatus(200);
//			response.setResultCode(ErrorConstant.ERROR_CODE_0008);
//			response.setResultMsg(ErrorConstant.ERROR_MSG_0008 + "KeyCloakに未登録のユーザ名です。");
//			return response;
//		} else {
//			// KeyCloakからユーザ情報取得＆設定
//			UserModel usermodel = cloud_userService.getUserModelFromUsername(cloud_userModel.getUsername());
//			if (usermodel.getLastName().isEmpty()) {
//				cloud_userModel.setLastName("");
//			} else {
//				cloud_userModel.setLastName(usermodel.getLastName());
//			}
//			if (usermodel.getFirstName().isEmpty()) {
//				cloud_userModel.setFirstName("");
//			} else {
//				cloud_userModel.setFirstName(usermodel.getFirstName());
//			}
//			if (usermodel.getEmail().isEmpty()) {
//				cloud_userModel.setEmail("");
//			} else {
//				cloud_userModel.setEmail(usermodel.getEmail());
//			}
//		}

		try {

			Integer registeredUserid = cloud_userService.registerSonUser(cloud_userModel);

			if (null != registeredUserid ) {
				if (registeredUserid == -1) {
					/* 異常系 */
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0200);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0200 + "cloud_userService.registerSonUser:cloud_user");
				} else {
					/* 正常系 */
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0000);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
				}
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
	public BaseHttpResponse<String> updateUser(@RequestBody Cloud_userModel cloud_userModel) throws Exception {

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

		// 権限チェック
		ReturnModel returnModel = accessService.checkAddUserAccess(cloud_userModel);
		if (!returnModel.getKey().equals(ErrorConstant.ERROR_CODE_0000)) {
			/* 異常系:権限なし */
			response.setStatus(200);
			response.setResultCode(returnModel.getKey());
			response.setResultMsg("accessService.checkAddUserAccess: " + returnModel.getValue());
			return response;
		}

		try {
			Optional<Cloud_userEntity> tempEntity = cloud_userRepository.findById(cloud_userModel.getUserid());
			Cloud_userEntity entity = tempEntity.get();
			// ユーザ名が更新されるなら、
			if (!entity.getUsername().equals(cloud_userModel.getUsername())) {
				// KeyCloakに存在しない場合、
				if (!cloud_userService.isValidUsername(cloud_userModel.getUsername())) {
					/* 異常系 */
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0008);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0008 + "KeyCloakに未登録のユーザ名です。");
					return response;
				}
			}
		} catch (Exception e) {
			/* 異常系 */
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0100);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0100 + "cloud_userService.updateSonUser:" + e.getMessage());
			return response;
		}

		try {
			Integer registeredUserid = cloud_userService.updateSonUser(cloud_userModel.getLoginInfo(),cloud_userModel);

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
	public BaseHttpResponse<String> deleteUser(@RequestBody Cloud_userModel cloud_userModel) throws Exception {

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

		// 権限チェック
		ReturnModel returnModel = accessService.checkAddUserAccess(cloud_userModel);
		if (!returnModel.getKey().equals(ErrorConstant.ERROR_CODE_0000)) {
			/* 異常系:権限なし */
			response.setStatus(200);
			response.setResultCode(returnModel.getKey());
			response.setResultMsg("accessService.checkAddUserAccess: " + returnModel.getValue());
			return response;
		}


		try {

			cloud_userService.deleteSonUsers(cloud_userModel);

		} catch (Exception e) {
			/* 異常系 */
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0102);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0102 + "deleteCompany OR deleteSonUsers:" + e.getMessage());
			return response;
		}

		response.setStatus(200);
		response.setResultCode(ErrorConstant.ERROR_CODE_0000);
		response.setResultMsg(ErrorConstant.ERROR_MSG_0000);

		return response;
	}
}