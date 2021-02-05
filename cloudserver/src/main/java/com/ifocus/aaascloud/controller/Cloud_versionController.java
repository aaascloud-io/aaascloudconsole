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
import com.ifocus.aaascloud.entity.Cloud_userRepository;
import com.ifocus.aaascloud.model.Cloud_productModel;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.model.Cloud_versionModel;
import com.ifocus.aaascloud.model.VersionModel;
import com.ifocus.aaascloud.service.AccessService;
import com.ifocus.aaascloud.service.Cloud_productService;
import com.ifocus.aaascloud.service.Cloud_versionService;
import com.ifocus.aaascloud.util.Util;

@Controller
public class Cloud_versionController {

	@Autowired
	private AccessService accessService;
	@Autowired
	private Cloud_userRepository cloud_userRepository;
	@Autowired
	private Cloud_productService cloud_productService;
	@Autowired
	private Cloud_versionService cloud_versionService;

	/**
	 * バージョン一覧を取得する
	 * @param cloud_userModel Cloud_userModel
	 *         userid
	 * @return BaseHttpResponse<String> JSON形式
	 * @throws Exception
	 */
	@RequestMapping(value = "/getVersionList", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getVersionList(@RequestBody Cloud_userModel cloud_userModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		// ユーザID必須判定
		if (null != cloud_userModel.getUsername()) {

			try {
				List<VersionModel> returnList = new ArrayList<VersionModel>();
				int count = 0;
				// プロダクト一覧取得
				List<Cloud_productModel> list = cloud_productService.getProductList();

				for (Cloud_productModel cloud_productModel:list) {
					List<Cloud_versionModel> versionList = cloud_versionService.getVersionList(cloud_productModel.getProductid());
					if (!versionList.isEmpty()) {
						VersionModel versionModel = new VersionModel(cloud_productModel);
						versionModel.versionList.addAll(versionList);
						returnList.add(versionModel);
						count = count + versionList.size();
					}
				}

				// 正常終了
				response.setStatus(200);
				response.setCount(count);
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
				response.setData(Util.getJsonString(returnList));

			} catch (Exception e) {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0004);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "getVersionList:" + e.getMessage());
				return response;
			}

		} else {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0001);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0001 + "Usernameが必須です。");
			return response;
		}

		return response;
	}

	/**
	 * バージョンを登録する
	 * @param model Cloud_versionModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/registerVersion", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> registerVersion(@RequestBody Cloud_versionModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		// OEM権限チェック
		if (!accessService.checkOEMAccess(model.getLoginInfo())) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0002);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0002 + "i-focusのadmin権限が必須です。");
			return response;

		}
		try {
			Cloud_versionModel insertedModel =  cloud_versionService.registerVersion(model);

			if (insertedModel == null) {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0100);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0100 + "cloud_version");
			} else {

				/* 正常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
			}

		} catch( Exception e) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0100);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0100 + e.getMessage());
		}
		return response;
	}

	/**
	 * バージョンを削除する
	 * @param model Cloud_versionModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteVersion", method = RequestMethod.DELETE)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> deleteVersion(@RequestBody Cloud_versionModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		// OEM権限チェック
		if (!accessService.checkOEMAccess(model.getLoginInfo())) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0002);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0002 + "i-focusのadmin権限が必須です。");
			return response;

		}
		try {
			 cloud_versionService.deleteVersion(model.getRowid());

			/* 正常系 */
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0000);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0000);

		} catch( Exception e) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_MSG_0102);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0102 + e.getMessage());
		}
		return response;
	}

}