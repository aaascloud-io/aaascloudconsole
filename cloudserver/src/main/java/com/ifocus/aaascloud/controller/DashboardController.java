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
import com.ifocus.aaascloud.model.Cloud_projectModel;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.service.AccessService;
import com.ifocus.aaascloud.service.Cloud_projectService;
import com.ifocus.aaascloud.service.Cloud_userService;

import net.sf.json.JSONObject;

@Controller
public class DashboardController {

	@Autowired
	private AccessService accessService;
	@Autowired
	private Cloud_userService cloud_userService;
	@Autowired
	private Cloud_projectService cloud_projectService;

	/**
	 * ダッシュボード情報を取得する
	 * @param cloud_userModel Cloud_userModel
	 *         userid
	 * @return BaseHttpResponse<String> JSON形式
	 * @throws Exception
	 */
	@RequestMapping(value = "/getDashboardInfo", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getDashboardInfo(@RequestBody Cloud_userModel cloud_userModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		JSONObject resJasonObj = new JSONObject();

		// ユーザID必須判定
		if (null != cloud_userModel.getUserid()) {

			try {
				// アクセス権限ユーザ一覧を取得する
				List<Integer> list = accessService.getAccessUsers(cloud_userModel.getUserid());
				// ユーザ数を設定する
				resJasonObj.put("userCount", list.size());

				// プロジェクト一覧を取得する
				List<Cloud_projectModel> projectList = cloud_projectService.getMyUnderProjects(list);
				// プロジェクト数を設定する
				resJasonObj.put("projectCount", projectList.size());

				// プロダクト数を取得する
				// プロダクト数を設定する

				// デバイス数（全部）を取得する
				// デバイス数（全部）を設定する

				// デバイス数（オンライン数）を取得する
				// デバイス数（オンライン数）を設定する

				// エラーログ数を取得する
				// エラーログ数を設定する

				// ユーザ一覧を取得する
				List<Cloud_userModel> userList = cloud_userService.getSonUsers(cloud_userModel.getUserid());
				// ユーザ一覧を設定する

				// プロダクト一覧を取得する
				// プロダクト一覧を設定する

				// エラーログ一覧を取得する
				// エラーログ一覧を設定する

			} catch (Exception e) {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0006);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0006 + "getDashboardInfo:" + e.getMessage());
				return response;
			}

		} else {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0001);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0001 + "useridが必須です。");
			return response;
		}

		response.setStatus(200);
		response.setResultCode(ErrorConstant.ERROR_CODE_0000);
		response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
		response.setData(resJasonObj.toString());
		return response;
	}


	/**
	 * リストから配列作成
	 * @param useridList List<Integer> ユーザIDのリスト
	 * @return String ユーザIDの配列
	 */
	private String getJsonListFromUseridList(List<Integer> useridList) {

		String returnStr = new String();
		returnStr = returnStr + "[";

		for (Integer userid:useridList) {
			if (returnStr.length() > 1) {
				returnStr = returnStr + ",";
			}
			// ユーザID設定
			returnStr = returnStr + userid;
		}

		returnStr = returnStr + "]";

		return returnStr;
	}
}