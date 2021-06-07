package com.ifocus.aaascloud.controller;

import com.ifocus.aaascloud.api.common.BaseHttpResponse;
import com.ifocus.aaascloud.constant.DeleteFlagConstant;
import com.ifocus.aaascloud.constant.ErrorConstant;
import com.ifocus.aaascloud.entity.Cloud_scCardInformationEntity;
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
        List<Cloud_scCardInformationModel> models = cloud_scCardInformationService.findSimCardList();
//        System.out.println(models.size());
        BaseHttpResponse<List<Cloud_scCardInformationModel>> response = responseData(models);
        response.setCount(models.size());
        return response;
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    @CrossOrigin(origins = "*", maxAge = 3600)
    public BaseHttpResponse<Cloud_scCardInformationModel> add(@RequestBody Cloud_scCardInformationModel model)  {
        // 削除フラグ
        model.setDeleteflg(DeleteFlagConstant.NOT_DELETED);
        Cloud_scCardInformationModel result = cloud_scCardInformationService.addSimCard(model);
        return responseData(result);
    }

    @RequestMapping(value = "/del", method = RequestMethod.POST)
    @ResponseBody
    @CrossOrigin(origins = "*", maxAge = 3600)
    public BaseHttpResponse<Cloud_scCardInformationModel> delete(@RequestBody Cloud_scCardInformationModel model)  {
        Cloud_scCardInformationModel result = cloud_scCardInformationService.deleteSimCard(model);
        return responseData(result);
    }

    @RequestMapping(value = "/info", method = RequestMethod.POST)
    @ResponseBody
    @CrossOrigin(origins = "*", maxAge = 3600)
    public BaseHttpResponse<Cloud_scCardInformationModel> info(@RequestBody Cloud_scCardInformationModel model){
        Integer no = model.getNo();
        Cloud_scCardInformationModel result = cloud_scCardInformationService.findSimCardById(no);
        return responseData(result);
    }

    private <T> BaseHttpResponse<T> responseData(T data){
        BaseHttpResponse<T> response = new BaseHttpResponse<>();
        response.setStatus(200);
        response.setResultCode(ErrorConstant.ERROR_CODE_0000);
        response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
        response.setData(data);
        return response;
    }



}
