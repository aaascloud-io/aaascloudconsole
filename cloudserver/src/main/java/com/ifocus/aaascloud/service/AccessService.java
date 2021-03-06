package com.ifocus.aaascloud.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.ifocus.aaascloud.constant.CorporateNumberConstant;
import com.ifocus.aaascloud.constant.ErrorConstant;
import com.ifocus.aaascloud.entity.Cloud_companyEntity;
import com.ifocus.aaascloud.repository.Cloud_companyRepository;
import com.ifocus.aaascloud.entity.Cloud_displaysettingsEntity;
import com.ifocus.aaascloud.repository.Cloud_displaysettingsRepository;
import com.ifocus.aaascloud.entity.Cloud_userEntity;
import com.ifocus.aaascloud.repository.Cloud_userRepository;
import com.ifocus.aaascloud.model.Cloud_companyModel;
import com.ifocus.aaascloud.model.Cloud_displaysettingsModel;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.model.LoginInfo;
import com.ifocus.aaascloud.model.ReturnModel;

@SpringBootApplication
@RestController
@Service
@Transactional
public class AccessService {

	@Autowired
	private Cloud_userRepository cloud_userRepository ;
	@Autowired
	private Cloud_companyRepository cloud_companyRepository ;
	@Autowired
	private Cloud_displaysettingsRepository cloud_displaysettingsRepository;

	/*
	 * OEMアクセス権限をチェックする
	 * @param loginInfo LoginInfo ログインユーザ情報
	 * @return boolean
	 *         true = アクセス可能
	 *         false = アクセス不可
	 *
	 */
	public boolean checkOEMAccess(LoginInfo loginInfo) {
		try {
			Optional<Cloud_companyEntity> entity = cloud_companyRepository.findById(loginInfo.getLogincompanyid());
			return CorporateNumberConstant.COM_I_FOCUS.equals(entity.get().getCorporatenumber());
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return false;
		}
	}

	/*
	 * ユーザ登録権限をチェックする
	 * @param cloud_userModel Cloud_userModel 登録ユーザ対象情報
	 * @return ReturnModel
	 *         0000 = アクセス可能
	 *         0011 = 会社新規の場合、最初に管理者を登録してください。
	 *         0012 = 自社ユーザ新規の場合、管理者権限が必要です。
	 *         0013 = 管理者を追加するには、上位会社に依頼してください。
	 *
	 */
	public ReturnModel checkAddUserAccess(Cloud_userModel cloud_userModel) {

//		LoginInfo loginInfo = cloud_userModel.getLoginInfo();
//
//		// 会社新規の場合
//		if (cloud_userModel.getCompanyid() == null) {
//			// 登録ユーザが管理者でない場合、
//			if (cloud_userModel.getRole() != RoleConstant.ADMIN) {
//				return new ReturnModel(ErrorConstant.ERROR_CODE_0011, ErrorConstant.ERROR_MSG_0011);
//			}
//		// 既存会社の場合
//		} else {
//			// 自社の場合
//			if (loginInfo.getLogincompanyid() == cloud_userModel.getCompanyid()) {
//				// admin権限以外の場合、
//				if (RoleConstant.ADMIN != loginInfo.getLoginrole() ) {
//					return new ReturnModel(ErrorConstant.ERROR_CODE_0012, ErrorConstant.ERROR_MSG_0012);
//				}
//				// 登録ユーザが管理者である場合、
//				if (cloud_userModel.getRole() == RoleConstant.ADMIN ) {
//					return new ReturnModel(ErrorConstant.ERROR_CODE_0013, ErrorConstant.ERROR_MSG_0013);
//				}
//			// 配下会社の場合
//			} else {
//			}
//		}
		return new ReturnModel(ErrorConstant.ERROR_CODE_0000, ErrorConstant.ERROR_MSG_0000);
	}

