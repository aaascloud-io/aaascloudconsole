package com.ifocus.aaascloud.controller;

import com.ifocus.aaascloud.api.common.BaseHttpResponse;
import com.ifocus.aaascloud.constant.DeleteFlagConstant;
import com.ifocus.aaascloud.constant.ErrorConstant;
import com.ifocus.aaascloud.model.Cloud_scCardInformationModel;
import com.ifocus.aaascloud.service.Cloud_scCardInformationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/card")
public class Cloud_scCardInformationController {

    @Autowired
    private Cloud_scCardInformationService cloud_scCardInformationService;

    @RequestMapping(method = RequestMethod.POST, value = "/list")
    @ResponseBody
    @CrossOrigin(origins = "*", maxAge = 3600)
    public BaseHttpResponse<List<Cloud_scCardInformationModel>> list() {
        BaseHttpResponse<List<Cloud_scCardInformationModel>> response = new BaseHttpResponse<>();

        List<Cloud_scCardInformationModel> models = cloud_scCardInformationService.findSimCardList();
        System.out.println(models.size());

        response.setStatus(200);
        response.setResultCode(ErrorConstant.ERROR_CODE_0000);
        response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
        response.setCount(models.size());
        response.setData(models);

        return response;
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    @CrossOrigin(origins = "*", maxAge = 3600)
    public BaseHttpResponse<Cloud_scCardInformationModel> add(@RequestBody Cloud_scCardInformationModel model)  {
        BaseHttpResponse<Cloud_scCardInformationModel> response = new BaseHttpResponse<>();

        // 削除フラグ
        model.setDeleteflg(DeleteFlagConstant.NOT_DELETED);
        Cloud_scCardInformationModel result = cloud_scCardInformationService.addSimCard(model);

        response.setStatus(200);
        response.setResultCode(ErrorConstant.ERROR_CODE_0000);
        response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
        response.setData(result);
        return response;
    }

    @RequestMapping(value = "/del", method = RequestMethod.POST)
    @ResponseBody
    @CrossOrigin(origins = "*", maxAge = 3600)
    public BaseHttpResponse<Cloud_scCardInformationModel> delete(@RequestBody Cloud_scCardInformationModel model)  {
        BaseHttpResponse<Cloud_scCardInformationModel> response = new BaseHttpResponse<>();

        Cloud_scCardInformationModel result = cloud_scCardInformationService.deleteSimCard(model);

        response.setStatus(200);
        response.setResultCode(ErrorConstant.ERROR_CODE_0000);
        response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
        response.setData(result);
        return response;
    }



}
