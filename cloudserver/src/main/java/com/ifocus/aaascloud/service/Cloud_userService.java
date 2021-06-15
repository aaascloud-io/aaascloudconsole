package com.ifocus.aaascloud.service;

import com.ifocus.aaascloud.constant.AliveConstant;
import com.ifocus.aaascloud.constant.DeleteFlagConstant;
import com.ifocus.aaascloud.constant.ErrorConstant;
import com.ifocus.aaascloud.constant.division.RoleDivision;
import com.ifocus.aaascloud.entity.Cloud_companyEntity;
import com.ifocus.aaascloud.entity.Cloud_userEntity;
import com.ifocus.aaascloud.mapper.UserAppMapper;
import com.ifocus.aaascloud.model.*;
import com.ifocus.aaascloud.repository.Cloud_companyRepository;
import com.ifocus.aaascloud.repository.Cloud_userRepository;
import com.ifocus.aaascloud.util.KeyCloakUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.util.*;

@SpringBootApplication
@RestController
@Service
@Transactional
public class Cloud_userService {

    @Autowired
    private Cloud_userRepository cloud_userRepository;
    @Autowired
    private Cloud_companyRepository cloud_companyRepository;
    @Autowired
    private Cloud_companyService cloud_companyService;
    @Autowired
    private Cloud_deviceService cloud_deviceService;
    @Autowired
    private KeyCloakUserService keyCloakUserService;

    /*
     * ログイン認証
     * @param username String ユーザ名
     * @return Cloud_userModel ログインユーザー情報モデル
     */
    public Cloud_userModel login(String username) {
        // ログインユーザ取得
        Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername(username);
        return getModelByEntity(loginUserEntity);

    }

    /*
     * トークン刷新
     * @param username String ユーザ名
     * @return Cloud_userModel ログインユーザー情報モデル
     */
    public void refreshToken(String username, String token) {
        // ログインユーザ取得
        Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername(username);
        loginUserEntity.setToken(token);
        loginUserEntity.setU_uid(loginUserEntity.getUserid());
        loginUserEntity.setU_time(new Timestamp(System.currentTimeMillis()));
    }

    /*
     * トークンクリア
     * @param username String ユーザ名
     * @return Cloud_userModel ログインユーザー情報モデル
     *
     */
    public void clearToken(String username) {
        // ログインユーザ取得
        Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername(username);
        loginUserEntity.setToken("");
        loginUserEntity.setU_uid(loginUserEntity.getUserid());
        loginUserEntity.setU_time(new Timestamp(System.currentTimeMillis()));
    }

    /*
     * トークン認証
     * @param loginInfo LoginInfo ログインユーザー情報
     * @return boolean 認証結果
     *        true  = OK
     *        false = NG
     */
    public boolean checkToken(LoginInfo loginInfo) {
        if (loginInfo.getAccess_token() == null || loginInfo.getAccess_token().isEmpty()) {
            return false;
        }
        Cloud_userEntity user = cloud_userRepository.findByToken(loginInfo.getAccess_token());
        return user != null && user.getUsername().equals(loginInfo.getLoginusername());
    }

    /*
     * アクセス権限チェック
     */
    public boolean checkAccessOK(Integer loginuserid, Integer targetuserid) throws Exception {
//		if (null != loginuserid && null != targetuserid) {
//
//			if (loginuserid.equals(targetuserid)) {
//				return true;
//			} else {
//				try {
//					// 権限判断
//					return isAncestor(Integer.valueOf(loginuserid), Integer.valueOf(targetuserid));
//				} catch (Exception e) {
//					return false;
//				}
//			}
//		} else {
//			return false;
//		}
        return true;
    }


    /*
     * KeyCloakに存在チェック
     * @param username String ユーザ名
     * @return boolean
     *         true = 有効
     *         false = 無効
     */
    public boolean isValidUsername(String username) throws Exception {
        return keyCloakUserService.isValidUsername(username);
    }

    /*
     * KeyCloakからユーザ情報取得
     * @param username String ユーザー名（CloudのログインID）
     * @return UserModel ユーザー情報
     *
     */
    public UserModel getUserModelFromUsername(String username) throws Exception {
        return keyCloakUserService.getUserModelFromUsername(username);
    }

