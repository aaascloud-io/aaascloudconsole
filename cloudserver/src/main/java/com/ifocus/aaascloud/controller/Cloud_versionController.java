package com.ifocus.aaascloud.controller;

import java.util.List;
import java.util.Objects;

import com.ifocus.aaascloud.exception.BusinessException;
import com.ifocus.aaascloud.exception.ValidationException;
import com.ifocus.aaascloud.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ifocus.aaascloud.api.common.BaseHttpResponse;
import com.ifocus.aaascloud.constant.ErrorConstant;
import com.ifocus.aaascloud.model.Cloud_versionModel;
import com.ifocus.aaascloud.service.AccessService;
import com.ifocus.aaascloud.service.Cloud_userService;
import com.ifocus.aaascloud.service.Cloud_versionService;
import com.ifocus.aaascloud.util.Util;

@Controller
public class Cloud_versionController {

    @Autowired
    private Cloud_userService cloud_userService;
    @Autowired
    private AccessService accessService;
    @Autowired
    private Cloud_versionService cloud_versionService;


    /**
     * バージョンを検索する
     *
     * @param model Cloud_versionModel
     * @return BaseHttpResponse<List < Cloud_versionModel>> JSON形式
     */
    @RequestMapping(value = "/searchVersions", method = RequestMethod.POST)
    @ResponseBody
    @CrossOrigin(origins = "*", maxAge = 3600)
    public BaseHttpResponse<List<Cloud_versionModel>> searchVersions(@RequestBody Cloud_versionModel model) {
        BaseHttpResponse<List<Cloud_versionModel>> response = new BaseHttpResponse<>();

        // トークン認証
        if (!cloud_userService.checkToken(model.getLoginInfo())) {
            throw new BusinessException(ErrorConstant.ERROR_CODE_0300, ErrorConstant.ERROR_MSG_0300);
        }

        // OEM権限チェック
        if (!accessService.checkOEMAccess(model.getLoginInfo())) {
            throw new BusinessException(ErrorConstant.ERROR_CODE_0002, ErrorConstant.ERROR_MSG_0002 + "i-focusのadmin権限が必須です。");
        }

        // ユーザID必須判定
        if (StringUtil.isEmpty(model.getLoginInfo().getLoginusername())) {
            throw new ValidationException(ErrorConstant.ERROR_CODE_0001,
                    ErrorConstant.ERROR_MSG_0001 + "usernameが必須です。");
        }

        // バージョン検索
        List<Cloud_versionModel> list = cloud_versionService.searchVersions(model);

        // 正常終了
        response.setStatus(200);
        response.setCount(list.size());
        response.setResultCode(ErrorConstant.ERROR_CODE_0000);
        response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
        response.setData(list);
        return response;
    }

    /**
     * バージョンを登録する
     *
     * @param model Cloud_versionModel
     * @return BaseHttpResponse<String>
     * @throws Exception
     */
    @RequestMapping(value = "/registerVersion", method = RequestMethod.POST)
    @ResponseBody
    @CrossOrigin(origins = "*", maxAge = 3600)
    public BaseHttpResponse<String> registerVersion(@RequestBody Cloud_versionModel model) {
        BaseHttpResponse<String> response = new BaseHttpResponse<>();

        // トークン認証
        if (!cloud_userService.checkToken(model.getLoginInfo())) {
            throw new BusinessException(ErrorConstant.ERROR_CODE_0300, ErrorConstant.ERROR_MSG_0300);
        }

        // OEM権限チェック
        if (!accessService.checkOEMAccess(model.getLoginInfo())) {
            throw new BusinessException(ErrorConstant.ERROR_CODE_0002, ErrorConstant.ERROR_MSG_0002 + "i-focusのadmin権限が必須です。");
        }

        // 登録処理
        Cloud_versionModel insertedModel = cloud_versionService.registerVersion(model);
        if (Objects.isNull(insertedModel)) {
            /* 異常系 */
            throw new BusinessException(ErrorConstant.ERROR_CODE_0100, ErrorConstant.ERROR_MSG_0100 + "cloud_version");
        }

        /* 正常系 */
        response.setStatus(200);
        response.setResultCode(ErrorConstant.ERROR_CODE_0000);
        response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
        return response;
    }

