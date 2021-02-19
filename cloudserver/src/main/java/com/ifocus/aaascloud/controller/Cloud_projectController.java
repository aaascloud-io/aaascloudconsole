package com.ifocus.aaascloud.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import com.ifocus.aaascloud.model.ProjectDetailModel;
import com.ifocus.aaascloud.service.Cloud_projectService;
import com.ifocus.aaascloud.service.Cloud_userService;

import net.sf.json.JSONObject;

@Controller
public class Cloud_projectController {

	@Autowired
	private Cloud_userService cloud_userService;
	@Autowired
	private Cloud_projectService cloud_projectService;

	/**
	 * プロジェクト一覧を取得する
	 * @param cloud_projectModel Cloud_projectModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/getProjects", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<List<Cloud_projectModel>> getProjects(@RequestBody Cloud_projectModel cloud_projectModel) throws Exception {

		BaseHttpResponse<List<Cloud_projectModel>> response = new BaseHttpResponse<List<Cloud_projectModel>>();

		try {
			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_projectModel.getLoginInfo().getLoginuserid(), cloud_projectModel.getTargetUserInfo().getTargetuserid())) {

					// プロジェクト一覧を取得する
					List<Cloud_projectModel> list = cloud_projectService.getMyProjects(cloud_projectModel.getTargetUserInfo().getTargetuserid());

					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0000);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
					response.setCount(list.size());
					response.setData(list);

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
	public BaseHttpResponse<ProjectDetailModel> getProject(@RequestBody Cloud_projectModel cloud_projectModel) throws Exception {

		BaseHttpResponse<ProjectDetailModel> response = new BaseHttpResponse<ProjectDetailModel>();

		try {

			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_projectModel.getLoginInfo().getLoginuserid(), cloud_projectModel.getTargetUserInfo().getTargetuserid())) {

				// プロジェクト詳細を取得する
				Cloud_projectDetailModel model = cloud_projectService.getMyProject(cloud_projectModel.getProjectid());

				if (model != null) {
					ProjectDetailModel projectDetailModel = new ProjectDetailModel();
					// 情報設定
					projectDetailModel.setProjectid(model.getProjectid());
					projectDetailModel.setUserid(model.getUserid());
					projectDetailModel.setProjectname(model.getProjectname());
					projectDetailModel.setProductid(model.getProductid());
					projectDetailModel.setProjectsummary(model.getProjectsummary());
					projectDetailModel.setProductname(model.getProductname());
					projectDetailModel.setGroupCounts(model.getGroupCounts());
					projectDetailModel.setDeviceCounts(model.getDeviceCounts());

					// グループ一覧情報設定
					projectDetailModel.setGroupList(model.getGroupList());
					// デバイス一覧情報設定
					projectDetailModel.setDeviceList(model.getDeviceList());
					response.setData(projectDetailModel);
				}else {
					response.setData(null);
				}
				
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);

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
	public BaseHttpResponse<Map<String, Object>> registerProject(@RequestBody Cloud_projectDetailModel cloud_projectDetailModel) throws Exception {

		BaseHttpResponse<Map<String, Object>> response = new BaseHttpResponse<Map<String, Object>>();

		try {

			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_projectDetailModel.getLoginInfo().getLoginuserid(), cloud_projectDetailModel.getTargetUserInfo().getTargetuserid())) {

				// プロジェクトを登録する
				Integer projectid = cloud_projectService.registerProject(cloud_projectDetailModel);

				if (projectid != null) {
					// 情報設定
					Map<String, Object> returnObj = new HashMap<>();
					returnObj.put("projectid", projectid);
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0000);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
					response.setData(returnObj);
				} else {
					/* 異常系 */
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0100);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0100 + "cloud_project");
				}

			} else {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0002);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0002 + "checkAccessOK");
			}

		} catch( Exception e) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0100);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0100 + e.getMessage());
		}

		return response;
	}

	/**
	 * プロジェクトを更新する
	 * @param cloud_projectModel Cloud_projectModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/updateProject", method = RequestMethod.PUT)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<Map<String, Object>> updateProject(@RequestBody Cloud_projectDetailModel cloud_projectDetailModel) throws Exception {

		BaseHttpResponse<Map<String, Object>> response = new BaseHttpResponse<Map<String, Object>>();

		try {

			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_projectDetailModel.getLoginInfo().getLoginuserid(), cloud_projectDetailModel.getTargetUserInfo().getTargetuserid())) {

				// プロジェクトを更新する
				Integer projectid = cloud_projectService.updateProject(cloud_projectDetailModel);

				if (projectid != null) {
					// 情報設定
					Map<String, Object> returnObj = new HashMap<>();
					returnObj.put("updateCount", 1);
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0000);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
					response.setData(returnObj);
				} else {
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0101);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0101);
				}

			} else {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0002);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0002 + "checkAccessOK");
			}

		} catch( Exception e) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0101);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0101 + e.getMessage());
		}

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
	public BaseHttpResponse<Map<String, Object>> deleteProject(@RequestBody Cloud_projectModel cloud_projectModel) throws Exception {

		BaseHttpResponse<Map<String, Object>> response = new BaseHttpResponse<Map<String, Object>>();

		try {

			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_projectModel.getLoginInfo().getLoginuserid(), cloud_projectModel.getTargetUserInfo().getTargetuserid())) {

				// プロジェクトを削除する
				cloud_projectService.deleteProject(cloud_projectModel);

				// 情報設定
				Map<String, Object> returnObj = new HashMap<>();
				returnObj.put("deleteCount", 1);

				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
				response.setData(returnObj);

			} else {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0002);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0002 + "checkAccessOK");
			}

		} catch( Exception e) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0102);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0102 + e.getMessage());
		}

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
			resJasonObj.put("sim_imsi",model.getSim_imsi());
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