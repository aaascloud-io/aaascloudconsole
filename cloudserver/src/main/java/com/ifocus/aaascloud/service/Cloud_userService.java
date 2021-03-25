package com.ifocus.aaascloud.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.ifocus.aaascloud.constant.AliveConstant;
import com.ifocus.aaascloud.constant.DeleteFlagConstant;
import com.ifocus.aaascloud.constant.ErrorConstant;
import com.ifocus.aaascloud.entity.Cloud_companyEntity;
import com.ifocus.aaascloud.entity.Cloud_companyRepository;
import com.ifocus.aaascloud.entity.Cloud_userEntity;
import com.ifocus.aaascloud.entity.Cloud_userRepository;
import com.ifocus.aaascloud.model.Cloud_companyModel;
import com.ifocus.aaascloud.model.Cloud_deviceModel;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.model.LoginInfo;
import com.ifocus.aaascloud.model.UserModel;
import com.ifocus.aaascloud.util.KeyCloakUserService;
import com.ifocus.aaascloud.util.Util;

@SpringBootApplication
@RestController
@Service
@Transactional
public class Cloud_userService {

	@Autowired
	private Cloud_userRepository cloud_userRepository ;
	@Autowired
	private Cloud_companyRepository cloud_companyRepository ;
	@Autowired
	private Cloud_companyService cloud_companyService ;
	@Autowired
	private Cloud_deviceService cloud_deviceService ;
	@Autowired
	private KeyCloakUserService keyCloakUserService;

	/*
	 * ログイン認証
	 * @param username String ユーザ名
	 * @return Cloud_userModel ログインユーザー情報モデル
	 *
	 */
	public Cloud_userModel login(String username) throws Exception {
		// ログインユーザ取得
		Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername(username);
		return getModelByEntity(loginUserEntity);

	}

	/*
	 * トークン刷新
	 * @param username String ユーザ名
	 * @return Cloud_userModel ログインユーザー情報モデル
	 *
	 */
	public void refreshToken(String username, String token) throws Exception {
		// ログインユーザ取得
		Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername(username);
		loginUserEntity.setToken(token);
		loginUserEntity.setU_uid(loginUserEntity.getUserid());
		loginUserEntity.setU_time(new Timestamp(System.currentTimeMillis()));

		return ;
	}

	/*
	 * トークンクリア
	 * @param username String ユーザ名
	 * @return Cloud_userModel ログインユーザー情報モデル
	 *
	 */
	public void clearToken(String username) throws Exception {
		// ログインユーザ取得
		Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername(username);
		loginUserEntity.setToken("");
		loginUserEntity.setU_uid(loginUserEntity.getUserid());
		loginUserEntity.setU_time(new Timestamp(System.currentTimeMillis()));

		return ;
	}

