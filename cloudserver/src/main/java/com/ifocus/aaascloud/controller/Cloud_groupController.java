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
import com.ifocus.aaascloud.model.Cloud_groupModel;
import com.ifocus.aaascloud.service.Cloud_groupService;
import com.ifocus.aaascloud.util.Util;

@Controller
public class Cloud_groupController {

	@Autowired
	private Cloud_groupService cloud_groupService;

	/**
	 * グループ一覧を取得する
	 * @param cloud_groupModel Cloud_groupModel
	 *         groupid
	 * @return BaseHttpResponse<String> JSON形式
	 * @throws Exception
	 */
	@RequestMapping(value = "/getAllGroups", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getAllGroups(@RequestBody Cloud_groupModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		// ユーザID必須判定
		if (null != model.getLoginInfo().getLoginusername()) {

			try {
				// グループ一覧取得
				List<Cloud_groupModel> list = cloud_groupService.getGroups(model.getProjectid());

				// 正常終了
				response.setStatus(200);
				response.setCount(list.size());
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
				response.setData(Util.getJsonString(list));

			} catch (Exception e) {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0004);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "getGroups:" + e.getMessage());
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
	 * グループを検索する
	 * @param cloud_groupModel Cloud_groupModel
	 *         groupid
	 * @return BaseHttpResponse<String> JSON形式
	 * @throws Exception
	 */
	@RequestMapping(value = "/searchGroups", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> searchGroups(@RequestBody Cloud_groupModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		// ユーザID必須判定
		if (null != model.getLoginInfo().getLoginusername()) {

			try {
				// グループ検索
				List<Cloud_groupModel> list = cloud_groupService.searchGroups(model);

				// 正常終了
				response.setStatus(200);
				response.setCount(list.size());
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
				response.setData(Util.getJsonString(list));

			} catch (Exception e) {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0004);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "searchGroups:" + e.getMessage());
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
	 * グループ詳細を取得する
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getGroupDetail", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getGroupDetail(@RequestBody Cloud_groupModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// グループ詳細を取得する
			Cloud_groupModel cloud_groupModel = cloud_groupService.getGroupInfo(model);

			if (cloud_groupModel != null) {
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
				response.setData(Util.getJsonString(cloud_groupModel));
			} else {
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0004);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_groupService.getGroupInfo");
			}

		} catch( Exception e) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0004);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + e.getMessage());
		}

		return response;
	}

	/**
	 * グループを登録する
	 * @param model Cloud_groupModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/registerGroup", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> registerGroup(@RequestBody Cloud_groupModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			Cloud_groupModel insertedModel =  cloud_groupService.registerGroup(model);

			if (insertedModel == null) {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0100);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0100 + "cloud_groupService.registerGroup");
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
	 * グループを更新する
	 * @param model Cloud_groupModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/updateGroup", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> updateGroup(@RequestBody Cloud_groupModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			Cloud_groupModel updatedModel =  cloud_groupService.updateGroup(model);

			if (updatedModel == null) {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0100);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0100 + "cloud_groupService.updateGroup");
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
	 * グループを削除する
	 * @param model Cloud_groupModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteGroup", method = RequestMethod.DELETE)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> deleteGroup(@RequestBody Cloud_groupModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			 cloud_groupService.deleteGroup(model.getLoginInfo(), model.getGroupid());

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
	/**
	 * 一括グループを削除する
	 * @param model Cloud_groupModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteGroups", method = RequestMethod.DELETE)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> deleteGroups(@RequestBody Cloud_groupModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			 cloud_groupService.deleteGroups(model);

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