	/*
	 * アクセス権限ユーザ一覧を取得する
	 * @param userid Integer ログインユーザID
	 * @return List<Integer> アクセス権限を持つユーザ一覧
	 *
	 */
	public List<Integer> getAccessUsers(Integer userid) {
		List<Integer> returnList = new ArrayList<Integer>();
		returnList.add(userid);
//		List<Cloud_userEntity> list = cloud_userRepository.getUsersByUpperuserid(userid);
		List<Cloud_userEntity> list = cloud_userRepository.getUsersByUpperuseridDelete(userid);
		if (list.isEmpty()) {
			return returnList;
		} else {
			for (Cloud_userEntity entity:list) {
				returnList.addAll(getAccessUsers(entity.getUserid()));
			}
			return returnList;
		}
	}
	
	public List<Integer> getNotDelAccessUsers(Integer userid) {
		List<Integer> returnList = new ArrayList<Integer>();
		returnList.add(userid);
		List<Cloud_userEntity> list = cloud_userRepository.getUsersByUpperuserid(userid);
		if (list.isEmpty()) {
			return returnList;
		} else {
			for (Cloud_userEntity entity:list) {
				returnList.addAll(getAccessUsers(entity.getUserid()));
			}
			return returnList;
		}
	}

	/*
	 * アクセス権限ユーザ一覧を取得する(本ユーザーと一層子ユーザー)
	 * @param userid Integer ログインユーザID
	 * @return List<Integer> アクセス権限を持つユーザ一覧
	 *
	 */
	public List<Integer> getMyAccessUsers(Integer userid) throws Exception {
		List<Integer> returnList = new ArrayList<Integer>();
		returnList.add(userid);
		List<Cloud_userEntity> list = cloud_userRepository.getUsersByUpperuserid(userid);

		if (list.isEmpty()) {
			return returnList;
		} else {
			for (Cloud_userEntity entity:list) {
				returnList.add(entity.getUserid());
			}
			return returnList;
		}
	}

	/*
	 * アクセス権限ユーザ一覧を取得する
	 * @param userid Integer ログインユーザID
	 * @return List<Cloud_userModel> アクセス権限を持つユーザ一覧
	 *
	 */
	public List<Cloud_userModel> getAccessModelUsers(Integer userid) throws Exception {
		List<Cloud_userModel> returnList = new ArrayList<Cloud_userModel>();
		returnList.add(getModel(cloud_userRepository.findById(userid).get()));
		List<Cloud_userEntity> list = cloud_userRepository.getUsersByUpperuserid(userid);
		if (list.isEmpty()) {
			return returnList;
		} else {
			for (Cloud_userEntity entity:list) {
				returnList.addAll(getAccessModelUsers(entity.getUserid()));
			}
			return returnList;
		}
	}

	/*
	 * アクセス権限ユーザ一覧を取得する
	 * @param userid Integer ログインユーザID
	 * @return List<Cloud_userModel> アクセス権限を持つユーザ一覧
	 *
	 */
	public Cloud_userModel getAccessModelUsersInTree(Integer userid) throws Exception {
		Cloud_userModel model = new Cloud_userModel();
		model.setParent(getModel(cloud_userRepository.findById(userid).get()));
		List<Cloud_userEntity> list = cloud_userRepository.getUsersByUpperuserid(userid);
		if (list.isEmpty()) {
			return model;
		} else {
			for (Cloud_userEntity entity:list) {
				Cloud_userModel child = getAccessModelUsersInTree(entity.getUserid());
				model.addToCloud_userModelList(child);
			}
			return model;
		}
	}

	/*
	 * 代理店情報を取得する
	 * @param userid Integer ログインユーザID
	 * @return Cloud_userModel 代理店情報モデル
	 *
	 */
	public Cloud_userModel getAgencyCompany(Integer userid) throws Exception {

		Cloud_companyEntity companyEntity = cloud_companyRepository.findCompanyByUserid(userid);
		Optional<Cloud_userEntity> userEntity = cloud_userRepository.findById(userid);
		Cloud_userModel model = getUserModel(companyEntity, userEntity.get());

		if (model == null) {
			return null;
		} else {
			// レベル1級の代理店を探す
			while (model.getLevel() != 1) {
				Cloud_companyEntity entity = cloud_companyRepository.findCompanyByUserid(model.getUpperuserid());
				if (entity == null) {
					return null;
				}
				Optional<Cloud_userEntity> cloud_userEntity = cloud_userRepository.findById(model.getUpperuserid());
				model = getUserModel(companyEntity, userEntity.get());
			}
		}
		return model;

	}

