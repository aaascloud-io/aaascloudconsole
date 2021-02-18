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
import com.ifocus.aaascloud.model.Cloud_producttypeModel;
import com.ifocus.aaascloud.service.Cloud_producttypeService;
import com.ifocus.aaascloud.util.Util;

@Controller
public class Cloud_producttypeController {

	@Autowired
	private Cloud_producttypeService cloud_producttypeService;

	/**
	 * プロダクトタイプ一覧を取得する
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getProductTypeAll", method = RequestMethod.GET)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getProductTypeAll(@RequestBody Cloud_producttypeModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// プロダクトタイプ一覧を取得する
			List<Cloud_producttypeModel> list = cloud_producttypeService.getProductList();

			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0000);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
			response.setCount(list.size());
			response.setData(Util.getJsonString(list));

		} catch( Exception e) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0004);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + e.getMessage());
		}

		return response;
	}

}