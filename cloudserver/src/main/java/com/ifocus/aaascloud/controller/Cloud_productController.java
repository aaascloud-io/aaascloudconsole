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
import com.ifocus.aaascloud.model.LoginInfo;
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
	@RequestMapping(value = "/getProductAll", method = RequestMethod.GET)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getProductAll(LoginInfo loginInfo) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		// 権限チェック
		if (!loginInfo.getLogincompanyid().equals(1)) {
			response.setStatus(200);
			response.setResultCode("0002");
			response.setResultMsg("権限なし：i-focusのadmin権限が必須です。");
			return response;

		}

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
	 * @param model Cloud_productModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/registerProduct", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> registerProduct(@RequestBody LoginInfo loginInfo,Cloud_productModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		Cloud_productEntity inserEntity = getCloud_productEntity(loginInfo, model);

		Cloud_productEntity insertedEntity =  cloud_productService.registerProduct(inserEntity);

		if (insertedEntity == null) {
			/* 異常系 */
			response.setStatus(200);
			response.setResultCode("0100");
			response.setResultMsg("登録失敗:cloud_product");
		} else {

			/* 正常系 */
			response.setStatus(200);
			response.setResultCode("0000");
			response.setResultMsg("登録成功。");
		}
		return response;
	}

	/**
	 * プロダクトを更新する
	 * @param model Cloud_productModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/updateProduct", method = RequestMethod.PUT)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> updateProduct(@RequestBody LoginInfo loginInfo,Cloud_productModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		Cloud_productEntity updateEntity = getCloud_productEntity(loginInfo, model);

		/* 更新するため、productidを設定する */
		if (model.getProductid() == null) {
			/* 異常系 */
			response.setStatus(200);
			response.setResultCode("0001");
			response.setResultMsg("パラメータ設定エラー：productid必須");
			return response;
		} else {
			/* 更新するため、productidを設定する */
			updateEntity.setProductid(model.getProductid());
		}

		Cloud_productEntity updatedEntity =  cloud_productService.registerProduct(updateEntity);

		if (updatedEntity == null) {
			/* 異常系 */
			response.setStatus(200);
			response.setResultCode("0101");
			response.setResultMsg("更新失敗：cloud_product");
		} else {
			/* 正常系 */
			response.setStatus(200);
			response.setResultCode("0000");
			response.setResultMsg("更新成功。");
		}
		return response;
	}

	/**
	 * プロダクトを削除する
	 * @param model Cloud_productModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteProduct", method = RequestMethod.DELETE)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> deleteProduct(@RequestBody LoginInfo loginInfo,Cloud_productModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		/* 削除するため、productidを設定する */
		if (model.getProductid() == null) {
			/* 異常系 */
			response.setStatus(200);
			response.setResultCode("0001");
			response.setResultMsg("パラメータ設定エラー：productid必須");
			return response;
		}
		/* 削除する */
		cloud_productService.deleteProduct(model.getProductid());


		/* 正常系 */
		response.setStatus(200);
		response.setResultCode("0000");
		response.setResultMsg("削除成功。");
		return response;
	}

	/**
	 * プロダクトを登録するためのEntity作成
	 * @param loginInfo LoginInfo
	 * @param model Cloud_productModel
	 * @return Cloud_productEntity
	 */
	public Cloud_productEntity getCloud_productEntity(LoginInfo loginInfo,Cloud_productModel model) {
		Cloud_productEntity entity = new Cloud_productEntity();

		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());
		entity.setProductcode(model.getProductcode());
		entity.setProductname(model.getProductname());
		entity.setModel(model.getModel());
		entity.setVersion(model.getVersion());
		entity.setSimflag(model.getSimflag());
		entity.setSummary(model.getSummary());
		entity.setI_uid(loginInfo.getLoginuserid());
		entity.setI_time(systemTime);
		entity.setU_uid(loginInfo.getLoginuserid());
		entity.setU_time(systemTime);

		return entity;
	}
}