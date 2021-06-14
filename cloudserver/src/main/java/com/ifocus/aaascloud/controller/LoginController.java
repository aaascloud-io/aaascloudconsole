package com.ifocus.aaascloud.controller;

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
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.service.Cloud_companyService;
import com.ifocus.aaascloud.service.Cloud_userService;

import net.sf.json.JSONObject;

@Controller
public class LoginController {

    @Autowired
    private Cloud_userService cloud_userService;
    @Autowired
    private Cloud_companyService cloud_companyService;


    /**
     * ログイン認証
     *
     * @param cloud_userModel Cloud_userModel
     *                        loginId
     *                        password
     * @return BaseHttpResponse<String> JSON形式
     * @throws Exception
     */
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    @CrossOrigin(origins = "*", maxAge = 3600)
    public BaseHttpResponse<Cloud_userModel> login(@RequestBody Cloud_userModel cloud_userModel) {
        BaseHttpResponse<Cloud_userModel> response = new BaseHttpResponse<>();

        // ユーザなしの場合
        if (StringUtil.isEmpty(cloud_userModel.getUsername())) {
            throw new ValidationException(ErrorConstant.ERROR_CODE_0001,
                    ErrorConstant.ERROR_MSG_0001 + "usernameが必須です。");
        }

        // ログイン認証
        Cloud_userModel model = cloud_userService.login(cloud_userModel.getUsername());

        // ログイン失敗の場合
        if (model.getUserid() < 0) {
            throw new BusinessException(ErrorConstant.ERROR_CODE_0005,
                    ErrorConstant.ERROR_MSG_0005 + "login:");
        }

        // トークン刷新
        cloud_userService.refreshToken(cloud_userModel.getUsername(), cloud_userModel.getAccess_token());

//					// 会社情報取得
//					Cloud_companyModel cloud_companyModel = cloud_companyService.getCompanyInfo(model.getCompanyid());
//
//					// 会社情報設定
//					resJasonObj.put("companyname", cloud_companyModel.getCompanyname());
//					resJasonObj.put("address", cloud_companyModel.getAddress());
//					resJasonObj.put("industry", cloud_companyModel.getIndustry());
//					resJasonObj.put("mail", cloud_companyModel.getMail());
//					resJasonObj.put("tel", cloud_companyModel.getTel());
//					resJasonObj.put("fax", cloud_companyModel.getFax());
//					resJasonObj.put("level", cloud_companyModel.getLevel());

        // ログイン戻り値
        response.setStatus(200);
        response.setResultCode(ErrorConstant.ERROR_CODE_0000);
        response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
        response.setData(model);
        return response;

    }

}