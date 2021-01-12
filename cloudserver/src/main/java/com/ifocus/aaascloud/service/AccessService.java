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
import com.ifocus.aaascloud.entity.Cloud_companyEntity;
import com.ifocus.aaascloud.entity.Cloud_companyRepository;
import com.ifocus.aaascloud.entity.Cloud_userEntity;
import com.ifocus.aaascloud.entity.Cloud_userRepository;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.model.LoginInfo;

@SpringBootApplication
@RestController
@Service
@Transactional
public class AccessService {

	@Autowired
	private Cloud_userRepository cloud_userRepository ;
	@Autowired
	private Cloud_companyRepository cloud_companyRepository ;

	/*
	 * プロダクトアクセス権限をチェックする
	 * @param loginInfo LoginInfo ログインユーザ情報
	 * @return boolean
	 *         true = アクセス可能
	 *         false = アクセス不可
	 *
	 */
	public boolean checkProductAccess(LoginInfo loginInfo) throws Exception {
		try {
			Optional<Cloud_companyEntity> entity = cloud_companyRepository.findById(loginInfo.getLogincompanyid());
			return (entity.get().getCorporatenumber() == CorporateNumberConstant.COM_I_FOCUS);
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return false;
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

	/*
	 * アクセス権限ユーザ一覧を取得する
	 * @param userid Integer ログインユーザID
	 * @return List<Cloud_userModel> アクセス権限を持つユーザ一覧
	 *
	 */
	public List<Cloud_userModel> getAccessModelUsers(Integer userid) throws Exception {
		List<Cloud_userModel> returnList = new ArrayList();
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
	 * ユーザーモデル取得
	 * @param entity Cloud_userEntity ユーザエンティティ
	 * @return Cloud_userModel ユーザモデル
	 *
	 */
	public Cloud_userModel getModel(Cloud_userEntity entity) throws Exception {
		Cloud_userModel model = new Cloud_userModel();
		model.setUserid(entity.getUserid());
		model.setUsername(entity.getUsername());
		return model;

	}
}
