package com.ifocus.aaascloud.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.ifocus.aaascloud.entity.Cloud_errlogEntity;
import com.ifocus.aaascloud.repository.Cloud_errlogRepository;
import com.ifocus.aaascloud.entity.Cloud_userEntity;
import com.ifocus.aaascloud.repository.Cloud_userRepository;
import com.ifocus.aaascloud.model.Cloud_errlogModel;

@SpringBootApplication
@RestController
@Service
@Transactional
public class Cloud_errlogService {

	@Autowired
	private Cloud_errlogRepository cloud_errlogRepository ;
	@Autowired
	private Cloud_userRepository cloud_userRepository ;

	/*
	 * エラーログ一覧情報取得
	 *
	 */
	public List<Cloud_errlogModel> getErrlogList(List<Integer> useridList,	List<String> imeiList, List<String> snList) {
		Cloud_errlogModel model = new Cloud_errlogModel();
		List<Cloud_errlogEntity> list = cloud_errlogRepository.searchErrlogsByUseridInOrDeviceIn(useridList,imeiList,snList);
		return getModelsByEntitys(list);

	}

	/*
	 * EntityリストからModeリストl取得
	 * @param entityList List<Cloud_errlogEntity> Entityリスト
	 * @return List<Cloud_errlogModel> Modeリスト
	 *
	 */
	public List<Cloud_errlogModel> getModelsByEntitys(List<Cloud_errlogEntity> entityList) {
		List<Cloud_errlogModel> modelList = new ArrayList<Cloud_errlogModel>();
		for (Cloud_errlogEntity entity:entityList) {
			modelList.add(getModelByEntity(entity));
		}

		return modelList;

	}

	/*
	 * EntityからModel取得
	 * @param entity Cloud_productEntity
	 * @return Cloud_errlogModel
	 *
	 */
	public Cloud_errlogModel getModelByEntity(Cloud_errlogEntity entity) {
		Cloud_errlogModel model = new Cloud_errlogModel();
		model.setRowid(entity.getRowid());
		model.setUserid(entity.getUserid());

		// ユーザー名
		Optional<Cloud_userEntity> user = cloud_userRepository.findById(entity.getUserid());
		if (user.isPresent()) {
			model.setUsername(user.get().getLastname() + " " + user.get().getFirstname());
		}

		model.setDevice(entity.getDevice());
		model.setStatusflag(entity.getStatusflag());
		model.setDatatime(entity.getDatatime());
		model.setSystemsort(entity.getSystemsort());
		model.setSystemid(entity.getSystemid());
		model.setComponentid(entity.getComponentid());
		model.setMessageid(entity.getMessageid());
		model.setMessagesort(entity.getMessagesort());
		model.setErrcode(entity.getErrcode());
		model.setErrMessage(entity.getErrMessage());
		model.setAlive(entity.getAlive());

		// 画面表示用項目設定
		model.setStatusInStr();

		return model;

	}

}