	/*
	 * トークン認証
	 * @param loginInfo LoginInfo ログインユーザー情報
	 * @return boolean 認証結果
	 *        true  = OK
	 *        false = NG
	 *
	 */
	public boolean checkToken(LoginInfo loginInfo) throws Exception {

		try {
			if (loginInfo.getAccess_token() == null || loginInfo.getAccess_token().isEmpty()) {
				return false;
			}
			Cloud_userEntity user = cloud_userRepository.findByToken(loginInfo.getAccess_token());
			if (user != null && user.getUsername().equals(loginInfo.getLoginusername())) {
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			throw e;
		}

	}

	/*
	 * アクセス権限チェック
	 *
	 *
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
	 *
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
	 *
	 *
	 */
	public boolean isAncestor(Integer userid, Integer targetUserId) throws Exception {
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
	 *
	 *
	 */
	public List<Cloud_userModel> getSonUsers(Integer loginid) throws Exception {
		List<Cloud_userModel> returnList = new ArrayList<Cloud_userModel>();
		List<Cloud_userEntity> list = cloud_userRepository.getUsersByUpperuserid(loginid);
		if (list != null) {
			list.forEach(elm -> {
				Cloud_userModel model = new Cloud_userModel();
				model.setUserid(elm.getUserid());
				model.setUsername(elm.getUsername());
				model.setCompanyid(elm.getCompanyid());
				model.setRole(elm.getRole());
				model.setUpperuserid(elm.getUpperuserid());
				/* 会社情報取得 */
				Optional<Cloud_companyEntity> entity = cloud_companyRepository.findById(model.getCompanyid());
				if (entity != null ) {
					model.setCompanyname(entity.get().getCompanyname());
				}
				/* デバイス数取得 */
				try {
					List<Integer> userids = new ArrayList<Integer>(Arrays.asList(model.getUserid()));
					List<Cloud_deviceModel> deviceList  = cloud_deviceService.getUnderCompanyDevicesByUserids(userids);
					model.setDevicecount(deviceList.size());
				} catch (Exception e) {
					e.printStackTrace();
				}

				/* ユーザ数取得 */
				List<Cloud_userEntity> underUserlist = cloud_userRepository.getUsersByUpperuserid(model.getUserid());
				model.setUsercount(underUserlist.size());


				returnList.add(model);
			});
		}
		return returnList;

	}

	/*
	 * 会社ユーザ一覧取得
	 *
	 *
	 */
	public List<Cloud_userEntity> getCompanyUsers(Integer companyid) throws Exception {
		List<Cloud_userEntity> returnList = cloud_userRepository.getUsersByCompanyid(companyid);
		return returnList;

	}

	/*
	 * 配下ユーザ一覧取得
	 *
	 *
	 */
	public List<Cloud_userModel> getUnderUsers(List<Integer> userids) throws Exception {
		List<Cloud_userEntity> returnList = (List<Cloud_userEntity>) cloud_userRepository.findAllById(userids);
		return getModelsByEntitys(returnList);

	}

	/*
	 * 配下ユーザ検索
	 *
	 *
	 */
	public List<Cloud_userModel> searchUnderUsers(List<Integer> userids, Cloud_userModel model) throws Exception {
		List<Cloud_userEntity> returnList = (List<Cloud_userEntity>) cloud_userRepository.searchUnderUsersByCompanyname(
				userids, model.getCompanynameForSearch(), model.getFirstNameForSearch(), model.getLastNameForSearch(), model.getEmailForSearch());
		return getModelsByEntitys(returnList);

	}

	/*
	 * ユーザ登録
	 * @param loginInfo LoginInfo
	 * @param cloud_userModel Cloud_userModel
	 * @return userid Integer
	 */
	public Integer registerSonUser(Cloud_userModel model) throws Exception {

		////////////////////////////////////////////////////////
		// KeyCloakに登録を行う
		////////////////////////////////////////////////////////
		try {
			String retrunCode = keyCloakUserService.addUser(model.getUsername(), model.getPassword());
			if (!ErrorConstant.ERROR_CODE_0000.equals(retrunCode)) {
				return -1;
			}
		} catch (Exception e) {
			throw e;
		}

		////////////////////////////////////////////////////////
		// DB登録を行う
		////////////////////////////////////////////////////////

		// 会社IDが設定していない場合、
		if (model.getCompanyid() == null) {
			////////////////////////////////////////////////////////
			// 会社登録
			////////////////////////////////////////////////////////

			// 自社情報取得
			Optional<Cloud_companyEntity> myEntity = cloud_companyRepository.findById(model.getLoginInfo().getLogincompanyid());

			/* システム日時 */
			Timestamp systemTime = new Timestamp(System.currentTimeMillis());
			// 情報設定
			Cloud_companyEntity entity = new Cloud_companyEntity();
			entity.setCorporatenumber(model.getCorporatenumber());
			entity.setCompanyname(model.getCompanyname());
			entity.setAddress(model.getAddress());
			entity.setIndustry(model.getIndustry());
			entity.setMail(model.getMail());
			entity.setTel(model.getTel());
			entity.setFax(model.getFax());
			entity.setLevel(myEntity.get().getLevel() + 1);   	// レベルアップ
			entity.setAlive(AliveConstant.ALIVE);
			entity.setDeleteflag(DeleteFlagConstant.NOT_DELETED);
			entity.setI_uid(model.getLoginInfo().getLoginuserid());
			entity.setI_time(systemTime);
			entity.setU_uid(model.getLoginInfo().getLoginuserid());
			entity.setU_time(systemTime);

			Cloud_companyModel insertedModel = cloud_companyService.registerCompany(entity);

			// 登録した会社IDを設定する
			model.setCompanyid(insertedModel.getCompanyid());

		}

		// 削除済行を物理削除する
		cloud_userRepository.deleteUserMarked(model.getUsername());
		// 情報設定
		Cloud_userEntity entity = new Cloud_userEntity();
		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());
		// entity.setUserid(model.getUserid());  新規登録時に、useridがない。
		entity.setCompanyid(model.getCompanyid());
		entity.setUsername(model.getUsername());
		entity.setLastname(model.getLastName());
		entity.setFirstname(model.getFirstName());
		entity.setEmail(model.getEmail());
		entity.setRole(model.getRole());
		entity.setUpperuserid(model.getUpperuserid());
		entity.setToken("");
		entity.setAlive(AliveConstant.ALIVE);
		entity.setDeleteflag(DeleteFlagConstant.NOT_DELETED);
		entity.setI_uid(model.getLoginInfo().getLoginuserid());
		entity.setI_time(systemTime);
		entity.setU_uid(model.getLoginInfo().getLoginuserid());
		entity.setU_time(systemTime);

		Cloud_userEntity cloud_userEntity = cloud_userRepository.save(entity);
		return cloud_userEntity.getUserid();

	}

	/*
	 * ユーザ更新
	 * @param loginInfo LoginInfo
	 * @param cloud_userModel Cloud_userModel
	 * @return userid Integer
	 */
	public Integer updateSonUser(LoginInfo loginInfo, Cloud_userModel model) throws Exception {

		////////////////////////////////////////////////////////
		// 会社更新
		////////////////////////////////////////////////////////

		// 会社情報取得
		Optional<Cloud_companyEntity> company = cloud_companyRepository.findById(model.getCompanyid());

		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());
		// 情報設定
		Cloud_companyEntity companyEntity = company.get();
		companyEntity.setCompanyid(model.getCompanyid());
		companyEntity.setCorporatenumber(model.getCorporatenumber());
		companyEntity.setCompanyname(model.getCompanyname());
		companyEntity.setAddress(model.getAddress());
		companyEntity.setIndustry(model.getIndustry());
		companyEntity.setMail(model.getMail());
		companyEntity.setTel(model.getTel());
		companyEntity.setFax(model.getFax());
		companyEntity.setDeleteflag(DeleteFlagConstant.NOT_DELETED);
		companyEntity.setU_uid(loginInfo.getLoginuserid());
		companyEntity.setU_time(systemTime);

		cloud_companyService.updateCompany(companyEntity);

		////////////////////////////////////////////////////////
		// ユーザ更新
		////////////////////////////////////////////////////////

		Optional<Cloud_userEntity> user = cloud_userRepository.findById(model.getUserid());
		Cloud_userEntity entity = user.get();
		entity.setUserid(model.getUserid());
		entity.setCompanyid(model.getCompanyid());
		entity.setUsername(model.getUsername());
		entity.setFirstname(model.getFirstName());
		entity.setLastname(model.getLastName());
		entity.setRole(model.getRole());
		entity.setDeleteflag(DeleteFlagConstant.NOT_DELETED);
		entity.setU_uid(loginInfo.getLoginuserid());
		entity.setU_time(systemTime);

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
				cloud_companyService.deleteCompany(cloud_companyEntity,cloud_userModel.getLoginInfo());
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
		if (user != null && user.isPresent()) {

			Cloud_userEntity entity = user.get();

			// プロダクト論理削除
			entity.setDeleteflag(DeleteFlagConstant.DELETED);
			entity.setU_uid(LoginModel.getLoginInfo().getLoginuserid());
			entity.setU_time(new Timestamp(System.currentTimeMillis()));
			// DB更新
			cloud_userRepository.save(entity);
		}
		return ;

	}