    /*
     * KeyCloakのパスワードを変更する
     * @param username String ユーザー名（CloudのログインID）
     * @param newPassword String 新パスワード
     */
    public void changePassword(String username, String newPassword) throws Exception {
        keyCloakUserService.changePassword(username, newPassword);
    }

    /*
     * 先祖であるかどうかを判断する
     */
    public boolean isAncestor(Integer userid, Integer targetUserId) {
        Optional<Cloud_userEntity> myEntity = cloud_userRepository.findById(targetUserId);
        if (userid.equals(myEntity.get().getUpperuserid())) {
            return true;
        } else {
            if (myEntity.get().getUpperuserid().equals(0)) {
                return false;
            } else {
                return isAncestor(userid, myEntity.get().getUpperuserid());
            }
        }
    }

    /*
     * ユーザ一覧取得
     */
    public List<Cloud_userModel> getSonUsers(Integer loginid) throws Exception {
        List<Cloud_userEntity> list = cloud_userRepository.getUsersByUpperuserid(loginid);
        List<Cloud_userModel> returnList = UserAppMapper.MAPPER.toUserModels(list);

        // なしの場合
        if (CollectionUtils.isEmpty(returnList)) {
            return returnList;
        }

        returnList.stream().forEach(model -> {
            /* 会社情報取得 */
            Optional<Cloud_companyEntity> entity = cloud_companyRepository.findById(model.getCompanyid());
            entity.ifPresent(cloud_companyEntity -> model.setCompanyname(cloud_companyEntity.getCompanyname()));

            /* デバイス数取得 */
            List<Cloud_deviceModel> deviceList = cloud_deviceService
                    .getUnderCompanyDevicesByUserids(Arrays.asList(model.getUserid()));
            model.setDevicecount(deviceList.size());

            /* ユーザ数取得 */
            List<Cloud_userEntity> underUserlist = cloud_userRepository.getUsersByUpperuserid(model.getUserid());
            model.setUserSize(underUserlist.size());
        });

        return returnList;
    }

    /*
     * 会社ユーザ一覧取得
     */
    public List<Cloud_userEntity> getCompanyUsers(Integer companyid) throws Exception {
        List<Cloud_userEntity> returnList = cloud_userRepository.getUsersByCompanyid(companyid);
        return returnList;
    }

    /*
     * 配下ユーザ一覧取得
     */
    public List<Cloud_userModel> getUnderUsers(List<Integer> userids) {
        List<Cloud_userEntity> returnList = (List<Cloud_userEntity>) cloud_userRepository.findAllById(userids);
        return getModelsByEntitys(returnList);
    }

    /*
     * 配下ユーザ検索
     */
    public List<Cloud_userModel> searchUnderUsers(List<Integer> userids, Cloud_userModel model) {
        List<Cloud_userEntity> returnList = (List<Cloud_userEntity>) cloud_userRepository.searchUnderUsersByCompanyname(
                userids, model.getCompanynameForSearch(), model.getFirstNameForSearch(),
                model.getLastNameForSearch(), model.getEmailForSearch());
        return getModelsByEntitys(returnList);
    }

