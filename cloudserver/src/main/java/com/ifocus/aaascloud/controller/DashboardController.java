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
import com.ifocus.aaascloud.entity.Cloud_companyEntity;
import com.ifocus.aaascloud.entity.Cloud_companyRepository;
import com.ifocus.aaascloud.entity.Cloud_userEntity;
import com.ifocus.aaascloud.entity.Cloud_userRepository;
import com.ifocus.aaascloud.model.Cloud_deviceModel;
import com.ifocus.aaascloud.model.Cloud_errlogModel;
import com.ifocus.aaascloud.model.Cloud_productModel;
import com.ifocus.aaascloud.model.Cloud_projectModel;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.model.DashboardModel;
import com.ifocus.aaascloud.model.UserModel;
import com.ifocus.aaascloud.service.AccessService;
import com.ifocus.aaascloud.service.Cloud_deviceService;
import com.ifocus.aaascloud.service.Cloud_errlogService;
import com.ifocus.aaascloud.service.Cloud_productService;
import com.ifocus.aaascloud.service.Cloud_projectService;
import com.ifocus.aaascloud.service.Cloud_userService;
import com.ifocus.aaascloud.util.Util;

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
	@Autowired
	private Cloud_errlogService cloud_errlogService;

	@Autowired
	private Cloud_companyRepository cloud_companyRepository;
	@Autowired
	private Cloud_userRepository cloud_userRepository;

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

		DashboardModel dashboardModel = new DashboardModel();

		// ユーザID必須判定
		if (null != cloud_userModel.getUsername()) {

			try {

				// ログインユーザ取得
				Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername(cloud_userModel.getUsername());

				// アクセス権限ユーザ一覧を取得する
				List<Integer> list = accessService.getAccessUsers(loginUserEntity.getUserid());
				// ユーザ数を設定する
				dashboardModel.setUserCount(list.size());

				// プロジェクト一覧を取得する
				List<Cloud_projectModel> projectList = cloud_projectService.getMyUnderProjects(list);
				// プロジェクト数を設定する
				dashboardModel.setProjectCount(projectList.size());

				// プロダクト一覧を取得する
				List<Cloud_productModel> productList = cloud_productService.getMyUnderProducts(list);
				// プロダクト一覧を設定する
				dashboardModel.setProductList(productList);
				// プロダクト数を設定する
				dashboardModel.setProductCount(productList.size());

				// デバイス数（全部）を取得する
				List<Cloud_deviceModel> deviceList  = cloud_deviceService.getUnderCompanyDevicesByUserids(list);
				// デバイス数（全部）を設定する
				dashboardModel.setDeviceCount(deviceList.size());

				// デバイス数（オンライン数）を取得する todo
				// デバイス数（オンライン数）を設定する
				dashboardModel.setOnlineDeviceCount(0);

				// ユーザ一覧を取得する
				List<Cloud_userEntity> userList = (List<Cloud_userEntity>) cloud_userRepository.findAllById(list);

				List<Cloud_userModel> cloud_userModelList =cloud_userService.getModelsByEntitys(userList);
				List<UserModel> userModelList = new ArrayList();

				for (Cloud_userModel model:cloud_userModelList) {

					// プロファイルを取得する
					UserModel userModel = Util.getUserModel(model);
					if (userModel != null) {
						// 会社情報を取得する
						Optional<Cloud_companyEntity> company = cloud_companyRepository.findById(model.getCompanyid());
						// 会社情報を設定する
						userModel.setCompanyname(company.get().getCompanyname());
						// リストに追加
						userModelList.add(userModel);
					}

				}
				// ユーザ一覧を設定する
				dashboardModel.setUserList(userModelList);

				// エラーログ一覧を取得する
				List<Cloud_errlogModel> errlogList = cloud_errlogService.getErrlogList(list,Util.getImeiList(deviceList),Util.getSnList(deviceList));
				// エラーログ一覧を設定する
				dashboardModel.setErrlogList(errlogList);
				// エラーログ数を設定する
				dashboardModel.setErrlogCount(errlogList.size());

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
			response.setResultMsg(ErrorConstant.ERROR_MSG_0001 + "usernameが必須です。");
			return response;
		}

		response.setStatus(200);
		response.setResultCode(ErrorConstant.ERROR_CODE_0000);
		response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
		response.setData(Util.getJsonString(dashboardModel));
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

	/**
	 * エラーログリストからJson配列作成
	 * @param errlogList List<Cloud_errlogModel> エラーログのリスト
	 * @return String エラーログのJSON配列
	 */
	private String getJsonErrlogList(List<Cloud_errlogModel> errlogList) {

		String returnStr = new String();
		returnStr = returnStr + "[";

		for (Cloud_errlogModel model:errlogList) {
			if (returnStr.length() > 1) {
				returnStr = returnStr + ",";
			}
			// エラーログ設定
			returnStr = returnStr + getJsonErrlog(model);
		}

		returnStr = returnStr + "]";

		return returnStr;
	}

	/**
	 * エラーログからJson作成
	 * @param model Cloud_errlogModel エラーログモデル
	 * @return String エラーログJson
	 */
	private String getJsonErrlog(Cloud_errlogModel model) {

		String returnStr = new String();
		returnStr = returnStr + "{";

		returnStr = returnStr + "rowid"       + ":" + model.getRowid() + ",";
		returnStr = returnStr + "userid"      + ":" + model.getUserid() + ",";
		returnStr = returnStr + "device"      + ":" + model.getDevice() + ",";
		returnStr = returnStr + "statusflag"  + ":" + model.getStatusflag() + ",";
		returnStr = returnStr + "datatime"    + ":" + model.getDatatime() + ",";
		returnStr = returnStr + "systemsort"  + ":" + model.getSystemsort() + ",";
		returnStr = returnStr + "systemid"    + ":" + model.getSystemid() + ",";
		returnStr = returnStr + "componentid" + ":" + model.getComponentid() + ",";
		returnStr = returnStr + "messageid"   + ":" + model.getMessageid() + ",";
		returnStr = returnStr + "messagesort" + ":" + model.getMessagesort() + ",";
		returnStr = returnStr + "errcode"     + ":" + model.getErrcode() + ",";
		returnStr = returnStr + "errMessage"  + ":" + model.getErrMessage() + ",";
		returnStr = returnStr + "alive"       + ":" + model.getAlive() ;

		returnStr = returnStr + "}";

		return returnStr;
	}

}