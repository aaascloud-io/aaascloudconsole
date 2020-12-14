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
import com.ifocus.aaascloud.model.Cloud_deviceModel;
import com.ifocus.aaascloud.model.Cloud_groupModel;
import com.ifocus.aaascloud.model.Cloud_projectDetailModel;
import com.ifocus.aaascloud.model.Cloud_projectModel;
import com.ifocus.aaascloud.model.LoginInfo;
import com.ifocus.aaascloud.service.Cloud_companyService;
import com.ifocus.aaascloud.service.Cloud_projectService;
import com.ifocus.aaascloud.service.Cloud_userService;

import net.sf.json.JSONObject;

@Controller
public class Cloud_projectController {

	@Autowired
	private Cloud_userService cloud_userService;
	@Autowired
	private Cloud_projectService cloud_projectService;
	@Autowired
	private Cloud_companyService cloud_companyService;

	/**
	 * プロジェクト一覧を取得する
	 * @param cloud_projectModel Cloud_projectModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/getProjects", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getProjects(@RequestBody Cloud_projectModel cloud_projectModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_projectModel.getLoginInfo().getLoginuserid(), cloud_projectModel.getTargetUserInfo().getTargetuserid())) {

					// プロジェクト一覧を取得する
					List<Cloud_projectModel> list = cloud_projectService.getMyProjects(cloud_projectModel.getTargetUserInfo().getTargetuserid());

					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0000);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
					response.setCount(list.size());
					response.setData(this.getProjectJsonString(list));

			} else {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0002);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0002 + "loginuserid&targetuseridが必須です。");

			}
		} catch( Exception e) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0004);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + e.getMessage());
		}

		return response;
	}

	/**
	 * プロジェクト詳細を取得する
	 * @param cloud_projectModel Cloud_projectModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/getProject", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getProject(@RequestBody Cloud_projectModel cloud_projectModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {

			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_projectModel.getLoginInfo().getLoginuserid(), cloud_projectModel.getTargetUserInfo().getTargetuserid())) {

				// プロジェクト詳細を取得する
				Cloud_projectDetailModel model = cloud_projectService.getMyProject(cloud_projectModel.getProductid());

				String responseData = new String();
				responseData = responseData + "{";

				JSONObject resJasonObj = new JSONObject();
				// 情報設定
				resJasonObj.put("projectid", model.getProjectid());
				resJasonObj.put("userid", model.getUserid());
				resJasonObj.put("projectname", model.getProjectname());
				resJasonObj.put("productid", model.getProductid());
				resJasonObj.put("projectsummary", model.getProjectsummary());
				resJasonObj.put("productname", model.getProductname());
				resJasonObj.put("groupCounts", model.getGroupCounts());
				resJasonObj.put("deviceCounts", model.getDeviceCounts());

				// グループ一覧情報設定
				resJasonObj.put("groupList", getGroupJsonString(model.getGroupList()));
				// デバイス一覧情報設定
				resJasonObj.put("deviceList", getDeviceJsonString(model.getDeviceList()));

				responseData = responseData + "}";

				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
				response.setData(responseData);

			} else {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0002);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0002 + "loginuserid&targetuseridが必須です。");

			}

		} catch( Exception e) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0004);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + e.getMessage());
		}

		return response;
	}

	/**
	 * プロジェクトを登録する
	 * @param loginInfo LoginInfo
	 * @param cloud_projectModel Cloud_projectModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/registerProject", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> registerProject(@RequestBody LoginInfo loginInfo,Cloud_projectModel cloud_projectModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		return response;
	}

	/**
	 * プロジェクトを更新する
	 * @param loginInfo LoginInfo
	 * @param cloud_projectModel Cloud_projectModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/updateProject", method = RequestMethod.PUT)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> updateProject(@RequestBody LoginInfo loginInfo,Cloud_projectModel cloud_projectModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

//		try {
//			Integer registeredUserid = cloud_projectService.updateSonUser(loginInfo,cloud_projectModel);
//
//			if (null != registeredUserid ) {
//				/* 正常系 */
//				response.setStatus(200);
//				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
//				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
//			} else {
//				/* 異常系 */
//				response.setStatus(200);
//				response.setResultCode(ErrorConstant.ERROR_CODE_0100);
//				response.setResultMsg(ErrorConstant.ERROR_MSG_0100 + "cloud_projectService.updateSonUser");
//			}
//		} catch (Exception e) {
//			/* 異常系 */
//			response.setStatus(200);
//			response.setResultCode(ErrorConstant.ERROR_CODE_0100);
//			response.setResultMsg(ErrorConstant.ERROR_MSG_0100 + "cloud_projectService.updateSonUser:" + e.getMessage());
//			return response;
//		}
		return response;
	}

	/**
	 * プロジェクトを削除する
	 * @param loginInfo LoginInfo
	 * @param cloud_projectModel Cloud_projectModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteProject", method = RequestMethod.DELETE)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> deleteProject(@RequestBody LoginInfo loginInfo,Cloud_projectModel cloud_projectModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		response.setStatus(200);
		response.setResultCode(ErrorConstant.ERROR_CODE_0000);
		response.setResultMsg(ErrorConstant.ERROR_MSG_0000);

		return response;
	}

	/**
	 * プロジェクトリストのJsonを取得する
	 * @param list List<Cloud_projectModel>
	 * @return String Json形式
	 */
	private String getProjectJsonString(List<Cloud_projectModel> list) {

		String responseData = new String();
		responseData = responseData + "[";
		for (Cloud_projectModel model:list) {
			if (responseData.length() > 1) {
				responseData = responseData + ",";
			}
			JSONObject resJasonObj = new JSONObject();
			// 情報設定
			resJasonObj.put("projectid", model.getProjectid());
			resJasonObj.put("userid", model.getUserid());
			resJasonObj.put("projectname", model.getProjectname());
			resJasonObj.put("productid", model.getProductid());
			resJasonObj.put("projectsummary", model.getProjectsummary());
			resJasonObj.put("productname", model.getProductname());
			resJasonObj.put("groupCounts", model.getGroupCounts());
			resJasonObj.put("deviceCounts", model.getDeviceCounts());

			responseData = responseData + resJasonObj.toString();
		}
		responseData = responseData + "]";

		return responseData;

	}

	/**
	 * グループリストのJsonを取得する
	 * @param list List<Cloud_groupModel>
	 * @return String Json形式
	 */
	private String getGroupJsonString(List<Cloud_groupModel> list) {

		String responseData = new String();
		responseData = responseData + "[";
		for (Cloud_groupModel model:list) {
			if (responseData.length() > 1) {
				responseData = responseData + ",";
			}
			JSONObject resJasonObj = new JSONObject();
			// 情報設定
			resJasonObj.put("groupid",model.getGroupid());
			resJasonObj.put("projectid",model.getProjectid());
			resJasonObj.put("groupname",model.getGroupname());
			resJasonObj.put("alive",model.getAlive());

			responseData = responseData + resJasonObj.toString();
		}
		responseData = responseData + "]";

		return responseData;

	}

	/**
	 * デバイスリストのJsonを取得する
	 * @param list List<Cloud_deviceModel>
	 * @return String Json形式
	 */
	private String getDeviceJsonString(List<Cloud_deviceModel> list) {

		String responseData = new String();
		responseData = responseData + "[";
		for (Cloud_deviceModel model:list) {
			if (responseData.length() > 1) {
				responseData = responseData + ",";
			}
			JSONObject resJasonObj = new JSONObject();
			// 情報設定
			resJasonObj.put("deviceid",model.getDeviceid());
			resJasonObj.put("projectid",model.getProjectid());
			resJasonObj.put("groupid",model.getGroupid());
			resJasonObj.put("devicename",model.getDevicename());
			resJasonObj.put("imei",model.getImei());
			resJasonObj.put("iccid",model.getIccid());
			resJasonObj.put("sn",model.getSn());
			resJasonObj.put("sim_iccid",model.getSim_iccid());
			resJasonObj.put("sim_imei",model.getSim_imei());
			resJasonObj.put("sim_tel",model.getSim_tel());
			resJasonObj.put("companyid",model.getCompanyid());
			resJasonObj.put("userid",model.getUserid());
			resJasonObj.put("alive",model.getAlive());

			responseData = responseData + resJasonObj.toString();
		}
		responseData = responseData + "]";

		return responseData;

	}
}