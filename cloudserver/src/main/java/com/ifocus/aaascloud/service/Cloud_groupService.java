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

import com.ifocus.aaascloud.constant.AliveConstant;
import com.ifocus.aaascloud.constant.GroupConstant;
import com.ifocus.aaascloud.entity.Cloud_deviceEntity;
import com.ifocus.aaascloud.entity.Cloud_deviceRepository;
import com.ifocus.aaascloud.entity.Cloud_groupEntity;
import com.ifocus.aaascloud.entity.Cloud_groupRepository;
import com.ifocus.aaascloud.model.Cloud_groupModel;
import com.ifocus.aaascloud.model.Cloud_projectDetailModel;

@SpringBootApplication
@RestController
@Service
@Transactional
public class Cloud_groupService {

	@Autowired
	private Cloud_groupRepository cloud_groupRepository ;
	@Autowired
	private Cloud_deviceRepository cloud_deviceRepository ;

	/*
	 * グループ情報取得
	 *
	 */
	public Cloud_groupModel getGroupInfo(Integer groupid) throws Exception {
		Cloud_groupModel model = new Cloud_groupModel();
		Optional<Cloud_groupEntity> entity = cloud_groupRepository.findById(groupid);
		if (entity != null ) {
			model.setGroupid(entity.get().getGroupid());
			model.setProjectid(entity.get().getProjectid());
			model.setGroupname(entity.get().getGroupname());
			model.setAlive(entity.get().getAlive());
		}
		return model;

	}

	/*
	 * グループ一括登録
	 * @param groupList List<Cloud_groupModel> グループリスト
	 *
	 */
	public void registerGroups(List<Cloud_groupModel> groupList) throws Exception {

		for (Cloud_groupModel model:groupList) {

			////////////////////////////////////////////////////////
			// グループ登録
			////////////////////////////////////////////////////////
			Cloud_groupModel returnModel = this.registerGroup(this.getModelByEntity(model));

			////////////////////////////////////////////////////////
			// グループデバイス更新
			////////////////////////////////////////////////////////

			// 更新対象デバイス取得
			Iterable<Cloud_deviceEntity> entityList = cloud_deviceRepository.findAllById(model.getDeviceidList());
			// 更新情報設定
			this.setUpdateInfoToEntity(model, entityList);
			// グループデバイス一括更新
			cloud_deviceRepository.saveAll(entityList);
		}
		return;
	}

	/*
	 * グループ登録
	 *
	 */
	public Cloud_groupModel registerGroup(Cloud_groupEntity entity) throws Exception {
		Cloud_groupModel model = new Cloud_groupModel();
		Cloud_groupEntity insertedEntity = cloud_groupRepository.save(entity);
		if (insertedEntity != null ) {
			model.setGroupid(insertedEntity.getGroupid());
			model.setProjectid(insertedEntity.getProjectid());
			model.setGroupname(insertedEntity.getGroupname());
			model.setAlive(insertedEntity.getAlive());
		}
		return model;

	}

	/*
	 * グループ更新
	 *
	 */
	public Cloud_groupModel updateGroup(Cloud_groupEntity entity) throws Exception {
		Cloud_groupModel model = new Cloud_groupModel();
		Cloud_groupEntity updatedEntity = cloud_groupRepository.save(entity);
		if (updatedEntity != null ) {
			model.setGroupid(updatedEntity.getGroupid());
			model.setProjectid(updatedEntity.getProjectid());
			model.setGroupname(updatedEntity.getGroupname());
			model.setAlive(updatedEntity.getAlive());
		}
		return model;

	}

	/*
	 * グループ削除
	 *
	 */
	public void deleteGroup(Cloud_groupEntity entity) throws Exception {
		cloud_groupRepository.deleteById(entity.getGroupid());
	}


	/*
	 * EntityからModel取得
	 * @param entity Cloud_groupEntity
	 * @return Cloud_groupModel
	 *
	 */
	public Cloud_groupModel getModelByEntity(Cloud_groupEntity entity) throws Exception {
		Cloud_groupModel model = new Cloud_groupModel();
		model.setGroupid(entity.getGroupid());
		model.setProjectid(entity.getProjectid());
		model.setGroupname(entity.getGroupname());
		model.setAlive(entity.getAlive());

		return model;

	}

	/*
	 * EntityリストからModeリストl取得
	 *
	 * @param entityList List<Cloud_groupEntity>
	 * @return List<Cloud_groupModel>
	 */
	public List<Cloud_groupModel> getModelsByEntitys(List<Cloud_groupEntity> entityList) throws Exception {
		List<Cloud_groupModel> modelList = new ArrayList();
		for (Cloud_groupEntity entity:entityList) {
			modelList.add(getModelByEntity(entity));
		}

		return modelList;

	}

	/*
	 * ModelからEntity取得
	 * @param Cloud_groupModel
	 * @return Cloud_groupEntity
	 *
	 */
	public Cloud_groupEntity getModelByEntity(Cloud_groupModel model) throws Exception {
		Cloud_groupEntity entity = new Cloud_groupEntity();

		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());
		entity.setProjectid(model.getProjectid());
		entity.setGroupname(model.getGroupname());
		entity.setSummary(model.getSummary());
		entity.setAlive(AliveConstant.ALIVE);
		entity.setI_uid(model.getLoginInfo().getLoginuserid());
		entity.setI_time(systemTime);
		entity.setU_uid(model.getLoginInfo().getLoginuserid());
		entity.setU_time(systemTime);

		return entity;

	}

	/*
	 * 更新情報設定(グループデバイス更新用)
	 * @param model Cloud_groupModel
	 * @param entityList Iterable<Cloud_groupEntity>
	 *
	 */
	public void setUpdateInfoToEntity(Cloud_groupModel model, Iterable<Cloud_deviceEntity> entityList) throws Exception {

		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());
		entityList.forEach(entity ->{
			entity.setLastprojectId(entity.getProjectid());
			entity.setProjectid(model.getProjectid());
			entity.setLastgroupid(entity.getLastgroupid());
			entity.setGroupid(model.getGroupid());
			entity.setU_uid(model.getLoginInfo().getLoginuserid());
			entity.setU_time(systemTime);
		});

		return ;

	}

	/*
	 * 更新情報設定(プロジェクトデバイス更新用)
	 * @param model Cloud_groupModel
	 * @param entityList Iterable<Cloud_groupEntity>
	 *
	 */
	public void setUpdateInfoToEntity(Cloud_projectDetailModel model, Iterable<Cloud_deviceEntity> entityList) throws Exception {

		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());
		entityList.forEach(entity ->{
			entity.setLastprojectId(entity.getProjectid());
			entity.setProjectid(model.getProjectid());
			entity.setLastgroupid(entity.getLastgroupid());
			entity.setGroupid(GroupConstant.NOT_SET);
			entity.setU_uid(model.getLoginInfo().getLoginuserid());
			entity.setU_time(systemTime);
		});

		return ;

	}

}














