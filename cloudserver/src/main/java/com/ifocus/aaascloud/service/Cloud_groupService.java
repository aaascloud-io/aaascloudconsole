package com.ifocus.aaascloud.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.ifocus.aaascloud.entity.Cloud_groupEntity;
import com.ifocus.aaascloud.entity.Cloud_groupRepository;
import com.ifocus.aaascloud.model.Cloud_groupModel;

@SpringBootApplication
@RestController
@Service
@Transactional
public class Cloud_groupService {

	@Autowired
	private Cloud_groupRepository cloud_groupRepository ;

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
	 *
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
	 *
	 */
	public List<Cloud_groupModel> getModelsByEntitys(List<Cloud_groupEntity> entityList) throws Exception {
		List<Cloud_groupModel> modelList = new ArrayList();
		for (Cloud_groupEntity entity:entityList) {
			modelList.add(getModelByEntity(entity));
		}

		return modelList;

	}

}














