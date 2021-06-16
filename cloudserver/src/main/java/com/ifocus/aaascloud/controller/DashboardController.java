package com.ifocus.aaascloud.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.ifocus.aaascloud.exception.BusinessException;
import com.ifocus.aaascloud.exception.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ifocus.aaascloud.api.common.BaseHttpResponse;
import com.ifocus.aaascloud.constant.ErrorConstant;
import com.ifocus.aaascloud.repository.Cloud_companyRepository;
import com.ifocus.aaascloud.entity.Cloud_userEntity;
import com.ifocus.aaascloud.repository.Cloud_userRepository;
import com.ifocus.aaascloud.model.Cloud_deviceModel;
import com.ifocus.aaascloud.model.Cloud_errlogModel;
import com.ifocus.aaascloud.model.Cloud_productModel;
import com.ifocus.aaascloud.model.Cloud_projectModel;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.model.DashboardModel;
import com.ifocus.aaascloud.model.UserModel;
import com.ifocus.aaascloud.service.AccessService;
import com.ifocus.aaascloud.service.Cloud_deviceService;
import com.ifocus.aaascloud.service.Cloud_errlogService;
import com.ifocus.aaascloud.service.Cloud_productService;
import com.ifocus.aaascloud.service.Cloud_projectService;
import com.ifocus.aaascloud.service.Cloud_userService;
import com.ifocus.aaascloud.util.Util;

@Controller
public class DashboardController {

    @Autowired
    private AccessService accessService;
    @Autowired
    private Cloud_userService cloud_userService;
    @Autowired
    private Cloud_projectService cloud_projectService;
    @Autowired
    private Cloud_deviceService cloud_deviceService;
    @Autowired
    private Cloud_productService cloud_productService;
    @Autowired
    private Cloud_errlogService cloud_errlogService;
    @Autowired
    private Cloud_companyRepository cloud_companyRepository;
    @Autowired
    private Cloud_userRepository cloud_userRepository;

    /**
     * ダッシュボード情報を取得する
     *
     * @param cloud_userModel Cloud_userModel
     * @return BaseHttpResponse<DashboardModel> 結果
     */
    @RequestMapping(value = "/getDashboardInfo", method = RequestMethod.POST)
    @ResponseBody
    @CrossOrigin(origins = "*", maxAge = 3600)
    public BaseHttpResponse<DashboardModel> getDashboardInfo(@RequestBody Cloud_userModel cloud_userModel) {
        BaseHttpResponse<DashboardModel> response = new BaseHttpResponse<>();

        // トークン認証
        if (!cloud_userService.checkToken(cloud_userModel.getLoginInfo())) {
            throw new BusinessException(ErrorConstant.ERROR_CODE_0300, ErrorConstant.ERROR_MSG_0300);
        }

        // ユーザID必須判定
        if (Objects.isNull(cloud_userModel.getLoginInfo().getLoginuserid())) {
            throw new ValidationException(ErrorConstant.ERROR_CODE_0001,
                    ErrorConstant.ERROR_MSG_0001 + "usernameが必須です。");
        }

        DashboardModel dashboardModel = new DashboardModel();

        // ログインユーザ取得
        Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername(cloud_userModel.getUsername());
        // アクセス権限ユーザ一覧を取得する
        List<Integer> list = accessService.getAccessUsers(loginUserEntity.getUserid());
        // ユーザ数を設定する
        dashboardModel.setUserCount(list.size());

        // プロジェクト一覧を取得する
        List<Cloud_projectModel> projectList = cloud_projectService.getMyUnderProjects(list);
        // プロジェクト数を設定する
        dashboardModel.setProjectCount(projectList.size());

        // プロダクト一覧を取得する
        List<Cloud_productModel> productList = cloud_productService.searchMyProductList(list);
        // プロダクト一覧を設定する
        dashboardModel.setProductList(productList);
        // プロダクト数を設定する
        dashboardModel.setProductCount(productList.size());

        // デバイス数（全部）を取得する
        List<Cloud_deviceModel> deviceList = cloud_deviceService.getUnderUserDevices(list);
        // デバイス数（全部）を設定する
        dashboardModel.setDeviceCount(deviceList.size());
        // デバイス数（オンライン数）を取得する TODO デバイス数（オンライン数）を取得する
        // デバイス数（オンライン数）を設定する
        dashboardModel.setOnlineDeviceCount(0);

        // アクセス権限ユーザ一覧を取得する
        List<Integer> notDelList = accessService.getNotDelAccessUsers(loginUserEntity.getUserid());
        // ユーザ一覧を取得する
        List<Cloud_userEntity> userList = (List<Cloud_userEntity>) cloud_userRepository.findAllById(notDelList);
        List<Cloud_userModel> cloud_userModelList = cloud_userService.getModelsByEntitys(userList);
        // ユーザ一覧を設定する
        dashboardModel.setUserList(getUserModelList(cloud_userModelList));

        // エラーログ一覧を取得する
        List<Cloud_errlogModel> errlogList = cloud_errlogService.getErrlogList(list, Util.getImeiList(deviceList), Util.getSnList(deviceList));
        // エラーログ一覧を設定する
        dashboardModel.setErrlogList(errlogList);
        // エラーログ数を設定する
        dashboardModel.setErrlogCount(errlogList.size());

        response.setStatus(200);
        response.setResultCode(ErrorConstant.ERROR_CODE_0000);
        response.setResultMsg(ErrorConstant.ERROR_MSG_0000);
        response.setData(dashboardModel);
        return response;
    }

    /**
     * Cloud_userModelリストからUserModelリスト作成
     *
     * @param cloud_userModelList List<Cloud_userModel> ユーザのリスト
     * @return List<UserModel> ユーザのUserModelリスト
     */
    private List<UserModel> getUserModelList(List<Cloud_userModel> cloud_userModelList) {
        List<UserModel> list = new ArrayList<>();
        for (Cloud_userModel cloud_userModel : cloud_userModelList) {
            UserModel userModel = new UserModel(
                    "",
                    cloud_userModel.getUsername(),
                    cloud_userModel.getFirstname(),
                    cloud_userModel.getLastname(),
                    cloud_userModel.getEmail());
            list.add(userModel);
        }
        return list;
    }

}