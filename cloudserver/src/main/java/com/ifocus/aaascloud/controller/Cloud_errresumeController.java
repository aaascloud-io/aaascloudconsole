package com.ifocus.aaascloud.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ifocus.aaascloud.api.common.BaseHttpResponse;
import com.ifocus.aaascloud.constant.ErrorConstant;
import com.ifocus.aaascloud.entity.Cloud_errresumeEntity;
import com.ifocus.aaascloud.entity.Cloud_errresumeRepository;
import com.ifocus.aaascloud.model.Cloud_errlogModel;
import com.ifocus.aaascloud.model.Cloud_errresumeModel;
import com.ifocus.aaascloud.service.Cloud_errresumeService;
import com.ifocus.aaascloud.util.Util;

@Controller
public class Cloud_errresumeController {

	@Autowired
	private Cloud_errresumeService cloud_errresumeService;
	@Autowired
	private Cloud_errresumeRepository cloud_errresumeRepository;

	/**
	 * エラー処理履歴一覧情報を取得する
	 * @param cloud_userModel Cloud_userModel
	 *         userid
	 * @return BaseHttpResponse<String> JSON形式
	 * @throws Exception
	 */
	@RequestMapping(value = "/getErrResumeList", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getErrResumeList(@RequestBody Cloud_errlogModel cloud_errlogModel) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		// ユーザID必須判定
		if (null != cloud_errlogModel.getLoginInfo().getLoginusername()) {

			try {

				// エラー処理履歴一覧を取得する
				List<Cloud_errresumeModel> errresumeList = cloud_errresumeService.getErrresumeList(cloud_errlogModel.getRowid());

				/* 正常終了 */
				response.setStatus(200);
				response.setCount(errresumeList.size());					// エラー処理履歴数を設定する
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
				response.setData(Util.getJsonString(errresumeList));		// エラー処理履歴一覧を設定する

			} catch (Exception e) {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0006);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0006 + "getErrResumeList:" + e.getMessage());
				return response;
			}

		} else {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0001);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0001 + "useridが必須です。");
			return response;
		}

		return response;
	}

	/**
	 * エラー処理履歴詳細を取得する
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getErrresumeDetail", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> getErrresumeDetail(@RequestBody Cloud_errresumeModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {
			// エラー処理履歴詳細を取得する
			Cloud_errresumeModel errresumeDetail = cloud_errresumeService.getErrresumeInfo(model.getRowid());

			if (errresumeDetail != null) {
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0000);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
				response.setData(Util.getJsonString(errresumeDetail));
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
	 * エラー処理履歴を登録する
	 * @param model Cloud_errresumeModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/registerErrresume", method = RequestMethod.POST)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> registerErrresume(@RequestBody Cloud_errresumeModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		try {

			Cloud_errresumeModel insertedModel =  cloud_errresumeService.registerErrresume(model);

			if (insertedModel == null) {
				/* 異常系 */
				response.setStatus(200);
				response.setResultCode(ErrorConstant.ERROR_CODE_0100);
				response.setResultMsg(ErrorConstant.ERROR_MSG_0100 + "cloud_errresume");
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
	 * エラー処理履歴を削除する
	 * @param model Cloud_errresumeModel
	 * @return BaseHttpResponse<String>
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteErrresume", method = RequestMethod.DELETE)
	@ResponseBody
	@CrossOrigin(origins = "*", maxAge = 3600)
	public BaseHttpResponse<String> deleteErrresume(@RequestBody Cloud_errresumeModel model) throws Exception {

		BaseHttpResponse<String> response = new BaseHttpResponse<String>();

		Optional<Cloud_errresumeEntity> errresumeRow = cloud_errresumeRepository.findById(model.getRowid());

		// 権限チェック(本人限定で削除できる)
		if (errresumeRow.get().getI_uid() != model.getLoginInfo().getLoginuserid()) {
			response.setStatus(200);
			response.setResultCode(ErrorConstant.ERROR_CODE_0002);
			response.setResultMsg(ErrorConstant.ERROR_MSG_0002 + "削除できません：本人限定です。");
			return response;

		}
		try {
			/* 削除する */
			cloud_errresumeService.deleteErrresume(model);

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

}
