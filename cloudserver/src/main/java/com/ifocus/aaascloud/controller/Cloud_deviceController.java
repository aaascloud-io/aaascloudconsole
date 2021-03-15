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
import com.ifocus.aaascloud.service.AccessService;
import com.ifocus.aaascloud.service.Cloud_deviceService;
import com.ifocus.aaascloud.service.Cloud_userService;
import com.ifocus.aaascloud.util.Util;

import net.sf.json.JSONObject;

@Controller
public class Cloud_deviceController {

	@Autowired
	private AccessService accessService;

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

		try {
			// トークン認証
			if (!cloud_userService.checkToken(cloud_deviceModel.getLoginInfo())) {
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

		// 必須チェック
		if (null != cloud_deviceModel.getLoginInfo().getLoginuserid() && null != cloud_deviceModel.getTargetUserInfo().getTargetuserid()) {

			List<Cloud_deviceModel> list = new ArrayList<Cloud_deviceModel>();
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
	 * デバイス一覧を取得する(デバイス管理初期表示用)
	 * @param cloud_deviceModel Cloud_deviceModel デバイス情報
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/getUnderUserDevices", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getUnderUserDevices(@RequestBody Cloud_deviceModel cloud_deviceModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// トークン認証
			if (!cloud_userService.checkToken(cloud_deviceModel.getLoginInfo())) {
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

		// 必須チェック
		if (null != cloud_deviceModel.getLoginInfo().getLoginuserid() && null != cloud_deviceModel.getTargetUserInfo().getTargetuserid()) {

			List<Cloud_deviceModel> list = new ArrayList<Cloud_deviceModel>();
			// アクセスユーザ一覧取得
			List<Integer> accessUserlist = accessService.getAccessUsers(cloud_deviceModel.getLoginInfo().getLoginuserid());

			if (cloud_deviceModel.getLoginInfo().getLoginuserid().equals(cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {
				try {

					list = cloud_deviceService.getUnderUserDevices(cloud_deviceModel, accessUserlist);
				} catch (Exception e) {
					/* 異常系 */
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0004);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_deviceService.getUnderUserDevices:" + e.getMessage());
					return response;
				}
			} else {
				// 権限判断
				if (cloud_userService.isAncestor(cloud_deviceModel.getLoginInfo().getLoginuserid(), cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {
					try {
						list = cloud_deviceService.getUnderUserDevices(cloud_deviceModel, accessUserlist);
					} catch (Exception e) {
						/* 異常系 */
						response.setStatus(200);
						response.setResultCode(ErrorConstant.ERROR_CODE_0004);
						response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_deviceService.getUnderUserDevices:" + e.getMessage());
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
			response.setData(Util.getJsonStringForSearch(list));
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
	@RequestMapping(value = "/searchUnderUserDevices", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> searchUnderUserDevices(@RequestBody Cloud_deviceModel cloud_deviceModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// トークン認証
			if (!cloud_userService.checkToken(cloud_deviceModel.getLoginInfo())) {
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

		// 必須チェック
		if (null != cloud_deviceModel.getLoginInfo().getLoginuserid() && null != cloud_deviceModel.getTargetUserInfo().getTargetuserid()) {

			// アクセスユーザ一覧取得
			List<Integer> accessUserlist = accessService.getAccessUsers(cloud_deviceModel.getLoginInfo().getLoginuserid());

			List<Cloud_deviceModel> list = new ArrayList<Cloud_deviceModel>();
			if (cloud_deviceModel.getLoginInfo().getLoginuserid().equals(cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {
				try {
					list = cloud_deviceService.getUnderUserDevicesByConditions(cloud_deviceModel, accessUserlist);
				} catch (Exception e) {
					/* 異常系 */
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0004);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_deviceService.getUnderUserDevicesByConditions:" + e.getMessage());
					return response;
				}
			} else {
				// 権限判断
				if (cloud_userService.isAncestor(cloud_deviceModel.getLoginInfo().getLoginuserid(), cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {
					try {
						list = cloud_deviceService.getUnderUserDevicesByConditions(cloud_deviceModel, accessUserlist);
					} catch (Exception e) {
						/* 異常系 */
						response.setStatus(200);
						response.setResultCode(ErrorConstant.ERROR_CODE_0004);
						response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_deviceService.getUnderUserDevicesByConditions:" + e.getMessage());
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
			response.setData(Util.getJsonStringForSearch(list));
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

		try {
			// トークン認証
			if (!cloud_userService.checkToken(cloud_deviceModel.getLoginInfo())) {
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

		// 必須チェック
		if (null != cloud_deviceModel.getLoginInfo().getLoginuserid() && null != cloud_deviceModel.getTargetUserInfo().getTargetuserid()) {

			List<Cloud_deviceModel> list = new ArrayList<Cloud_deviceModel>();
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
			response.setData(Util.getJsonStringForSearch(list));
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
	 * 自社デバイス一覧取得(デバイス選択子画面用)
	 * @param cloud_deviceModel Cloud_deviceModel デバイス情報
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/getMySelectableDevices", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getMySelectableDevices(@RequestBody Cloud_deviceModel cloud_deviceModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// トークン認証
			if (!cloud_userService.checkToken(cloud_deviceModel.getLoginInfo())) {
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

		// 必須チェック
		if (null != cloud_deviceModel.getLoginInfo().getLoginuserid() && null != cloud_deviceModel.getTargetUserInfo().getTargetuserid()) {

			List<Cloud_deviceModel> list = new ArrayList<Cloud_deviceModel>();
			if (cloud_deviceModel.getLoginInfo().getLoginuserid().equals(cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {
				try {
					list = cloud_deviceService.getMySelectableDevicesByCompanyid(cloud_deviceModel);
				} catch (Exception e) {
					/* 異常系 */
					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0004);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_deviceService.getMySelectableDevicesByCompanyid:" + e.getMessage());
					return response;
				}
			} else {
				// 権限判断
				if (cloud_userService.isAncestor(cloud_deviceModel.getLoginInfo().getLoginuserid(), cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {
					try {
						list = cloud_deviceService.getMySelectableDevicesByCompanyid(cloud_deviceModel);
					} catch (Exception e) {
						/* 異常系 */
						response.setStatus(200);
						response.setResultCode(ErrorConstant.ERROR_CODE_0004);
						response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_deviceService.getMySelectableDevicesByCompanyid:" + e.getMessage());
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
			// トークン認証
			if (!cloud_userService.checkToken(cloud_deviceModel.getLoginInfo())) {
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
			// トークン認証
			if (!cloud_userService.checkToken(cloud_deviceModel.getLoginInfo())) {
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
			if (cloud_userService.checkAccessOK(cloud_deviceModel.getLoginInfo().getLoginuserid(), cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {

				cloud_deviceModel.addDeviceDetailToDeviceDetailList();

				// プロダクト存在チェックを行う
				List<Cloud_deviceDetailModel> productErrorList = cloud_deviceService.checkProductExistedInDB(cloud_deviceModel);
				// DB存在しないプロダクトがあれば、
				if (!productErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(productErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_CODE_0007);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0007 + "checkProductExistedInDB");
					response.setData(Util.getJsonString(productErrorList));
					return response;
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
					return response;
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
					return response;
				}

				// SN存在チェックを行う
				List<Cloud_deviceDetailModel> snErrorList = cloud_deviceService.checkSnExistedInDB(cloud_deviceModel);
				// DBにすでに存在した場合、
				if (!snErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(snErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_CODE_0003);
					response.setResultMsg(ErrorConstant.ERROR_MSG_SN);
					response.setData(ErrorConstant.ERROR_CODE_SN);
					return response;
				}

				// IMEI存在チェックを行う
				List<Cloud_deviceDetailModel> imeiErrorList = cloud_deviceService.checkImeiExistedInDB(cloud_deviceModel);
				// DBにすでに存在した場合、
				if (!imeiErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(imeiErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_CODE_0003);
					response.setResultMsg(ErrorConstant.ERROR_MSG_IMEI);
					response.setData(ErrorConstant.ERROR_CODE_IMEI);
					return response;
				}

				// SIM_ICCID存在チェックを行う
				List<Cloud_deviceDetailModel> sim_iccidErrorList = cloud_deviceService.checkSim_iccidExistedInDB(cloud_deviceModel);
				// DBにすでに存在した場合、
				if (!sim_iccidErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(sim_iccidErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_CODE_0003);
					response.setResultMsg(ErrorConstant.ERROR_MSG_SIMICCID);
					response.setData(ErrorConstant.ERROR_CODE_SIMICCID);
					return response;
				}

				// SIM_IMSI存在チェックを行う
				List<Cloud_deviceDetailModel> sim_imsiErrorList = cloud_deviceService.checkSim_imsiExistedInDB(cloud_deviceModel);
				// DBにすでに存在した場合、
				if (!sim_imsiErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(sim_imsiErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_CODE_0003);
					response.setResultMsg(ErrorConstant.ERROR_MSG_SIMIMSI);
					response.setData(ErrorConstant.ERROR_CODE_SIMIMSI);
					return response;
				}

				// SIM_TEL存在チェックを行う
				List<Cloud_deviceDetailModel> sim_telErrorList = cloud_deviceService.checkSim_telExistedInDB(cloud_deviceModel);
				// DBにすでに存在した場合、
				if (!sim_telErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(sim_telErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_CODE_0003);
					response.setResultMsg(ErrorConstant.ERROR_MSG_SIMTEL);
					response.setData(ErrorConstant.ERROR_CODE_SIMTEL);
					return response;
				}

				// デバイスを登録する
				Integer deviceid = cloud_deviceService.registerDevice(cloud_deviceModel);

				if (deviceid != null) {

					response.setStatus(200);
					response.setResultCode(ErrorConstant.ERROR_CODE_0000);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
					response.setData(Util.getJsonString(deviceid));
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
			// トークン認証
			if (!cloud_userService.checkToken(cloud_deviceModel.getLoginInfo())) {
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
			if (cloud_userService.checkAccessOK(cloud_deviceModel.getLoginInfo().getLoginuserid(), cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {

				// ユーザ権限チェックを行う
				List<Cloud_deviceDetailModel> userErrorList = cloud_deviceService.checkAccessableUserId(cloud_deviceModel);
				// 権限以外のユーザが存在する場合
				if (!userErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(userErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_CODE_0002);
					response.setResultMsg(ErrorConstant.ERROR_MSG_USER_ACCESS);
					response.setData(Util.getJsonString(userErrorList));
					return response;
				}

				// プロダクト存在チェックを行う
				List<Cloud_deviceDetailModel> productErrorList = cloud_deviceService.checkProductExistedInDB(cloud_deviceModel);
				// DB存在しないプロダクトがあれば、
				if (!productErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(productErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_CODE_0007);
					response.setResultMsg(ErrorConstant.ERROR_MSG_PRODUCT);
					response.setData(Util.getJsonString(productErrorList));
					return response;
				}

				// プロジェクト存在チェックを行う
				List<Cloud_deviceDetailModel> projectErrorList = cloud_deviceService.checkProjectExistedInDB(cloud_deviceModel);
				// DB存在しないプロジェクトがあれば、
				if (!projectErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(projectErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_CODE_0007);
					response.setResultMsg(ErrorConstant.ERROR_MSG_PROJECT);
					response.setData(Util.getJsonString(projectErrorList));
					return response;
				}

				// グループ存在チェックを行う
				List<Cloud_deviceDetailModel> groupErrorList = cloud_deviceService.checkGroupExistedInDB(cloud_deviceModel);
				// DB存在しないグループがあれば、
				if (!groupErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(groupErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_CODE_0007);
					response.setResultMsg(ErrorConstant.ERROR_MSG_GROUP);
					response.setData(Util.getJsonString(groupErrorList));
					return response;
				}

				// SN存在チェックを行う
				List<Cloud_deviceDetailModel> snErrorList = cloud_deviceService.checkSnExistedInDB(cloud_deviceModel);
				// DBにすでに存在した場合、
				if (!snErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(snErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_MSG_0003);
					response.setResultMsg(ErrorConstant.ERROR_MSG_SN);
					response.setData(Util.getJsonString(snErrorList));
					return response;
				}

				// IMEI存在チェックを行う
				List<Cloud_deviceDetailModel> imeiErrorList = cloud_deviceService.checkImeiExistedInDB(cloud_deviceModel);
				// DBにすでに存在した場合、
				if (!imeiErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(imeiErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_MSG_0003);
					response.setResultMsg(ErrorConstant.ERROR_MSG_IMEI);
					response.setData(Util.getJsonString(imeiErrorList));
					return response;
				}

				// SIM_ICCID存在チェックを行う
				List<Cloud_deviceDetailModel> sim_iccidErrorList = cloud_deviceService.checkSim_iccidExistedInDB(cloud_deviceModel);
				// DBにすでに存在した場合、
				if (!sim_iccidErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(sim_iccidErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_MSG_0003);
					response.setResultMsg(ErrorConstant.ERROR_MSG_SIMICCID);
					response.setData(Util.getJsonString(sim_iccidErrorList));
					return response;
				}

				// SIM_IMSI存在チェックを行う
				List<Cloud_deviceDetailModel> sim_imsiErrorList = cloud_deviceService.checkSim_imsiExistedInDB(cloud_deviceModel);
				// DBにすでに存在した場合、
				if (!sim_imsiErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(sim_imsiErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_MSG_0003);
					response.setResultMsg(ErrorConstant.ERROR_MSG_SIMIMSI);
					response.setData(Util.getJsonString(sim_imsiErrorList));
					return response;
				}

				// SIM_TEL存在チェックを行う
				List<Cloud_deviceDetailModel> sim_telErrorList = cloud_deviceService.checkSim_telExistedInDB(cloud_deviceModel);
				// DBにすでに存在した場合、
				if (!sim_telErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(sim_telErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_MSG_0003);
					response.setResultMsg(ErrorConstant.ERROR_MSG_SIMTEL);
					response.setData(Util.getJsonString(sim_telErrorList));
					return response;
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
	 * デバイスをチェックする
	 * @param cloud_deviceModel Cloud_deviceModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/checkDevices", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> checkDevices(@RequestBody Cloud_deviceModel cloud_deviceModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// トークン認証
			if (!cloud_userService.checkToken(cloud_deviceModel.getLoginInfo())) {
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
			if (cloud_userService.checkAccessOK(cloud_deviceModel.getLoginInfo().getLoginuserid(), cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {

				// SN存在チェックを行う
				List<Cloud_deviceDetailModel> snErrorList = cloud_deviceService.checkSnExistedInDB(cloud_deviceModel);
				// DBにすでに存在した場合、
				if (!snErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(snErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_CODE_0007);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0007 + "checkSnExistedInDB");
					response.setData(Util.getJsonString(snErrorList));
					return response;
				}

				// IMEI存在チェックを行う
				List<Cloud_deviceDetailModel> imeiErrorList = cloud_deviceService.checkImeiExistedInDB(cloud_deviceModel);
				// DBにすでに存在した場合、
				if (!imeiErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(imeiErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_CODE_0007);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0007 + "checkImeiExistedInDB");
					response.setData(Util.getJsonString(imeiErrorList));
					return response;
				}

				// SIM_IMSI存在チェックを行う
				List<Cloud_deviceDetailModel> sim_imsiErrorList = cloud_deviceService.checkSim_imsiExistedInDB(cloud_deviceModel);
				// DBにすでに存在した場合、
				if (!sim_imsiErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(sim_imsiErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_CODE_0007);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0007 + "checkSim_imsiExistedInDB");
					response.setData(Util.getJsonString(sim_imsiErrorList));
					return response;
				}

				// SIM_ICCID存在チェックを行う
				List<Cloud_deviceDetailModel> sim_iccidErrorList = cloud_deviceService.checkSim_iccidExistedInDB(cloud_deviceModel);
				// DBにすでに存在した場合、
				if (!sim_iccidErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(sim_iccidErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_CODE_0007);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0007 + "checkSim_iccidExistedInDB");
					response.setData(Util.getJsonString(sim_iccidErrorList));
					return response;
				}

				// SIM_TEL存在チェックを行う
				List<Cloud_deviceDetailModel> sim_telErrorList = cloud_deviceService.checkSim_telExistedInDB(cloud_deviceModel);
				// DBにすでに存在した場合、
				if (!sim_telErrorList.isEmpty()) {

					response.setStatus(200);
					response.setCount(sim_telErrorList.size());
					response.setResultCode(ErrorConstant.ERROR_CODE_0007);
					response.setResultMsg(ErrorConstant.ERROR_MSG_0007 + "checkSim_telExistedInDB");
					response.setData(Util.getJsonString(sim_telErrorList));
					return response;
				}

				// 正常終了
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
			// トークン認証
			if (!cloud_userService.checkToken(cloud_deviceModel.getLoginInfo())) {
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
			if (cloud_userService.checkAccessOK(cloud_deviceModel.getLoginInfo().getLoginuserid(), cloud_deviceModel.getTargetUserInfo().getTargetuserid())) {

				// 更新前デバイス取得
				Cloud_deviceDetailModel oldDevice = cloud_deviceService.getDeviceDetail(cloud_deviceModel.getDeviceDetail().getDeviceid());
				// チェック準備
				cloud_deviceModel.addDeviceDetailToDeviceDetailList();

				if (cloud_deviceModel.getDeviceDetail().getSim_iccid() != null && !cloud_deviceModel.getDeviceDetail().getSim_iccid().equals(oldDevice.getSim_iccid())) {

					// SIM_ICCID存在チェックを行う
					List<Cloud_deviceDetailModel> sim_iccidErrorList = cloud_deviceService.checkSim_iccidExistedInDB(cloud_deviceModel);
					// DBにすでに存在した場合、
					if (!sim_iccidErrorList.isEmpty()) {

						response.setStatus(200);
						response.setCount(sim_iccidErrorList.size());
						response.setResultCode(ErrorConstant.ERROR_CODE_0007);
						response.setResultMsg(ErrorConstant.ERROR_MSG_SIMICCID);
						response.setData(ErrorConstant.ERROR_CODE_SIMICCID);
						return response;
					}
				}

				if (cloud_deviceModel.getDeviceDetail().getSim_imsi() != null && !cloud_deviceModel.getDeviceDetail().getSim_imsi().equals(oldDevice.getSim_imsi())) {


					// SIM_IMSI存在チェックを行う
					List<Cloud_deviceDetailModel> sim_imsiErrorList = cloud_deviceService.checkSim_imsiExistedInDB(cloud_deviceModel);
					// DBにすでに存在した場合、
					if (!sim_imsiErrorList.isEmpty()) {

						response.setStatus(200);
						response.setCount(sim_imsiErrorList.size());
						response.setResultCode(ErrorConstant.ERROR_CODE_0007);
						response.setResultMsg(ErrorConstant.ERROR_MSG_SIMIMSI);
						response.setData(ErrorConstant.ERROR_CODE_SIMIMSI);
						return response;
					}
				}

				if (cloud_deviceModel.getDeviceDetail().getSim_tel() != null && !cloud_deviceModel.getDeviceDetail().getSim_tel().equals(oldDevice.getSim_tel())) {

					// SIM_TEL存在チェックを行う
					List<Cloud_deviceDetailModel> sim_telErrorList = cloud_deviceService.checkSim_telExistedInDB(cloud_deviceModel);
					// DBにすでに存在した場合、
					if (!sim_telErrorList.isEmpty()) {

						response.setStatus(200);
						response.setCount(sim_telErrorList.size());
						response.setResultCode(ErrorConstant.ERROR_CODE_0007);
						response.setResultMsg(ErrorConstant.ERROR_MSG_SIMTEL);
						response.setData(ErrorConstant.ERROR_CODE_SIMTEL);
						return response;
					}
				}

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
			// トークン認証
			if (!cloud_userService.checkToken(cloud_deviceModel.getLoginInfo())) {
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
			// トークン認証
			if (!cloud_userService.checkToken(cloud_deviceModel.getLoginInfo())) {
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
			// トークン認証
			if (!cloud_userService.checkToken(cloud_deviceModel.getLoginInfo())) {
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

}