    /*
     * ユーザ登録
     * @param loginInfo LoginInfo
     * @param cloud_userModel Cloud_userModel
     * @return userid Integer
     */
    public Integer registerSonUser(Cloud_userModel model) {

        ////////////////////////////////////////////////////////
        // DB登録を行う
        ////////////////////////////////////////////////////////

        /* システム日時 */
        Timestamp systemTime = new Timestamp(System.currentTimeMillis());

        // 会社IDが設定していない場合、
        if (Objects.isNull(model.getCompanyid())) {
            ////////////////////////////////////////////////////////
            // 会社登録
            ////////////////////////////////////////////////////////

            // 自社情報取得
            Optional<Cloud_companyEntity> myEntity = cloud_companyRepository
                    .findById(model.getLoginInfo().getLogincompanyid());

            // レベル
            Integer level = myEntity.get().getLevel();
            if (Objects.isNull(level)) {
                level = 0;
            }

            // 情報設定
            Cloud_companyEntity entity = UserAppMapper.MAPPER.toCompanyEntity(model);
            entity.setLevel(level + 1);    // レベルアップ
            entity.setAlive(AliveConstant.ALIVE);
            entity.setDeleteflag(DeleteFlagConstant.NOT_DELETED);
            entity.setI_time(systemTime);
            entity.setU_time(systemTime);
            entity.setCompanyid(null);

            Cloud_companyModel insertedModel = cloud_companyService.registerCompany(entity);

            // 登録した会社IDを設定する
            model.setCompanyid(insertedModel.getCompanyid());
        }

        // 削除済行を物理削除する
        cloud_userRepository.deleteUserMarked(model.getUsername());
        // 権限
        Integer role = model.getRole();
        // 情報設定
        Cloud_userEntity entity = UserAppMapper.MAPPER.toUserEntity(model);
        entity.setToken("");
        entity.setAlive(AliveConstant.ALIVE);
        entity.setDeleteflag(DeleteFlagConstant.NOT_DELETED);
        entity.setI_time(systemTime);
        entity.setU_time(systemTime);
        entity.setUserid(null);  // 新規登録時に、useridがない

        // 顧客の場合、Firebaseに登録する
        if (Objects.equals(RoleDivision.CLIENT.getValue(), role.toString())) {
            ////////////////////////////////////////////////////////
            // Firebaseに登録を行う
            ////////////////////////////////////////////////////////
            String firebaseuid = "UID_xxx";
            entity.setFirebaseuid(firebaseuid);
        }

        // ユーザー登録結果
        Cloud_userEntity cloud_userEntity = null;
        cloud_userEntity = cloud_userRepository.save(entity);

        ////////////////////////////////////////////////////////
        // KeyCloakに登録を行う
        ////////////////////////////////////////////////////////
        String retrunCode = keyCloakUserService.addUser(model.getUsername(), model.getPassword());
        if (!ErrorConstant.ERROR_CODE_0000.equals(retrunCode)) {
            // TODO Firebase登録失敗の場合、ロールバック処理が必要
            return -1;
        }

        return cloud_userEntity.getUserid();
    }

    /*
     * ユーザ更新
     * @param cloud_userModel Cloud_userModel
     * @return userid Integer
     */
    public Integer updateSonUser(Cloud_userModel model) throws Exception {
        /* システム日時 */
        Timestamp systemTime = new Timestamp(System.currentTimeMillis());

        ////////////////////////////////////////////////////////
        // 会社更新
        ////////////////////////////////////////////////////////
        // 会社情報取得
        Optional<Cloud_companyEntity> company = cloud_companyRepository.findById(model.getCompanyid());
        // 情報設定
        Cloud_companyEntity companyEntity = UserAppMapper.MAPPER.toCompanyEntity(model);
        companyEntity.setDeleteflag(DeleteFlagConstant.NOT_DELETED);
        companyEntity.setU_time(systemTime);
        companyEntity.setLevel(company.get().getLevel());
        companyEntity.setAlive(company.get().getAlive());
        companyEntity.setI_uid(company.get().getI_uid());
        companyEntity.setI_time(company.get().getI_time());
        cloud_companyService.updateCompany(companyEntity);

        ////////////////////////////////////////////////////////
        // ユーザ更新
        ////////////////////////////////////////////////////////
        // ユーザ情報取得
        Optional<Cloud_userEntity> user = cloud_userRepository.findById(model.getUserid());
        Cloud_userEntity entity = UserAppMapper.MAPPER.toUserEntity(model);
        entity.setDeleteflag(DeleteFlagConstant.NOT_DELETED);
        entity.setU_time(systemTime);
        entity.setAlive(user.get().getAlive());
        entity.setI_uid(user.get().getI_uid());
        entity.setI_time(user.get().getI_time());

        Cloud_userEntity cloud_userEntity = cloud_userRepository.save(entity);

        return cloud_userEntity.getUserid();
    }

