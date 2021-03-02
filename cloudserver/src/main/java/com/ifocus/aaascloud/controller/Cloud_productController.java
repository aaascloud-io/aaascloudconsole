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
import com.ifocus.aaascloud.constant.AliveConstant;
import com.ifocus.aaascloud.constant.ErrorConstant;
import com.ifocus.aaascloud.entity.Cloud_productEntity;
import com.ifocus.aaascloud.model.Cloud_productModel;
import com.ifocus.aaascloud.service.AccessService;
import com.ifocus.aaascloud.service.Cloud_productService;
import com.ifocus.aaascloud.util.Util;

@Controller
public class Cloud_productController {

	@Autowired
	private AccessService accessService;
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

		try {
			// アクセス権限ユーザ一覧を取得する
			List<Integer> useridlist = accessService.getAccessUsers(model.getLoginInfo().getLoginuserid());
			// マイプロダクト一覧を取得する
			List<Cloud_productModel> list = cloud_productService.getMyProductList(useridlist, model);

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

	/**
	 * プロダクトを検索する
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/searchMyProduct", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> searchMyProduct(@RequestBody Cloud_productModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// アクセス権限ユーザ一覧を取得する
			List<Integer> useridlist = accessService.getAccessUsers(model.getLoginInfo().getLoginuserid());
			// マイプロダクトを検索する
			List<Cloud_productModel> list = cloud_productService.searchMyProductList(useridlist, model);

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

		try {
			// プロダクト詳細を取得する
			Cloud_productModel cloud_productModel = cloud_productService.getProductDetail(model.getProductid());

			if (cloud_productModel != null) {
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
				response.setData(Util.getJsonString(cloud_productModel));
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

			Cloud_productEntity updateEntity = getCloud_productEntityforUpdate(model);

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
	@RequestMapping(value = "/deleteProduct", method = RequestMethod.DELETE)
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
	 * 一括プロダクトを削除する
	 * @param model Cloud_productModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteProducts", method = RequestMethod.DELETE)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> deleteProducts(@RequestBody Cloud_productModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			/* 一括削除する */
			cloud_productService.deleteProducts(model.getProductidlist());

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
		entity.setProducttypeid(model.getProducttypeid());
		entity.setProductname(model.getProductname());
		entity.setModel(model.getModel());
		entity.setVersion(model.getVersion());
		entity.setSimflag(model.getSimflag());
		entity.setSummary(model.getSummary());
		entity.setCreateuserid(model.getTargetUserInfo().getTargetuserid());
		entity.setAlive(AliveConstant.ALIVE);
		entity.setI_uid(model.getLoginInfo().getLoginuserid());
		entity.setI_time(systemTime);
		entity.setU_uid(model.getLoginInfo().getLoginuserid());
		entity.setU_time(systemTime);

		return entity;
	}

	/**
	 * プロダクトを更新するためのEntity作成
	 * @param model Cloud_productModel
	 * @return Cloud_productEntity
	 */
	private Cloud_productEntity getCloud_productEntityforUpdate(Cloud_productModel model) {
		Cloud_productEntity entity = new Cloud_productEntity();

		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());
		entity.setProductcode(model.getProductcode());
		entity.setProducttypeid(model.getProducttypeid());
		entity.setProductname(model.getProductname());
		entity.setModel(model.getModel());
		entity.setVersion(model.getVersion());
		entity.setSimflag(model.getSimflag());
		entity.setSummary(model.getSummary());
		entity.setAlive(AliveConstant.ALIVE);
		entity.setU_uid(model.getLoginInfo().getLoginuserid());
		entity.setU_time(systemTime);

		return entity;
	}

}