    /**
     * バージョンを更新する
     *
     * @param model Cloud_versionModel
     * @return BaseHttpResponse<String>
     */
    @RequestMapping(value = "/updateVersion", method = RequestMethod.POST)
    @ResponseBody
    @CrossOrigin(origins = "*", maxAge = 3600)
    public BaseHttpResponse<String> updateVersion(@RequestBody Cloud_versionModel model) {
        BaseHttpResponse<String> response = new BaseHttpResponse<>();

        // トークン認証
        if (!cloud_userService.checkToken(model.getLoginInfo())) {
            throw new BusinessException(ErrorConstant.ERROR_CODE_0300, ErrorConstant.ERROR_MSG_0300);
        }

        // OEM権限チェック
        if (!accessService.checkOEMAccess(model.getLoginInfo())) {
            throw new BusinessException(ErrorConstant.ERROR_CODE_0002, ErrorConstant.ERROR_MSG_0002 + "i-focusのadmin権限が必須です。");
        }

        // 更新処理
        Cloud_versionModel updatedModel = cloud_versionService.updateVersion(model);
        if (Objects.isNull(updatedModel)) {
            /* 異常系 */
            throw new BusinessException(ErrorConstant.ERROR_CODE_0100, ErrorConstant.ERROR_MSG_0100 + "cloud_versionService.updateVersion");
        }

        /* 正常系 */
        response.setStatus(200);
        response.setResultCode(ErrorConstant.ERROR_CODE_0000);
        response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
        return response;
    }

    /**
     * バージョンを削除する
     *
     * @param model Cloud_versionModel
     * @return BaseHttpResponse<String>
     */
    @RequestMapping(value = "/deleteVersion", method = RequestMethod.DELETE)
    @ResponseBody
    @CrossOrigin(origins = "*", maxAge = 3600)
    public BaseHttpResponse<String> deleteVersion(@RequestBody Cloud_versionModel model) {
        BaseHttpResponse<String> response = new BaseHttpResponse<>();

        // トークン認証
        if (!cloud_userService.checkToken(model.getLoginInfo())) {
            throw new BusinessException(ErrorConstant.ERROR_CODE_0300, ErrorConstant.ERROR_MSG_0300);
        }

        // OEM権限チェック
        if (!accessService.checkOEMAccess(model.getLoginInfo())) {
            throw new BusinessException(ErrorConstant.ERROR_CODE_0002, ErrorConstant.ERROR_MSG_0002 + "i-focusのadmin権限が必須です。");
        }

        // 削除処理
        cloud_versionService.deleteVersion(model.getLoginInfo(), model.getRowid());
        /* 正常系 */
        response.setStatus(200);
        response.setResultCode(ErrorConstant.ERROR_CODE_0000);
        response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
        return response;
    }

    /**
     * 一括バージョンを削除する
     *
     * @param model Cloud_versionModel
     * @return BaseHttpResponse<String>
     */
    @RequestMapping(value = "/deleteVersions", method = RequestMethod.DELETE)
    @ResponseBody
    @CrossOrigin(origins = "*", maxAge = 3600)
    public BaseHttpResponse<String> deleteAll(@RequestBody Cloud_versionModel model) {
        BaseHttpResponse<String> response = new BaseHttpResponse<>();

        // トークン認証
        if (!cloud_userService.checkToken(model.getLoginInfo())) {
            throw new BusinessException(ErrorConstant.ERROR_CODE_0300, ErrorConstant.ERROR_MSG_0300);
        }

        // OEM権限チェック
        if (!accessService.checkOEMAccess(model.getLoginInfo())) {
            throw new BusinessException(ErrorConstant.ERROR_CODE_0002, ErrorConstant.ERROR_MSG_0002 + "i-focusのadmin権限が必須です。");
        }

        // 削除処理
        cloud_versionService.deleteVersions(model.getLoginInfo(), model.getRowidlist());

        /* 正常系 */
        response.setStatus(200);
        response.setResultCode(ErrorConstant.ERROR_CODE_0000);
        response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
        return response;
    }


