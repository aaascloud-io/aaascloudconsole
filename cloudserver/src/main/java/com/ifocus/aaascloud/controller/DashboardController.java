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
import com.ifocus.aaascloud.model.Cloud_productModel;
import com.ifocus.aaascloud.model.Cloud_projectModel;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.service.AccessService;
import com.ifocus.aaascloud.service.Cloud_deviceService;
import com.ifocus.aaascloud.service.Cloud_productService;
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
	@Autowired
	private Cloud_deviceService cloud_deviceService;
	@Autowired
	private Cloud_productService cloud_productService;

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

				// プロダクト一覧を取得する
				List<Cloud_productModel> productList = cloud_productService.getMyUnderProducts(list);
				// プロダクト一覧を設定する
				resJasonObj.put("productList", getJsonProductList(productList));
				// プロダクト数を設定する
				resJasonObj.put("productCount", productList.size());

				// デバイス数（全部）を取得する
				List<Cloud_deviceModel> deviceList  = cloud_deviceService.getUnderCompanyDevicesByUserids(list);
				// デバイス数（全部）を設定する
				resJasonObj.put("deviceCount", deviceList.size());

				// デバイス数（オンライン数）を取得する todo
				// デバイス数（オンライン数）を設定する
				resJasonObj.put("onlineDeviceCount", 0);

				// ユーザ一覧を取得する
				List<Cloud_userModel> userList = cloud_userService.getSonUsers(cloud_userModel.getUserid());
				// ユーザ一覧を設定する
				resJasonObj.put("userList", getJsonUserList(userList));


				// エラーログ一覧を取得する
				// エラーログ一覧を設定する
				// エラーログ数を設定する


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

	/**
	 * プロダクトリストからJson配列作成
	 * @param useridList List<Cloud_productModel> プロダクトのリスト
	 * @return String プロダクトの配列
	 */
	private String getJsonProductList(List<Cloud_productModel> productList) {

		String returnStr = new String();
		returnStr = returnStr + "[";

		for (Cloud_productModel model:productList) {
			if (returnStr.length() > 1) {
				returnStr = returnStr + ",";
			}
			// ユーザID設定
			returnStr = returnStr + getJsonProductList(model);
		}

		returnStr = returnStr + "]";

		return returnStr;
	}

	/**
	 * プロダクトからJson作成
	 * @param model Cloud_productModel プロダクトモデル
	 * @return String プロダクトJson
	 */
	private String getJsonProductList(Cloud_productModel model) {

		String returnStr = new String();
		returnStr = returnStr + "{";

		returnStr = returnStr + "productid" + ":" + model.getProductid() + ",";
		returnStr = returnStr + "productcode" + ":" + model.getProductcode() + ",";
		returnStr = returnStr + "productname" + ":" + model.getProductname() + ",";
		returnStr = returnStr + "model" + ":" + model.getModel() + ",";
		returnStr = returnStr + "version" + ":" + model.getVersion() + ",";
		returnStr = returnStr + "simflag" + ":" + model.getSimflag() + ",";
		returnStr = returnStr + "summary" + ":" + model.getSummary() + ",";
		returnStr = returnStr + "alive" + ":" + model.getAlive() ;

		returnStr = returnStr + "}";

		return returnStr;
	}

	/**
	 * ユーザリストからJson配列作成
	 * @param userList List<Cloud_userModel> ユーザのリスト
	 * @return String ユーザの配列
	 */
	private String getJsonUserList(List<Cloud_userModel> userList) {

		String returnStr = new String();
		returnStr = returnStr + "[";

		for (Cloud_userModel model:userList) {
			if (returnStr.length() > 1) {
				returnStr = returnStr + ",";
			}
			// ユーザID設定
			returnStr = returnStr + getJsonUser(model);
		}

		returnStr = returnStr + "]";

		return returnStr;
	}

	/**
	 * ユーザからJson作成
	 * @param model Cloud_userModel ユーザモデル
	 * @return String ユーザJson
	 */
	private String getJsonUser(Cloud_userModel model) {

		String returnStr = new String();
		returnStr = returnStr + "{";

		returnStr = returnStr + "userid"      + ":" + model.getUserid() + ",";
		returnStr = returnStr + "companyid"   + ":" + model.getCompanyid() + ",";
		returnStr = returnStr + "username"    + ":" + model.getUsername() + ",";
		returnStr = returnStr + "role"        + ":" + model.getRole() + ",";
		returnStr = returnStr + "upperuserid" + ":" + model.getUpperuserid() + ",";
		returnStr = returnStr + "alive"       + ":" + model.getAlive() ;

		returnStr = returnStr + "}";

		return returnStr;
	}
}