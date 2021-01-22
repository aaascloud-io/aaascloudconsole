package com.ifocus.aaascloud.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.ifocus.aaascloud.constant.AliveConstant;
import com.ifocus.aaascloud.entity.Cloud_versionEntity;
import com.ifocus.aaascloud.entity.Cloud_versionRepository;
import com.ifocus.aaascloud.model.Cloud_versionModel;

@SpringBootApplication
@RestController
@Service
@Transactional
public class Cloud_versionService {

	@Autowired
	private Cloud_versionRepository cloud_versionRepository;

	/*
	 * バージョン一覧を取得する
	 * @param productid Integer バージョンモデル
	 * @return List<Cloud_versionModel> バージョン一覧
	 *
	 */
	public List<Cloud_versionModel> getVersionList(Integer productid) throws Exception {
		List<Cloud_versionEntity> list = cloud_versionRepository.findByProductid(productid);
		return getModelsByEntitys(list);
	}

	/*
	 * バージョン登録
	 * @param entity Cloud_versionEntity バージョンEntity
	 * @return Cloud_versionModel 登録済みバージョン
	 *
	 */
	public Cloud_versionModel registerVersion(Cloud_versionModel model) throws Exception {
		Cloud_versionEntity insertedEntity = cloud_versionRepository.save(getEntitByModel(model));
		return getCloud_versionModel(insertedEntity);

	}

	/*
	 * バージョン削除
	 * @param entity Cloud_versionEntity バージョンEntity
	 *
	 */
	public void deleteVersion(Integer versionId) throws Exception {
		cloud_versionRepository.deleteById(versionId);
	}

	/*
	 * バージョンEntityリストからバージョンModeリストl取得
	 * @param entityList List<Cloud_versionEntity> バージョンEntityリスト
	 * @return List<Cloud_versionModel> バージョンModeリスト
	 *
	 */
	private List<Cloud_versionModel> getModelsByEntitys(List<Cloud_versionEntity> entityList) throws Exception {
		List<Cloud_versionModel> modelList = new ArrayList();
		for (Cloud_versionEntity entity:entityList) {
			modelList.add(getCloud_versionModel(entity));
		}

		return modelList;

	}

	/*
	 * バージョンモデル取得
	 * @param entity Cloud_companyEntity バージョンエンティティ
	 * @return Cloud_versionModel バージョンモデル
	 *
	 */
	private Cloud_versionModel getCloud_versionModel(Cloud_versionEntity entity) throws Exception {
		Cloud_versionModel model = new Cloud_versionModel();
		model.setRowid(entity.getRowid());
		model.setProductid(entity.getProductid());
		model.setVersioncode(entity.getVersioncode());
		model.setVersionname(entity.getVersionname());
		model.setDownloadurl(entity.getDownloadurl());
		model.setDescription(entity.getDescription());
		return model;

	}

	/*
	 * ModelからEntity取得(登録用)
	 * @param model Cloud_versionModel
	 * @return Cloud_versionEntity
	 *
	 */
	private Cloud_versionEntity getEntitByModel(Cloud_versionModel model) throws Exception {

		Cloud_versionEntity entity = new Cloud_versionEntity();

		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());

		// 情報設定
		entity.setProductid(model.getProductid());
		entity.setVersioncode(model.getVersioncode());
		entity.setVersionname(model.getVersionname());
		entity.setDownloadurl(model.getDownloadurl());
		entity.setDescription(model.getDescription());
		entity.setAlive(AliveConstant.ALIVE);
		entity.setI_uid(model.getLoginInfo().getLoginuserid());
		entity.setI_time(systemTime);
		entity.setU_uid(model.getLoginInfo().getLoginuserid());
		entity.setU_time(systemTime);

		return entity;

	}
}