	/*
	 * 配下ユーザの会社ID一覧取得
	 * @param model Cloud_deviceModel ユーザ情報
	 * @return List<Integer> 配下ユーザの会社ID一覧
	 *
	 */
	public List<Integer> getUnderCompanyIds(Cloud_deviceModel model) throws Exception {
		List<Cloud_userEntity> returnList = cloud_userRepository.getUnderUserCompanyIdsByUpperuserid(model.getTargetUserInfo().getTargetuserid());
		// 配下各社ID一覧を取得する
		boolean isMyCompanyExist = false;
		List<Integer> underUserCompanyIdList = new ArrayList<Integer>();
		for (Cloud_userEntity cloud_userEntity:returnList) {
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
	 * @return List<UserModel>
	 *
	 */
	public List<UserModel> getUserModelsByEntitys(List<Cloud_userEntity> entityList) throws Exception {


		List<Cloud_userModel> modelList = getModelsByEntitys(entityList);
		List<UserModel> userModelList = Util.getUserModels(modelList);
//		for (UserModel userModel:userModelList) {
//			// 会社情報を取得する
//			Optional<Cloud_companyEntity> company = cloud_companyRepository.findById(userModel.getCompanyid());
//			// 会社情報を設定する
//			userModel.setCompanyname(company.get().getCompanyname());
//
//			userModelList.add(userModel);
//		}
		return userModelList;

	}

	/*
	 * EntityリストからModelリスト取得
	 * @param entityList List<Cloud_userEntity>
	 * @return List<Cloud_userModel>
	 *
	 */
	public List<Cloud_userModel> getModelsByEntitys(List<Cloud_userEntity> entityList) throws Exception {

		List<Cloud_userModel> modelList = new ArrayList<Cloud_userModel>();
		for (Cloud_userEntity entity:entityList) {
			modelList.add(getModelByEntity(entity));
		}
		return modelList;

	}

	/*
	 * EntityからModel取得
	 * @param entity Cloud_deviceEntity
	 * @return Cloud_userModel
	 *
	 */
	public Cloud_userModel getModelByEntity(Cloud_userEntity entity) throws Exception {
		Cloud_userModel model = new Cloud_userModel();
		model.setUserid(entity.getUserid());
		model.setUsername(entity.getUsername());
		model.setLastName(entity.getLastname());
		model.setFirstName(entity.getFirstname());
		model.setEmail(entity.getEmail());
		model.setCompanyid(entity.getCompanyid());

		// 会社名取得
		Optional<Cloud_companyEntity> company = cloud_companyRepository.findById(entity.getCompanyid());
		if(!company.equals(Optional.empty())) {
			model.setCompanyname(company.get().getCompanyname());
		}
		model.setRole(entity.getRole());
		model.setUpperuserid(entity.getUpperuserid());

		// fullname設定
		model.setFullName(model.getLastName() + " " + model.getFirstName());
		model.setDeleteflag(entity.getDeleteflag());
		return model;

	}
}
