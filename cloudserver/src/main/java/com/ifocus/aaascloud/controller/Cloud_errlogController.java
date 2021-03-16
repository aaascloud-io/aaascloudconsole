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
import com.ifocus.aaascloud.entity.Cloud_userEntity;
import com.ifocus.aaascloud.entity.Cloud_userRepository;
import com.ifocus.aaascloud.model.Cloud_deviceModel;
import com.ifocus.aaascloud.model.Cloud_errlogModel;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.service.AccessService;
import com.ifocus.aaascloud.service.Cloud_deviceService;
import com.ifocus.aaascloud.service.Cloud_errlogService;
import com.ifocus.aaascloud.service.Cloud_userService;
import com.ifocus.aaascloud.util.Util;

@Controller
public class Cloud_errlogController {

	@Autowired
	private Cloud_userRepository cloud_userRepository;

	@Autowired
	private AccessService accessService;
	@Autowired
	private Cloud_deviceService cloud_deviceService;
	@Autowired
	private Cloud_errlogService cloud_errlogService;
	@Autowired
	private Cloud_userService cloud_userService;

	/**
	 * エラーログ一覧情報を取得する
	 * @param cloud_userModel Cloud_userModel
	 *         userid
	 * @return BaseHttpResponse<String> JSON形式
	 * @throws Exception
	 */
	@RequestMapping(value = "/getErrlogList", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getErrlogList(@RequestBody Cloud_userModel cloud_userModel) throws Exception {

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

		// ユーザID必須判定
		if (null != cloud_userModel.getLoginInfo().getLoginusername()) {

			try {
				// ログインユーザ取得
				Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername(cloud_userModel.getLoginInfo().getLoginusername());

				// アクセス権限ユーザ一覧を取得する
				List<Integer> list = accessService.getAccessUsers(loginUserEntity.getUserid());

				// デバイス数（全部）を取得する
				List<Cloud_deviceModel> deviceList  = cloud_deviceService.getUnderCompanyDevicesByUserids(list);

				// エラーログ一覧を取得する
				List<Cloud_errlogModel> errlogList = cloud_errlogService.getErrlogList(list,Util.getImeiList(deviceList),Util.getSnList(deviceList));

				/* 正常終了 */
				response.setStatus(200);
				response.setCount(errlogList.size());					// エラーログ数を設定する
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
				response.setData(Util.getJsonString(errlogList));		// エラーログ一覧を設定する

			} catch (Exception e) {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0006);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0006 + "getErrlogList:" + e.getMessage());
				return response;
			}

		} else {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0001);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0001 + "ログインユーザ情報が必須です。");
			return response;
		}

		return response;
	}

}
