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
import com.ifocus.aaascloud.model.Cloud_projectDetailModel;
import com.ifocus.aaascloud.model.Cloud_projectModel;
import com.ifocus.aaascloud.model.ProjectDetailModel;
import com.ifocus.aaascloud.service.Cloud_projectService;
import com.ifocus.aaascloud.service.Cloud_userService;
import com.ifocus.aaascloud.util.Util;

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
	public BaseHttpResponse<String> getProjects(@RequestBody Cloud_projectModel cloud_projectModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// トークン認証
			if (!cloud_userService.checkToken(cloud_projectModel.getLoginInfo())) {
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

		try {
			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_projectModel.getLoginInfo().getLoginuserid(), cloud_projectModel.getTargetUserInfo().getTargetuserid())) {

					// プロジェクト一覧を取得する
					List<Cloud_projectModel> list = cloud_projectService.getMyProjects(cloud_projectModel.getTargetUserInfo().getTargetuserid());

					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0000);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
					response.setCount(list.size());
					response.setData(Util.getJsonString(list));

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
	 * プロジェクトを検索する
	 * @param cloud_projectModel Cloud_projectModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/searchProjects", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> searchProjects(@RequestBody Cloud_projectModel cloud_projectModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// トークン認証
			if (!cloud_userService.checkToken(cloud_projectModel.getLoginInfo())) {
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

		try {
			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_projectModel.getLoginInfo().getLoginuserid(), cloud_projectModel.getTargetUserInfo().getTargetuserid())) {

					// プロジェクトを検索する
					List<Cloud_projectModel> list = cloud_projectService.searchMyProjects(cloud_projectModel);

					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0000);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
					response.setCount(list.size());
					response.setData(Util.getJsonString(list));

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
			// トークン認証
			if (!cloud_userService.checkToken(cloud_projectModel.getLoginInfo())) {
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

		try {

			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_projectModel.getLoginInfo().getLoginuserid(), cloud_projectModel.getTargetUserInfo().getTargetuserid())) {

				// プロジェクト詳細を取得する
				Cloud_projectDetailModel model = cloud_projectService.getMyProject(cloud_projectModel.getProjectid());

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

				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
				response.setData(Util.getJsonString(projectDetailModel));

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
	public BaseHttpResponse<String> registerProject(@RequestBody Cloud_projectDetailModel cloud_projectDetailModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// トークン認証
			if (!cloud_userService.checkToken(cloud_projectDetailModel.getLoginInfo())) {
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

		try {

			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_projectDetailModel.getLoginInfo().getLoginuserid(), cloud_projectDetailModel.getTargetUserInfo().getTargetuserid())) {

				// プロジェクトを登録する
				Integer projectid = cloud_projectService.registerProject(cloud_projectDetailModel);

				if (projectid != null) {
					String responseData = new String();
					responseData = responseData + "{";

					JSONObject resJasonObj = new JSONObject();
					// 情報設定
					resJasonObj.put("projectid", projectid);

					responseData = responseData + "}";

					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0000);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
					response.setData(responseData);
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
	public BaseHttpResponse<String> updateProject(@RequestBody Cloud_projectDetailModel cloud_projectDetailModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// トークン認証
			if (!cloud_userService.checkToken(cloud_projectDetailModel.getLoginInfo())) {
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

		try {

			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_projectDetailModel.getLoginInfo().getLoginuserid(), cloud_projectDetailModel.getTargetUserInfo().getTargetuserid())) {

				// プロジェクトを更新する
				Integer projectid = cloud_projectService.updateProject(cloud_projectDetailModel);

				if (projectid != null) {

					String responseData = new String();
					responseData = responseData + "{";

					JSONObject resJasonObj = new JSONObject();
					// 情報設定
					resJasonObj.put("updateCount", 1);

					responseData = responseData + "}";

					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0000);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
					response.setData(responseData);
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
	 * プロジェクトのデバイス追加
	 * @param cloud_projectModel Cloud_projectModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/addProjectDevices", method = RequestMethod.PUT)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> addProjectDevices(@RequestBody Cloud_projectDetailModel cloud_projectDetailModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// トークン認証
			if (!cloud_userService.checkToken(cloud_projectDetailModel.getLoginInfo())) {
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

		try {

			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_projectDetailModel.getLoginInfo().getLoginuserid(), cloud_projectDetailModel.getTargetUserInfo().getTargetuserid())) {

				// ロジェクトのデバイスを追加する
				cloud_projectService.addProjectDevices(cloud_projectDetailModel);

				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);

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
	 * プロジェクトのデバイス削除
	 * @param cloud_projectModel Cloud_projectModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteProjectDevices", method = RequestMethod.PUT)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> deleteProjectDevices(@RequestBody Cloud_projectDetailModel cloud_projectDetailModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// トークン認証
			if (!cloud_userService.checkToken(cloud_projectDetailModel.getLoginInfo())) {
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

		try {

			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_projectDetailModel.getLoginInfo().getLoginuserid(), cloud_projectDetailModel.getTargetUserInfo().getTargetuserid())) {

				// ロジェクトのデバイスを削除する
				cloud_projectService.deleteProjectDevices(cloud_projectDetailModel);

				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);

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
	public BaseHttpResponse<String> deleteProject(@RequestBody Cloud_projectModel cloud_projectModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// トークン認証
			if (!cloud_userService.checkToken(cloud_projectModel.getLoginInfo())) {
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

		try {

			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_projectModel.getLoginInfo().getLoginuserid(), cloud_projectModel.getTargetUserInfo().getTargetuserid())) {

				// プロジェクトを削除する
				cloud_projectService.deleteProject(cloud_projectModel);

				String responseData = new String();
				responseData = responseData + "{";

				JSONObject resJasonObj = new JSONObject();
				// 情報設定
				resJasonObj.put("deleteCount", 1);

				responseData = responseData + "}";

				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
				response.setData(responseData);

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
	 * 一括プロジェクトを削除する
	 * @param loginInfo LoginInfo
	 * @param cloud_projectModel Cloud_projectModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteProjects", method = RequestMethod.DELETE)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> deleteProjects(@RequestBody Cloud_projectModel cloud_projectModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// トークン認証
			if (!cloud_userService.checkToken(cloud_projectModel.getLoginInfo())) {
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

		try {

			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_projectModel.getLoginInfo().getLoginuserid(), cloud_projectModel.getTargetUserInfo().getTargetuserid())) {

				// 一括プロジェクトを削除する
				cloud_projectService.deleteProjects(cloud_projectModel.getProjectlist());

				String responseData = new String();
				responseData = responseData + "{";

				JSONObject resJasonObj = new JSONObject();
				// 情報設定
				resJasonObj.put("deleteCount", cloud_projectModel.getProjectlist().size());

				responseData = responseData + "}";

				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
				response.setData(responseData);

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

}