    //////////////////////////////////// 使用されていなかった　////////////////////////////////////

    /**
     * バージョン一覧を取得する
     *
     * @param cloud_versionModel Cloud_versionModel
     *                           versionid
     * @return BaseHttpResponse<String> JSON形式
     * @throws Exception
     */
    @RequestMapping(value = "/getAllVersions", method = RequestMethod.POST)
    @ResponseBody
    @CrossOrigin(origins = "*", maxAge = 3600)
    public BaseHttpResponse<String> getAllVersions(@RequestBody Cloud_versionModel model) throws Exception {

        BaseHttpResponse<String> response = new BaseHttpResponse<String>();

        try {
            // トークン認証
            if (!cloud_userService.checkToken(model.getLoginInfo())) {
                response.setStatus(200);
                response.setResultCode(ErrorConstant.ERROR_CODE_0300);
                response.setResultMsg(ErrorConstant.ERROR_MSG_0300);
                return response;
            }

        } catch (Exception e) {
            response.setStatus(200);
            response.setResultCode(ErrorConstant.ERROR_CODE_0300);
            response.setResultMsg(ErrorConstant.ERROR_MSG_0300 + e.getMessage());
            return response;
        }

        // OEM権限チェック
        if (!accessService.checkOEMAccess(model.getLoginInfo())) {
            response.setStatus(200);
            response.setResultCode(ErrorConstant.ERROR_CODE_0002);
            response.setResultMsg(ErrorConstant.ERROR_MSG_0002 + "i-focusのadmin権限が必須です。");
            return response;

        }

        // ユーザID必須判定
        if (null != model.getLoginInfo().getLoginusername()) {

            try {
                // バージョン一覧取得
                List<Cloud_versionModel> list = cloud_versionService.getAllVersions(model);

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
                response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "getAllVersions:" + e.getMessage());
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
     * バージョン詳細を取得する
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getVersionDetail", method = RequestMethod.POST)
    @ResponseBody
    @CrossOrigin(origins = "*", maxAge = 3600)
    public BaseHttpResponse<String> getVersionDetail(@RequestBody Cloud_versionModel model) throws Exception {

        BaseHttpResponse<String> response = new BaseHttpResponse<String>();

        try {
            // トークン認証
            if (!cloud_userService.checkToken(model.getLoginInfo())) {
                response.setStatus(200);
                response.setResultCode(ErrorConstant.ERROR_CODE_0300);
                response.setResultMsg(ErrorConstant.ERROR_MSG_0300);
                return response;
            }

        } catch (Exception e) {
            response.setStatus(200);
            response.setResultCode(ErrorConstant.ERROR_CODE_0300);
            response.setResultMsg(ErrorConstant.ERROR_MSG_0300 + e.getMessage());
            return response;
        }

        try {
            // バージョン詳細を取得する
            Cloud_versionModel cloud_versionModel = cloud_versionService.getVersioninInfo(model);

            if (cloud_versionModel != null) {
                response.setStatus(200);
                response.setResultCode(ErrorConstant.ERROR_CODE_0000);
                response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
                response.setData(Util.getJsonString(cloud_versionModel));
            } else {
                response.setStatus(200);
                response.setResultCode(ErrorConstant.ERROR_CODE_0004);
                response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + "cloud_versionService.getVersioninInfo");
            }

        } catch (Exception e) {
            response.setStatus(200);
            response.setResultCode(ErrorConstant.ERROR_CODE_0004);
            response.setResultMsg(ErrorConstant.ERROR_MSG_0004 + e.getMessage());
        }

        return response;
    }

}