    /*
     * ユーザ一括削除
     * @param loginInfo LoginInfo
     * @param cloud_userModel Cloud_userModel
     */
    public void deleteSonUsers(Cloud_userModel cloud_userModel) throws Exception {

        ////////////////////////////////////////////////////////
        // KeyCloakに削除を行う
        ////////////////////////////////////////////////////////
        try {
            // 選択されるユーザを削除する
            for (Cloud_userModel cloud_userModelInfo : cloud_userModel.getCloud_userModelList()) {
                keyCloakUserService.deleteUser(cloud_userModelInfo.getUsername());
            }
        } catch (Exception e) {
            throw e;
        }

        ////////////////////////////////////////////////////////
        // DB削除を行う
        ////////////////////////////////////////////////////////

        // 選択されるユーザを削除する
        for (Cloud_userModel cloud_userModelInfo : cloud_userModel.getCloud_userModelList()) {
            // 会社ユーザ一覧取得
            List<Cloud_userEntity> entiyList = getCompanyUsers(cloud_userModelInfo.getCompanyid());

            // 会社の最後のユーザになった場合、会社も削除する。
            if (entiyList.size() == 1) {
                Cloud_companyEntity cloud_companyEntity = new Cloud_companyEntity();
                cloud_companyEntity.setCompanyid(cloud_userModelInfo.getCompanyid());
                // 会社を削除する
                cloud_companyService.deleteCompany(cloud_companyEntity, cloud_userModel.getLoginInfo());
            }

            // ユーザを削除する
            deleteSonUser(cloud_userModelInfo, cloud_userModel);
        }

    }

    /*
     * ユーザ削除
     * @param loginInfo LoginInfo
     * @param cloud_userModel Cloud_userModel
     */
    public void deleteSonUser(Cloud_userModel model, Cloud_userModel LoginModel) throws Exception {
        // 対象取得
        Optional<Cloud_userEntity> user = cloud_userRepository.findById(model.getUserid());
        if (user.isPresent()) {

            Cloud_userEntity entity = user.get();

            // プロダクト論理削除
            entity.setDeleteflag(DeleteFlagConstant.DELETED);
            entity.setU_uid(LoginModel.getLoginInfo().getLoginuserid());
            entity.setU_time(new Timestamp(System.currentTimeMillis()));
            // DB更新
            cloud_userRepository.save(entity);
        }
    }

    /*
     * 配下ユーザの会社ID一覧取得
     * @param model Cloud_deviceModel ユーザ情報
     * @return List<Integer> 配下ユーザの会社ID一覧
     */
    public List<Integer> getUnderCompanyIds(Cloud_deviceModel model) throws Exception {
        List<Cloud_userEntity> returnList = cloud_userRepository.getUnderUserCompanyIdsByUpperuserid(model.getTargetUserInfo().getTargetuserid());
        // 配下各社ID一覧を取得する
        boolean isMyCompanyExist = false;
        List<Integer> underUserCompanyIdList = new ArrayList<Integer>();
        for (Cloud_userEntity cloud_userEntity : returnList) {
            underUserCompanyIdList.add(cloud_userEntity.getCompanyid());
            if (cloud_userEntity.getCompanyid().equals(model.getTargetUserInfo().getTargetuserCompanyid())) {
                isMyCompanyExist = true;
            }
        }
        // 自社を追加する
        if (!isMyCompanyExist) {
            underUserCompanyIdList.add(model.getTargetUserInfo().getTargetuserCompanyid());
        }
        return underUserCompanyIdList;
    }

    /*
     * EntityリストからModelリスト取得
     * @param entityList List<Cloud_userEntity>
     * @return List<Cloud_userModel>
     */
    public List<Cloud_userModel> getModelsByEntitys(List<Cloud_userEntity> entityList) {

        List<Cloud_userModel> modelList = new ArrayList<Cloud_userModel>();
        for (Cloud_userEntity entity : entityList) {
            modelList.add(getModelByEntity(entity));
        }
        return modelList;
    }

    /*
     * EntityからModel取得
     * @param entity Cloud_deviceEntity
     * @return Cloud_userModel
     */
    private Cloud_userModel getModelByEntity(Cloud_userEntity entity) {
        Cloud_userModel model = UserAppMapper.MAPPER.toUserModel(entity);
        // 会社名取得
        Optional<Cloud_companyEntity> company = cloud_companyRepository.findById(entity.getCompanyid());
        if (!company.equals(Optional.empty())) {
            model.setCompanyname(company.get().getCompanyname());
        }
        // fullname設定
        model.setFullname(model.getLastname() + " " + model.getFirstname());

        return model;
    }

}