	/*
	 * 画面表示項目情報を取得する
	 * @param companyid Integer 会社ID
	 * @return Cloud_displaysettingsModel 画面表示項目情報モデル
	 *
	 */
	public List<Cloud_displaysettingsModel> getCompanyDisplayInfo(Integer companyid) throws Exception {

		List<Cloud_displaysettingsEntity> entityList = cloud_displaysettingsRepository.searchCompanyDisplayInfoByCompanyid(companyid);

		return getModelsByEntitys(entityList);

	}

	/*
	 * 会社モデル取得
	 * @param entity Cloud_companyEntity 会社エンティティ
	 * @return Cloud_companyModel 会社モデル
	 *
	 */
	private Cloud_companyModel getCompanyModel(Cloud_companyEntity entity) throws Exception {
		Cloud_companyModel model = new Cloud_companyModel();
		model.setCompanyid(entity.getCompanyid());
		model.setCompanyname(entity.getCompanyname());
		model.setCorporatenumber(entity.getCorporatenumber());
		model.setAddress(entity.getAddress());
		model.setIndustry(entity.getIndustry());
		model.setMail(entity.getMail());
		model.setTel(entity.getTel());
		model.setFax(entity.getFax());
		model.setLevel(entity.getLevel());
		return model;

	}

	/*
	 * ユーザーモデル取得
	 * @param entity Cloud_userEntity ユーザエンティティ
	 * @return Cloud_userModel ユーザモデル
	 *
	 */
	private Cloud_userModel getModel(Cloud_userEntity entity) throws Exception {
		Cloud_userModel model = new Cloud_userModel();
		model.setUserid(entity.getUserid());
		model.setUsername(entity.getUsername());
		return model;

	}

	/*
	 * ユーザモデル取得
	 * @param entity Cloud_companyEntity 会社エンティティ
	 * @param cloud_userEntity Cloud_userEntity ユーザエンティティ
	 * @return Cloud_userModel ユーザモデル
	 *
	 */
	private Cloud_userModel getUserModel(Cloud_companyEntity entity,Cloud_userEntity cloud_userEntity) throws Exception {
		Cloud_userModel model = new Cloud_userModel();
		model.setCompanyid(entity.getCompanyid());
		model.setCompanyname(entity.getCompanyname());
		model.setCorporatenumber(entity.getCorporatenumber());
		model.setAddress(entity.getAddress());
		model.setIndustry(entity.getIndustry());
		model.setMail(entity.getMail());
		model.setTel(entity.getTel());
		model.setFax(entity.getFax());
		model.setLevel(entity.getLevel());

		model.setUserid(cloud_userEntity.getUserid());
		model.setUsername(cloud_userEntity.getUsername());
		return model;

	}

	/*
	 * 画面表示項目設定Entityリストから画面表示項目設定Modeリストl取得
	 * @param entityList List<Cloud_displaysettingsEntity> 画面表示項目設定Entityリスト
	 * @return List<Cloud_displaysettingsModel> 画面表示項目設定Modeリスト
	 *
	 */
	private List<Cloud_displaysettingsModel> getModelsByEntitys(List<Cloud_displaysettingsEntity> entityList) throws Exception {
		List<Cloud_displaysettingsModel> modelList = new ArrayList<Cloud_displaysettingsModel>();
		for (Cloud_displaysettingsEntity entity:entityList) {
			modelList.add(getDisplaysettingsModelModel(entity));
		}

		return modelList;

	}

	/*
	 * 画面表示項目設定モデル取得
	 * @param entity Cloud_companyEntity 画面表示項目設定エンティティ
	 * @return Cloud_displaysettingsModel 画面表示項目設定モデル
	 *
	 */
	private Cloud_displaysettingsModel getDisplaysettingsModelModel(Cloud_displaysettingsEntity entity) throws Exception {
		Cloud_displaysettingsModel model = new Cloud_displaysettingsModel();
		model.setCompanyid(entity.getCompanyid());
		model.setDisplayorder(entity.getDisplayorder());
		model.setTitleitemname(entity.getTitleitemname());
		model.setTitledisplayname(entity.getTitledisplayname());
		return model;

	}

}
