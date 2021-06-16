package com.ifocus.aaascloud.controller;

import com.ifocus.aaascloud.api.common.BaseHttpResponse;
import com.ifocus.aaascloud.constant.ErrorConstant;
import com.ifocus.aaascloud.exception.BusinessException;
import com.ifocus.aaascloud.exception.ValidationException;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.model.UserModel;
import com.ifocus.aaascloud.service.Cloud_userService;
import com.ifocus.aaascloud.util.StringUtil;
import com.ifocus.aaascloud.util.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@Controller
public class ProfileController {

    @Autowired
    private Cloud_userService cloud_userService;


    /**
     * プロファイルを変更する
     *
     * @param cloud_userModel Cloud_userModel
     * @return BaseHttpResponse<String> JSON形式
     */
    @RequestMapping(value = "/updateProfile", method = RequestMethod.POST)
    @ResponseBody
    @CrossOrigin(origins = "*", maxAge = 3600)
    public BaseHttpResponse<String> updateProfile(@RequestBody Cloud_userModel cloud_userModel) {
        BaseHttpResponse<String> response = new BaseHttpResponse<>();

        // トークン認証
        if (!cloud_userService.checkToken(cloud_userModel.getLoginInfo())) {
            throw new BusinessException(ErrorConstant.ERROR_CODE_0300, ErrorConstant.ERROR_MSG_0300);
        }

        // ユーザ名必須判定
        if (StringUtil.isEmpty(cloud_userModel.getUsername())) {
            throw new ValidationException(ErrorConstant.ERROR_CODE_0001,
                    ErrorConstant.ERROR_MSG_0001 + "usernameが必須です。");
        }

        // 本人以外の場合
        if (!Objects.equals(cloud_userModel.getUsername(), cloud_userModel.getLoginInfo().getLoginusername())) {
            throw new BusinessException(ErrorConstant.ERROR_CODE_0002, ErrorConstant.ERROR_MSG_0002 + "本人限定です。");
        }

        // 本人判定の場合
        // パスワードを変更する
        cloud_userService.changePassword(cloud_userModel.getUsername(), cloud_userModel.getPassword());

        // 正常終了
        response.setStatus(200);
        response.setResultCode(ErrorConstant.ERROR_CODE_0000);
        response.setResultMsg(ErrorConstant.ERROR_MSG_0000);

        return response;

//		/* 異常系 */
//		response.setStatus(200);
//		response.setResultCode(ErrorConstant.ERROR_CODE_0006);
//		response.setResultMsg(ErrorConstant.ERROR_MSG_0006 + "cloud_userService.changePassword:" + e.getMessage());
//		return response;
    }


    //////////////////////////////////// 使用されていなかった　////////////////////////////////////

    /**
     * プロファイルを取得する
     *
     * @param cloud_userModel Cloud_userModel
     * @return BaseHttpResponse<String> JSON形式
     */
    @RequestMapping(value = "/getUserProfile", method = RequestMethod.POST)
    @ResponseBody
    @CrossOrigin(origins = "*", maxAge = 3600)
    public BaseHttpResponse<UserModel> getUserProfile(@RequestBody Cloud_userModel cloud_userModel) {
        BaseHttpResponse<UserModel> response = new BaseHttpResponse<>();

        // トークン認証
        if (!cloud_userService.checkToken(cloud_userModel.getLoginInfo())) {
            throw new BusinessException(ErrorConstant.ERROR_CODE_0300, ErrorConstant.ERROR_MSG_0300);
        }

        // ユーザ名必須判定
        if (StringUtil.isEmpty(cloud_userModel.getUsername())) {
            throw new ValidationException(ErrorConstant.ERROR_CODE_0001,
                    ErrorConstant.ERROR_MSG_0001 + "usernameが必須です。");
        }

        // プロファイルを取得する
        UserModel model = Util.getUserModel(cloud_userModel);
        if (model != null) {
            response.setCount(1);
        }

        // プロファイル情報設定
        response.setStatus(200);
        response.setResultCode(ErrorConstant.ERROR_CODE_0000);
        response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
        response.setData(model);
        return response;
    }

}
