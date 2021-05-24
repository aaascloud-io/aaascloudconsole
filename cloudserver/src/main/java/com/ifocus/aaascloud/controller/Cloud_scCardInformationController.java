package com.ifocus.aaascloud.controller;

import com.ifocus.aaascloud.api.common.BaseHttpResponse;
import com.ifocus.aaascloud.constant.ErrorConstant;
import com.ifocus.aaascloud.model.Cloud_scCardInformationModel;
import com.ifocus.aaascloud.model.Cloud_scCardInformationModel.CardInformation;
import com.ifocus.aaascloud.model.TreeNode;
import com.ifocus.aaascloud.service.Cloud_scCardInformationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/card")
public class Cloud_scCardInformationController {

    @Autowired
    private Cloud_scCardInformationService cloud_scCardInformationService;

    @RequestMapping(method = RequestMethod.POST, value = "/list")
    @ResponseBody
    @CrossOrigin(origins = "*", maxAge = 3600)
    public BaseHttpResponse<Cloud_scCardInformationModel> cardList() {
        BaseHttpResponse<Cloud_scCardInformationModel> response = new BaseHttpResponse<>();

        List<TreeNode<CardInformation>> list = cloud_scCardInformationService.findCardList();
        System.out.println(list.size());
        Cloud_scCardInformationModel model = new Cloud_scCardInformationModel();
        model.setList(list);

        response.setStatus(200);
        response.setResultCode(ErrorConstant.ERROR_CODE_0000);
        response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
        response.setCount(list.size());
        response.setData(model);

        return response;
    }


}
