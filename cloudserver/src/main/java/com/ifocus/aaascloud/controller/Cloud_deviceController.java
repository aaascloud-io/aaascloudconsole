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
import com.ifocus.aaascloud.model.Cloud_deviceDetailModel;
import com.ifocus.aaascloud.model.Cloud_deviceModel;
import com.ifocus.aaascloud.service.Cloud_deviceService;
import com.ifocus.aaascloud.service.Cloud_userService;
import com.ifocus.aaascloud.util.Util;

import net.sf.json.JSONObject;

@Controller
public class Cloud_deviceController {

	@Autowired
	private Cloud_userService cloud_userService;
	@Autowired
	private Cloud_deviceService cloud_deviceService;

	/**
	 * デバイス一覧を取得する(デバイス管理初期表示用)
	 * @param cloud_deviceModel Cloud_deviceModel デバイス情報
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCompanyDevices", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getCompanyDevices(@RequestBody Cloud_deviceModel cloud_deviceModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		// 必須チェック
		if (null != cloud_deviceModel.getLoginInfo().getLoginuserid() && null != cloud_deviceModel.getTargetUserInfo().getTargetuserid()) {

			List<Cloud_deviceModel> list = new ArrayList();
			if (cloud_deviceModel.getLoginInfo().getLoginuserid().equals(cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {
				try {
					list = cloud_deviceService.getCompanyDevices(cloud_deviceModel);
				} catch (Exception e) {
					/* 異常系 */
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0004);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_deviceService.getCompanyDevices:" + e.getMessage());
					return response;
				}
			} else {
				// 権限判断
				if (cloud_userService.isAncestor(cloud_deviceModel.getLoginInfo().getLoginuserid(), cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {
					try {
						list = cloud_deviceService.getCompanyDevices(cloud_deviceModel);
					} catch (Exception e) {
						/* 異常系 */
						response.setStatus(200);
						response.setResultCode(ErrorConstant.ERROR_CODE_0004);
						response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_deviceService.getCompanyDevices:" + e.getMessage());
						return response;
					}
				} else {
					/* 異常系 */
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0002);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0002 + "cloud_userService.isAncestor");
					return response;
				}
			}

			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0000);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
			response.setCount(list.size());
			response.setData(Util.getJsonString(list));
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
	 * デバイスを検索する(デバイス管理検索用)
	 * @param cloud_deviceModel Cloud_deviceModel デバイス情報
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/searchCompanyDevices", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> searchCompanyDevices(@RequestBody Cloud_deviceModel cloud_deviceModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		// 必須チェック
		if (null != cloud_deviceModel.getLoginInfo().getLoginuserid() && null != cloud_deviceModel.getTargetUserInfo().getTargetuserid()) {

			List<Cloud_deviceModel> list = new ArrayList();
			if (cloud_deviceModel.getLoginInfo().getLoginuserid().equals(cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {
				try {
					list = cloud_deviceService.getUnderCompanyDevicesByConditions(cloud_deviceModel);
				} catch (Exception e) {
					/* 異常系 */
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0004);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_deviceService.getUnderCompanyDevicesByConditions:" + e.getMessage());
					return response;
				}
			} else {
				// 権限判断
				if (cloud_userService.isAncestor(cloud_deviceModel.getLoginInfo().getLoginuserid(), cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {
					try {
						list = cloud_deviceService.getUnderCompanyDevicesByConditions(cloud_deviceModel);
					} catch (Exception e) {
						/* 異常系 */
						response.setStatus(200);
						response.setResultCode(ErrorConstant.ERROR_CODE_0004);
						response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_deviceService.getUnderCompanyDevicesByConditions:" + e.getMessage());
						return response;
					}
				} else {
					/* 異常系 */
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0002);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0002 + "cloud_userService.isAncestor");
					return response;
				}
			}

			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0000);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
			response.setCount(list.size());
			response.setData(Util.getJsonString(list));
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
	 * デバイス詳細を取得する
	 * @param cloud_deviceModel Cloud_deviceModel デバイス情報
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/getDeviceDetail", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getDeviceDetail(@RequestBody Cloud_deviceModel cloud_deviceModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {

			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_deviceModel.getLoginInfo().getLoginuserid(), cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {

				// デバイス詳細を取得する
				Cloud_deviceDetailModel detailModel = cloud_deviceService.getDeviceDetail(cloud_deviceModel.getDeviceid());

				if (detailModel != null) {

					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0000);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
					response.setData(Util.getJsonString(detailModel));
				} else {
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0004);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0004);
				}

			} else {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0002);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0002 + "checkAccessOK");
			}

		} catch( Exception e) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0004);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "getDeviceDetail " + e.getMessage());
		}

		return response;
	}

	/**
	 * デバイスを登録する
	 * @param cloud_deviceModel Cloud_deviceModel デバイス情報
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/registerDevice", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> registerDevice(@RequestBody Cloud_deviceModel cloud_deviceModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {

			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_deviceModel.getLoginInfo().getLoginuserid(), cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {

				// プロジェクトを更新する
				Integer deviceid = cloud_deviceService.registerDevice(cloud_deviceModel);

				if (deviceid != null) {

					String responseData = new String();
					responseData = responseData + "{";

					JSONObject resJasonObj = new JSONObject();
					// 情報設定
					resJasonObj.put("registerCount", 1);

					responseData = responseData + "}";

					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0000);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
					response.setData(responseData);
				} else {
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0100);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0100);
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
	 * デバイスを一括登録する
	 * @param cloud_deviceModel Cloud_deviceModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/registerDevices", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> registerDevices(@RequestBody Cloud_deviceModel cloud_deviceModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {

			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_deviceModel.getLoginInfo().getLoginuserid(), cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {

				// プロダクト存在チェックを行う
				List<Cloud_deviceDetailModel> productErrorList = cloud_deviceService.checkProductExistedInDB(cloud_deviceModel);

				// DB存在しないプロダクトがあれば、
				if (!productErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(productErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_CODE_0007);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0007 + "checkProductExistedInDB");
					response.setData(Util.getJsonString(productErrorList));
				}

				// プロジェクト存在チェックを行う
				List<Cloud_deviceDetailModel> projectErrorList = cloud_deviceService.checkProjectExistedInDB(cloud_deviceModel);

				// DB存在しないプロジェクトがあれば、
				if (!projectErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(projectErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_CODE_0007);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0007 + "checkProjectExistedInDB");
					response.setData(Util.getJsonString(projectErrorList));
				}

				// グループ存在チェックを行う
				List<Cloud_deviceDetailModel> groupErrorList = cloud_deviceService.checkGroupExistedInDB(cloud_deviceModel);

				// DB存在しないグループがあれば、
				if (!groupErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(groupErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_CODE_0007);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0007 + "checkGroupExistedInDB");
					response.setData(Util.getJsonString(groupErrorList));
				}

				// デバイスを一括登録する
				Integer registerCount = cloud_deviceService.registerDevices(cloud_deviceModel);

				if (registerCount != null) {

					String responseData = new String();
					responseData = responseData + "{";

					JSONObject resJasonObj = new JSONObject();
					// 情報設定
					resJasonObj.put("registerCount", registerCount);

					responseData = responseData + "}";

					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0000);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
					response.setData(responseData);
				} else {
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0100);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0100 + "registerDevices");
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
	 * デバイスを更新する
	 * @param cloud_deviceModel Cloud_deviceModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/updateDevice", method = RequestMethod.PUT)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> updateDevice(@RequestBody Cloud_deviceModel cloud_deviceModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {

			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_deviceModel.getLoginInfo().getLoginuserid(), cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {

				// デバイスを更新する
				Integer deviceid = cloud_deviceService.updateDevice(cloud_deviceModel);

				if (deviceid != null) {

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
	 * デバイスを削除する
	 * @param cloud_deviceModel Cloud_deviceModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteDevice", method = RequestMethod.DELETE)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> deleteDevice(@RequestBody Cloud_deviceModel cloud_deviceModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {

			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_deviceModel.getLoginInfo().getLoginuserid(), cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {

				// デバイスを削除する
				cloud_deviceService.deleteDevice(cloud_deviceModel);

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
			response.setResultMsg(ErrorConstant.ERROR_MSG_0102 + "deleteDevice " + e.getMessage());
		}

		return response;
	}

	/**
	 * 選択デバイスを削除する
	 * @param cloud_deviceModel Cloud_deviceModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteDevices", method = RequestMethod.DELETE)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> deleteDevices(@RequestBody Cloud_deviceModel cloud_deviceModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {

			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_deviceModel.getLoginInfo().getLoginuserid(), cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {

				// 選択デバイスを削除する
				Integer deleteCount = cloud_deviceService.deleteDevices(cloud_deviceModel.getDeviceidlist());

				String responseData = new String();
				responseData = responseData + "{";

				JSONObject resJasonObj = new JSONObject();
				// 情報設定
				resJasonObj.put("deleteCount", deleteCount);

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
			response.setResultMsg(ErrorConstant.ERROR_MSG_0102 + "deleteDevices " + e.getMessage());
		}

		return response;
	}

	/**
	 * デバイスを一括削除する
	 * @param cloud_deviceModel Cloud_deviceModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteAllCompanyDevices", method = RequestMethod.DELETE)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> deleteAllCompanyDevices(@RequestBody Cloud_deviceModel cloud_deviceModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {

			// 権限チェック
			if (cloud_userService.checkAccessOK(cloud_deviceModel.getLoginInfo().getLoginuserid(), cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {

				// デバイスを一括削除する
				Integer deleteCount = cloud_deviceService.deleteAllCompanyDevices(cloud_deviceModel);

				String responseData = new String();
				responseData = responseData + "{";

				JSONObject resJasonObj = new JSONObject();
				// 情報設定
				resJasonObj.put("deleteCount", deleteCount);

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
			response.setResultMsg(ErrorConstant.ERROR_MSG_0102 + "deleteAllCompanyDevices " + e.getMessage());
		}

		return response;
	}


	/**
	 * デバイス詳細のJsonを取得する
	 * @param model Cloud_deviceDetailModel デバイス詳細モデル
	 * @return String Json形式
	 */
	private String getDeviceDetailJsonString(Cloud_deviceDetailModel model) {

		JSONObject resJasonObj = new JSONObject();
		// 情報設定
		resJasonObj.put("deviceid", model.getDeviceid());
		resJasonObj.put("projectid", model.getProjectid());
		resJasonObj.put("groupid", model.getGroupid());
		resJasonObj.put("devicename", model.getDevicename());
		resJasonObj.put("imei", model.getImei());
		resJasonObj.put("iccid", model.getIccid());
		resJasonObj.put("sn", model.getSn());
		resJasonObj.put("sim_iccid", model.getSim_iccid());
		resJasonObj.put("sim_tel", model.getSim_tel());
		resJasonObj.put("companyid", model.getCompanyid());
		resJasonObj.put("userid", model.getUserid());
		resJasonObj.put("lastprojectId", model.getLastprojectId());
		resJasonObj.put("lastgroupid", model.getLastgroupid());
		resJasonObj.put("alive", model.getAlive());

		resJasonObj.put("productid", model.getProductid());
		resJasonObj.put("productcode", model.getProductcode());
		resJasonObj.put("productname", model.getProductname());
		resJasonObj.put("industry", model.getIndustry());

		return resJasonObj.toString();

	}

	/**
	 * デバイスリストのJsonを取得する
	 * @param list List<Cloud_deviceDetailModel>
	 * @return String Json形式
	 */
	private String getDeviceDetailsJsonString(List<Cloud_deviceDetailModel> list) {

		String responseData = new String();
		responseData = responseData + "[";
		for (Cloud_deviceDetailModel model:list) {
			if (responseData.length() > 1) {
				responseData = responseData + ",";
			}
			responseData = responseData + getDeviceDetailJsonString(model);
		}
		responseData = responseData + "]";

		return responseData;

	}

}