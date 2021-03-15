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
import com.ifocus.aaascloud.model.Cloud_companyModel;
import com.ifocus.aaascloud.service.Cloud_companyService;
import com.ifocus.aaascloud.service.Cloud_userService;
import com.ifocus.aaascloud.util.Util;

@Controller
public class Cloud_companyController {

	@Autowired
	private Cloud_companyService cloud_companyService;
	@Autowired
	private Cloud_userService cloud_userService;

	/**
	 * 配下会社一覧を取得する
	 * @param json
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getUnderCompanies", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getUnderCompanies(@RequestBody Cloud_companyModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// トークン認証
			if (!cloud_userService.checkToken(model.getLoginInfo())) {
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
			List<Cloud_companyModel> list = cloud_companyService.getUnderCompanies(model.getLoginInfo().getLoginuserid());
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0000);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
			response.setCount(list.size());
			response.setData(Util.getJsonString(list));

		} catch (Exception e) {
			/* 異常系 */
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0004);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_companyService.getUnderCompanies:" + e.getMessage());
			return response;
		}

		return response;
	}

	/**
	 * 配下会社一覧を取得する(本社と一層子会社)
	 * @param json
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getMyUnderCompanies", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getMyUnderCompanies(@RequestBody Cloud_companyModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// トークン認証
			if (!cloud_userService.checkToken(model.getLoginInfo())) {
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
			List<Cloud_companyModel> list = cloud_companyService.getMyUnderCompanies(model.getLoginInfo().getLoginuserid());
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0000);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
			response.setCount(list.size());
			response.setData(Util.getJsonString(list));

		} catch (Exception e) {
			/* 異常系 */
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0004);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_companyService.getUnderCompanies:" + e.getMessage());
			return response;
		}

		return response;
	}

}