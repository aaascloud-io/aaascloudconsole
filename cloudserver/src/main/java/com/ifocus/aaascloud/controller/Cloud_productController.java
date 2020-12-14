package com.ifocus.aaascloud.controller;

import java.sql.Timestamp;
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
	public BaseHttpResponse<String> getProductAll(@RequestBody Cloud_productModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		// 権限チェック
		if (!model.getLoginInfo().getLogincompanyid().equals(1)) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0002);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0002 + "i-focusのadmin権限が必須です。");
			return response;

		}
		try {
			// プロダクト一覧を取得する
			List<Cloud_productEntity> list = cloud_productService.getProductAll();

			String responseData = new String();
			responseData = responseData + "[";
			for (Cloud_productEntity entity:list) {
				if (responseData.length() > 1) {
					responseData = responseData + ",";
				}
				responseData = responseData + cloud_productService.getProductDetail(entity.getProductid());
			}
			responseData = responseData + "]";

			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0000);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
			response.setCount(list.size());
			response.setData(responseData);

		} catch( Exception e) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0004);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + e.getMessage());
		}

		return response;
	}

	/**
	 * プロダクト詳細を取得する
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getProductDetail", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getProductDetail(@RequestBody Cloud_productModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		// 権限チェック
		if (!model.getLoginInfo().getLogincompanyid().equals(1)) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0002);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0002 + "i-focusのadmin権限が必須です。");
			return response;

		}
		try {
			// プロダクト詳細を取得する
			Cloud_productEntity entity = cloud_productService.getProductDetail(model.getProductid());

			if (entity != null) {
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
				response.setData(this.getJsonFromCloud_productEntity(entity));
			} else {
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0004);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0004);
			}

		} catch( Exception e) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0004);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + e.getMessage());
		}

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
	public BaseHttpResponse<String> registerProduct(@RequestBody Cloud_productModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			Cloud_productEntity inserEntity = getCloud_productEntity(model);

			Cloud_productEntity insertedEntity =  cloud_productService.registerProduct(inserEntity);

			if (insertedEntity == null) {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0100);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0100 + "cloud_product");
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
	 * プロダクトを更新する
	 * @param model Cloud_productModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/updateProduct", method = RequestMethod.PUT)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> updateProduct(@RequestBody Cloud_productModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {

			Cloud_productEntity updateEntity = getCloud_productEntity(model);

			/* 更新するため、productidを設定する */
			if (model.getProductid() == null) {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0001);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0001 + "productid必須");
				return response;
			} else {
				/* 更新するため、productidを設定する */
				updateEntity.setProductid(model.getProductid());
			}

			Cloud_productEntity updatedEntity =  cloud_productService.registerProduct(updateEntity);

			if (updatedEntity == null) {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0101);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0101 + "cloud_product");
			} else {
				/* 正常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
			}

		} catch( Exception e) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0101);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0101 + e.getMessage());
		}

		return response;
	}

	/**
	 * プロダクトを削除する
	 * @param model Cloud_productModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteProduct", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> deleteProduct(@RequestBody Cloud_productModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			/* 削除するため、productidを設定する */
			if (model.getProductid() == null) {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0001);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0001 + "productid必須");
				return response;
			}
			/* 削除する */
			cloud_productService.deleteProduct(model.getProductid());


			/* 正常系 */
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0000);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0000);

		} catch( Exception e) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0102);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0102 + e.getMessage());
		}
		return response;
	}

	/**
	 * プロダクトを登録するためのEntity作成
	 * @param model Cloud_productModel
	 * @return Cloud_productEntity
	 */
	private Cloud_productEntity getCloud_productEntity(Cloud_productModel model) {
		Cloud_productEntity entity = new Cloud_productEntity();

		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());
		entity.setProductcode(model.getProductcode());
		entity.setProductname(model.getProductname());
		entity.setModel(model.getModel());
		entity.setVersion(model.getVersion());
		entity.setSimflag(model.getSimflag());
		entity.setSummary(model.getSummary());
		entity.setAlive(0);						// セロ固定
		entity.setI_uid(model.getLoginInfo().getLoginuserid());
		entity.setI_time(systemTime);
		entity.setU_uid(model.getLoginInfo().getLoginuserid());
		entity.setU_time(systemTime);

		return entity;
	}

	/**
	 * プロダクトのEntityからJson作成
	 * @param entity Cloud_productEntity
	 * @return String Json形式
	 */
	private String getJsonFromCloud_productEntity(Cloud_productEntity entity) {

		if (entity == null ) {
			return "";
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

		return resJasonObj.toString();
	}

}