package com.ifocus.aaascloud.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.ifocus.aaascloud.entity.Cloud_companyEntity;
import com.ifocus.aaascloud.entity.Cloud_companyRepository;
import com.ifocus.aaascloud.entity.Cloud_userEntity;
import com.ifocus.aaascloud.entity.Cloud_userRepository;
import com.ifocus.aaascloud.model.Cloud_companyModel;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.model.LoginInfo;

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

	/*
	 * ログイン認証
	 *
	 *
	 */
	public Cloud_userModel login(String loginid, String pswd) throws Exception {
		Cloud_userModel model = new Cloud_userModel();
		model.setUserid(-1);
		List<Cloud_userEntity> list = cloud_userRepository.searchByLoginidAndPassword(loginid, pswd);
		if (list != null && list.size() == 1) {
			list.forEach(elm -> {
				model.setUserid(elm.getUserid());
				model.setUsername(elm.getUsername());
				model.setCompanyid(elm.getCompanyid());
				model.setLoginid(elm.getLoginid());
				model.setRole(elm.getRole());
				model.setUpperuserid(elm.getUpperuserid());
			});
		}
		return model;

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
		List<Cloud_userModel> returnList = new ArrayList();
		List<Cloud_userEntity> list = cloud_userRepository.getUsersByUpperuserid(loginid);
		if (list != null && list.size() == 1) {
			list.forEach(elm -> {
				Cloud_userModel model = new Cloud_userModel();
				model.setUserid(elm.getUserid());
				model.setUsername(elm.getUsername());
				model.setCompanyid(elm.getCompanyid());
				model.setLoginid(elm.getLoginid());
				model.setRole(elm.getRole());
				model.setUpperuserid(elm.getUpperuserid());
				/* 会社情報取得 */
				Optional<Cloud_companyEntity> entity = cloud_companyRepository.findById(model.getCompanyid());
				if (entity != null ) {
					model.setCompanyName(entity.get().getCompanyname());
				}
				/* デバイス数取得 Todo */
				/* ユーザ数取得 Todo */

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
	 * ユーザ登録
	 * @param loginInfo LoginInfo
	 * @param cloud_userModel Cloud_userModel
	 * @return userid Integer
	 */
	public Integer registerSonUser(LoginInfo loginInfo, Cloud_userModel model) throws Exception {

		// 会社IDが設定していない場合、
		if (model.getCompanyid() == null) {
			////////////////////////////////////////////////////////
			// 会社登録
			////////////////////////////////////////////////////////

			// 自社情報取得
			Optional<Cloud_companyEntity> myEntity = cloud_companyRepository.findById(loginInfo.getLogincompanyid());

			/* システム日時 */
			Timestamp systemTime = new Timestamp(System.currentTimeMillis());
			// 情報設定
			Cloud_companyEntity entity = new Cloud_companyEntity();
			entity.setCorporatenumber(model.getCorporatenumber());
			entity.setCompanyname(model.getCompanyName());
			entity.setAddress(model.getAddress());
			entity.setIndustry(model.getIndustry());
			entity.setMail(model.getMail());
			entity.setTel(model.getTel());
			entity.setFax(model.getFax());
			entity.setLevel(myEntity.get().getLevel() + 1);   	// レベルアップ
			entity.setAlive(0);									// セロ固定
			entity.setI_uid(loginInfo.getLoginuserid());
			entity.setI_time(systemTime);
			entity.setU_uid(loginInfo.getLoginuserid());
			entity.setU_time(systemTime);

			Cloud_companyModel insertedModel = cloud_companyService.registerCompany(entity);

			// 登録した会社IDを設定する
			model.setCompanyid(insertedModel.getCompanyid());

		}

		// 情報設定

		Cloud_userEntity entity = new Cloud_userEntity();
		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());
		// entity.setUserid(model.getUserid());  新規登録時に、useridがない。
		entity.setCompanyid(model.getCompanyid());
		entity.setUsername(model.getUsername());
		entity.setLoginid(model.getLoginid());
		entity.setPassword(model.getPassword());
		entity.setRole(model.getRole());
		entity.setUpperuserid(loginInfo.getLoginuserid());
		entity.setI_uid(loginInfo.getLoginuserid());
		entity.setI_time(systemTime);
		entity.setU_uid(loginInfo.getLoginuserid());
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


		// 会社情報取得
		Optional<Cloud_companyEntity> oldEntity = cloud_companyRepository.findById(model.getCompanyid());

		// 法人番号に変更がない場合
		if (oldEntity.get().getCorporatenumber() == model.getCorporatenumber()) {
			////////////////////////////////////////////////////////
			// 会社更新
			////////////////////////////////////////////////////////

			/* システム日時 */
			Timestamp systemTime = new Timestamp(System.currentTimeMillis());
			// 情報設定
			Cloud_companyEntity entity = new Cloud_companyEntity();
			entity.setCompanyid(model.getCompanyid());
			entity.setCorporatenumber(model.getCorporatenumber());
			entity.setCompanyname(model.getCompanyName());
			entity.setAddress(model.getAddress());
			entity.setIndustry(model.getIndustry());
			entity.setMail(model.getMail());
			entity.setTel(model.getTel());
			entity.setFax(model.getFax());
			entity.setU_uid(loginInfo.getLoginuserid());
			entity.setU_time(systemTime);

			cloud_companyService.updateCompany(entity);

		// 法人番号に変更があった場合
		} else {
			////////////////////////////////////////////////////////
			// 会社登録
			////////////////////////////////////////////////////////

			// 自社情報取得
			Optional<Cloud_companyEntity> myEntity = cloud_companyRepository.findById(loginInfo.getLogincompanyid());

			/* システム日時 */
			Timestamp systemTime = new Timestamp(System.currentTimeMillis());
			// 情報設定
			Cloud_companyEntity entity = new Cloud_companyEntity();
			entity.setCorporatenumber(model.getCorporatenumber());
			entity.setCompanyname(model.getCompanyName());
			entity.setAddress(model.getAddress());
			entity.setIndustry(model.getIndustry());
			entity.setMail(model.getMail());
			entity.setTel(model.getTel());
			entity.setFax(model.getFax());
			entity.setLevel(myEntity.get().getLevel() + 1);   // レベルアップ
			entity.setI_uid(loginInfo.getLoginuserid());
			entity.setI_time(systemTime);
			entity.setU_uid(loginInfo.getLoginuserid());
			entity.setU_time(systemTime);

			Cloud_companyModel insertedEntity = cloud_companyService.registerCompany(entity);

			// 登録した会社IDを設定する
			model.setCompanyid(insertedEntity.getCompanyid());
		}

		// 情報設定

		Cloud_userEntity entity = new Cloud_userEntity();
		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());
		entity.setUserid(model.getUserid());
		entity.setCompanyid(model.getCompanyid());
		entity.setUsername(model.getUsername());
		entity.setLoginid(model.getLoginid());
		entity.setPassword(model.getPassword());
		entity.setRole(model.getRole());
		entity.setU_uid(loginInfo.getLoginuserid());
		entity.setU_time(systemTime);

		Cloud_userEntity cloud_userEntity = cloud_userRepository.save(entity);
		return cloud_userEntity.getUserid();

	}

	/*
	 * ユーザ削除
	 * @param loginInfo LoginInfo
	 * @param cloud_userModel Cloud_userModel
	 */
	public void deleteSonUser(LoginInfo loginInfo, Cloud_userModel model) throws Exception {

		if (cloud_userRepository.existsById(model.getUserid())) {
			cloud_userRepository.deleteById(model.getUserid());
		}

	}

	/*
	 * アクセス権限ユーザ一覧を取得する
	 * @param userid Integer ログインユーザID
	 * @return List<Integer> アクセス権限を持つユーザ一覧
	 *
	 */
	public List<Integer> getAccessUsers(Integer userid) throws Exception {
		List<Integer> returnList = new ArrayList();
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

}
