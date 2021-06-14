package com.ifocus.aaascloud.controller;

import com.ifocus.aaascloud.api.common.BaseHttpResponse;
import com.ifocus.aaascloud.constant.ErrorConstant;
import com.ifocus.aaascloud.exception.BusinessException;
import com.ifocus.aaascloud.exception.ValidationException;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.service.Cloud_companyService;
import com.ifocus.aaascloud.service.Cloud_userService;
import com.ifocus.aaascloud.util.StringUtil;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class LogoutController {

    @Autowired
    private Cloud_userService cloud_userService;
    @Autowired
    private Cloud_companyService cloud_companyService;

    /**
     * ログアウト
     *
     * @param cloud_userModel Cloud_userModel
     *                        loginId
     *                        password
     * @return BaseHttpResponse<String> JSON形式
     * @throws Exception
     */
    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    @ResponseBody
    @CrossOrigin(origins = "*", maxAge = 3600)
    public BaseHttpResponse<ResponseJsonResult> logout(@RequestBody Cloud_userModel cloud_userModel) throws Exception {
        BaseHttpResponse<ResponseJsonResult> response = new BaseHttpResponse<>();

        // トークン認証
        if (!cloud_userService.checkToken(cloud_userModel.getLoginInfo())) {
            throw new BusinessException(ErrorConstant.ERROR_CODE_0300, ErrorConstant.ERROR_MSG_0300);
        }

        // ユーザなしの場合
        if (StringUtil.isEmpty(cloud_userModel.getUsername())) {
            throw new ValidationException(ErrorConstant.ERROR_CODE_0001,
                    ErrorConstant.ERROR_MSG_0001 + "usernameが必須です。");
        }

        // トークンクリア
        cloud_userService.clearToken(cloud_userModel.getLoginInfo().getLoginusername());
        ResponseJsonResult jsonResult = new ResponseJsonResult();
        jsonResult.setResult(true);

        response.setStatus(200);
        response.setResultCode(ErrorConstant.ERROR_CODE_0000);
        response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
        response.setData(jsonResult);
        return response;
    }

    @Data
    @NoArgsConstructor
    static class ResponseJsonResult {
        private boolean result;
    }

}