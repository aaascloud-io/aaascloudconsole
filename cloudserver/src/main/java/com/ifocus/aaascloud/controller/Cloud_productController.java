package com.ifocus.aaascloud.controller;

import java.sql.Timestamp;
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
import com.ifocus.aaascloud.entity.Cloud_productEntity;
import com.ifocus.aaascloud.model.Cloud_productModel;
import com.ifocus.aaascloud.service.Cloud_productService;

import net.sf.json.JSONObject;

@Controller
public class Cloud_productController {

	@Autowired
	private Cloud_productService cloud_productService;

	/**
	 * プロダクト一覧を取得する
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getProductAll", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getProductAll() throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		List<Cloud_productEntity> list = cloud_productService.getProductAll();

		String responseData = new String();
		List<JSONObject> returnList = new ArrayList();
		for (Cloud_productEntity entity:list) {
			if (returnList.isEmpty()) {
				responseData = responseData + "[";
			} else {
				responseData = responseData + ",";
			}
			JSONObject resJasonObj = new JSONObject();
			// 情報設定
			resJasonObj.put("productid", entity.getProductid());
			resJasonObj.put("productcode", entity.getProductcode());
			resJasonObj.put("productname", entity.getProductname());
			resJasonObj.put("model", entity.getModel());
			resJasonObj.put("version", entity.getVersion());
			resJasonObj.put("simflag", entity.getSimflag());
			resJasonObj.put("summary", entity.getSummary());

			returnList.add(resJasonObj);
			responseData = responseData + resJasonObj.toString();

		}
		responseData = responseData + "]";

		response.setStatus(200);
		response.setResultCode("0000");
		response.setCount(list.size());
		response.setData(responseData);
		return response;
	}

	/**
	 * プロダクトを登録する
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/registerProduct", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> registerProduct(@RequestBody Cloud_productModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		Cloud_productEntity inserEntity = getCloud_productEntity(model);

		Cloud_productEntity insertedEntity =  cloud_productService.registerProduct(inserEntity);

		if (insertedEntity == null) {
			/* 異常系 */
			response.setStatus(200);
			response.setResultCode("0001");
			response.setResultMsg("登録失敗。");
		} else {

			/* 正常系：正常時、一覧を取得して返す */
			List<Cloud_productEntity> list = cloud_productService.getProductAll();

			String responseData = new String();
			List<JSONObject> returnList = new ArrayList();
			for (Cloud_productEntity entity:list) {
				if (returnList.isEmpty()) {
					responseData = responseData + "[";
				} else {
					responseData = responseData + ",";
				}
				JSONObject resJasonObj = new JSONObject();
				// 情報設定
				resJasonObj.put("productid", entity.getProductid());
				resJasonObj.put("productcode", entity.getProductcode());
				resJasonObj.put("productname", entity.getProductname());
				resJasonObj.put("model", entity.getModel());
				resJasonObj.put("version", entity.getVersion());
				resJasonObj.put("simflag", entity.getSimflag());
				resJasonObj.put("summary", entity.getSummary());

				returnList.add(resJasonObj);
				responseData = responseData + resJasonObj.toString();

			}
			responseData = responseData + "]";

			response.setStatus(200);
			response.setResultCode("0000");
			response.setCount(list.size());
			response.setData(responseData);
		}
		return response;
	}

	/**
	 * プロダクトを登録するためのEntity作成
	 * @return Cloud_productEntity
	 * @throws Exception
	 */
	public Cloud_productEntity getCloud_productEntity(Cloud_productModel model) {
		Cloud_productEntity entity = new Cloud_productEntity();

		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());
		entity.setProductcode(model.getProductcode());
		entity.setProductname(model.getProductname());
		entity.setModel(model.getModel());
		entity.setVersion(model.getVersion());
		entity.setSimflag(model.getSimflag());
		entity.setSummary(model.getSummary());
		entity.setI_uid(model.getU_uid());
		entity.setI_time(systemTime);
		entity.setU_uid(model.getU_uid());
		entity.setU_time(systemTime);

		return entity;
	}
}