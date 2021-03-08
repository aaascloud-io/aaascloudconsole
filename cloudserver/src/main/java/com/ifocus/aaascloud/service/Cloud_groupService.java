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
import com.ifocus.aaascloud.entity.Cloud_deviceEntity;
import com.ifocus.aaascloud.entity.Cloud_deviceRepository;
import com.ifocus.aaascloud.entity.Cloud_groupEntity;
import com.ifocus.aaascloud.entity.Cloud_groupRepository;
import com.ifocus.aaascloud.entity.Cloud_projectEntity;
import com.ifocus.aaascloud.entity.Cloud_projectRepository;
import com.ifocus.aaascloud.model.Cloud_groupModel;
import com.ifocus.aaascloud.model.LoginInfo;

@SpringBootApplication
@RestController
@Service
@Transactional
public class Cloud_groupService {

	@Autowired
	private Cloud_groupRepository cloud_groupRepository ;
	@Autowired
	private Cloud_deviceRepository cloud_deviceRepository ;
	@Autowired
	private Cloud_projectRepository cloud_projectRepository ;

	@Autowired
	private Cloud_deviceService cloud_deviceService ;

	/*
	 * グループ一覧取得
	 * @param projectid Integer プロジェクトID
	 * @return List<Cloud_groupModel> グループ一覧
	 *
	 */
	public List<Cloud_groupModel> getGroups(Integer projectid) throws Exception {

		List<Cloud_groupEntity> entityList = cloud_groupRepository.searchGroupsByProjectid(projectid);

		return getModelsByEntitys(entityList);

	}

	/*
	 * グループ検索
	 * @param projectid Integer プロジェクトID
	 * @return List<Cloud_groupModel> グループ一覧
	 *
	 */
	public List<Cloud_groupModel> searchGroups(Cloud_groupModel model) throws Exception {

		List<Cloud_groupEntity> entityList = cloud_groupRepository.searchGroupsByProjectnameAndGroupname(model.getProjectnameForSearch(), model.getGroupnameForSearch());

		return getModelsByEntitys(entityList);

	}

	/*
	 * グループ情報取得
	 *
	 */
	public Cloud_groupModel getGroupInfo(Cloud_groupModel cloud_groupModel) throws Exception {
		Cloud_groupModel model = new Cloud_groupModel();
		Optional<Cloud_groupEntity> entity = cloud_groupRepository.findById(cloud_groupModel.getGroupid());
		if (!entity.isPresent()) {
			model = getModelByEntity(entity.get());
//			model.setGroupid(entity.get().getGroupid());
//			model.setProjectid(entity.get().getProjectid());
//			model.setGroupname(entity.get().getGroupname());
//			model.setAlive(entity.get().getAlive());
//			// デバイス数設定
//			model.setGroupDeviceCounts(cloud_deviceRepository.getGroupDeviceCountsByProjectidAndGroupid(entity.get().getProjectid(), cloud_groupModel.getGroupid()));
//			// デバイス一覧設定
//			model.setDeviceList(cloud_deviceService.getGroupDevices(entity.get().getProjectid(), cloud_groupModel.getGroupid()));
		}
		return model;

	}

	/*
	 * グループ一括登録
	 * @param groupList List<Cloud_groupModel> グループリスト
	 *
	 */
	public void registerGroups(List<Cloud_groupModel> groupList) throws Exception {
		if (groupList != null && groupList.size() > 0) {
			for (Cloud_groupModel model:groupList) {

				////////////////////////////////////////////////////////
				// グループ登録
				////////////////////////////////////////////////////////
				this.registerGroup(model);

				////////////////////////////////////////////////////////
				// グループデバイス更新
				////////////////////////////////////////////////////////

				// 更新対象デバイス取得
				Iterable<Cloud_deviceEntity> entityList = cloud_deviceRepository.findAllById(model.getDeviceIdList());
				// 更新情報設定
				this.setUpdateInfoToEntityForGroupDevice(model, entityList);
				// グループデバイス一括更新
				cloud_deviceRepository.saveAll(entityList);
			}
		}
	}

	/*
	 * グループ登録
	 *
	 */
	public Cloud_groupModel registerGroup(Cloud_groupModel cloud_groupModel) throws Exception {
		Cloud_groupModel model = new Cloud_groupModel();
		Cloud_groupEntity insertedEntity = cloud_groupRepository.save(getEntityByModel(cloud_groupModel));
		if (insertedEntity != null ) {
			model.setGroupid(insertedEntity.getGroupid());
			model.setProjectid(insertedEntity.getProjectid());
			model.setGroupname(insertedEntity.getGroupname());
			model.setSummary(insertedEntity.getSummary());
			model.setAlive(insertedEntity.getAlive());
		}
		return model;

	}

//	/*
//	 * グループ一括更新
//	 * @param groupList List<Cloud_groupModel> グループリスト
//	 *
//	 */
//	public void updateGroups(List<Cloud_groupModel> groupList) throws Exception {
//		if (groupList != null && !groupList.isEmpty()) {
//			for (Cloud_groupModel model:groupList) {
//
//				////////////////////////////////////////////////////////
//				// グループ更新
//				////////////////////////////////////////////////////////
//				Cloud_groupModel returnModel = updateGroup(model);
//
//				////////////////////////////////////////////////////////
//				// グループデバイス更新
//				////////////////////////////////////////////////////////
//
//				// 更新対象デバイス取得
//				Iterable<Cloud_deviceEntity> entityList = cloud_deviceRepository.findAllById(model.getDeviceIdList());
//				// 更新情報設定
//				this.setUpdateInfoToEntityForGroupDevice(model, entityList);
//				// グループデバイス一括更新
//				cloud_deviceRepository.saveAll(entityList);
//			}
//		}
//
//		return;
//	}

	/*
	 * グループ更新
	 *
	 */
	public Cloud_groupModel updateGroup(Cloud_groupModel cloud_groupModel) throws Exception {
		Cloud_groupModel model = new Cloud_groupModel();
		Cloud_groupEntity updatedEntity = cloud_groupRepository.save(getEntityByModelForUpdate(cloud_groupModel));
		if (updatedEntity != null ) {
			model.setGroupid(updatedEntity.getGroupid());
			model.setProjectid(updatedEntity.getProjectid());
			model.setGroupname(updatedEntity.getGroupname());
			model.setSummary(updatedEntity.getSummary());
			model.setAlive(updatedEntity.getAlive());
		}
		return model;

	}

	/*
	 * グループ一括削除
	 * @param groupList List<Cloud_groupModel> グループリスト
	 *
	 */
	public void deleteGroups(Cloud_groupModel cloud_groupModel) throws Exception {

		if (cloud_groupModel.getGroupidList() != null && !cloud_groupModel.getGroupidList().isEmpty()) {
			for (Integer groupid:cloud_groupModel.getGroupidList()) {

				////////////////////////////////////////////////////////
				// グループ削除
				////////////////////////////////////////////////////////
				deleteGroup(cloud_groupModel.getLoginInfo(), groupid);

			}
		}

		return;
	}

	/*
	 * グループ削除
	 *
	 */
	public void deleteGroup(LoginInfo loginInfo, Integer groupid) throws Exception {

		// デバイスのグループ情報をクリア
		cloud_deviceService.clearGroupInfoForDelete(loginInfo, groupid);
		// グループ削除
		cloud_groupRepository.deleteById(groupid);
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
		model.setSummary(entity.getSummary());
		model.setAlive(entity.getAlive());

		// プロジェクト情報取得&設定
		Optional<Cloud_projectEntity> project  = cloud_projectRepository.findById(entity.getProjectid());
		if (!project.isPresent()) {
			model.setProjectname(project.get().getProjectname());
		}

		// デバイス一覧取得
		List<Cloud_deviceEntity>  list = cloud_deviceRepository.searchDevicesByProjectidAndGroupid(entity.getProjectid(), entity.getGroupid());
		model.setDeviceList(cloud_deviceService.getModelsByEntitys(list));
		model.setGroupDeviceCounts(list.size());

		return model;

	}

	/*
	 * EntityリストからModeリストl取得
	 *
	 * @param entityList List<Cloud_groupEntity>
	 * @return List<Cloud_groupModel>
	 */
	public List<Cloud_groupModel> getModelsByEntitys(List<Cloud_groupEntity> entityList) throws Exception {
		List<Cloud_groupModel> modelList = new ArrayList<Cloud_groupModel>();
		if (entityList != null && entityList.size() > 0) {
			for (Cloud_groupEntity entity:entityList) {
				modelList.add(getModelByEntity(entity));
			}
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
	 * ModelからEntity取得（登録用）
	 * @param Cloud_groupModel
	 * @return Cloud_groupEntity
	 *
	 */
	public Cloud_groupEntity getEntityByModel(Cloud_groupModel model) throws Exception {

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
	 * ModelからEntity取得（更新用）
	 * @param Cloud_groupModel
	 * @return Cloud_groupEntity
	 *
	 */
	public Cloud_groupEntity getEntityByModelForUpdate(Cloud_groupModel model) throws Exception {
		Optional<Cloud_groupEntity> group = cloud_groupRepository.findById(model.getGroupid());
		Cloud_groupEntity entity = group.get();

		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());
		entity.setProjectid(model.getProjectid());
		entity.setGroupname(model.getGroupname());
		entity.setSummary(model.getSummary());
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
	public void setUpdateInfoToEntityForGroupDevice(Cloud_groupModel model, Iterable<Cloud_deviceEntity> entityList) throws Exception {

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

//	/*
//	 * 更新情報設定(プロジェクトデバイス更新用)
//	 * @param model Cloud_projectDetailModel
//	 * @param entityList Iterable<Cloud_groupEntity>
//	 *
//	 */
//	public void setUpdateInfoToEntityForProjectDevice(Cloud_projectDetailModel model, Iterable<Cloud_deviceEntity> entityList) throws Exception {
//
//		/* システム日時 */
//		Timestamp systemTime = new Timestamp(System.currentTimeMillis());
//		entityList.forEach(entity ->{
//			entity.setLastprojectId(entity.getProjectid());
//			entity.setProjectid(model.getProjectid());
//			entity.setLastgroupid(entity.getLastgroupid());
//			entity.setGroupid(CommonConstant.GROUP_NOT_SET);
//			entity.setU_uid(model.getLoginInfo().getLoginuserid());
//			entity.setU_time(systemTime);
//		});
//
//		return ;
//
//	}

//	/*
//	 * プロジェクト＆グループ情報クリア(プロジェクト削除用／更新準備用)
//	 * @param model Cloud_projectModel
//	 * @param entityList List<Cloud_deviceEntit>
//	 *
//	 */
//	public void clearProjectAndGroupInfoToEntity(LoginInfo loginInfo, List<Cloud_deviceEntity> entityList) throws Exception {
//
//		if (entityList != null && !entityList.isEmpty()) {
//			/* システム日時 */
//			Timestamp systemTime = new Timestamp(System.currentTimeMillis());
//			entityList.forEach(entity ->{
//				entity.setProjectid(CommonConstant.PROJECT_NOT_SET);
//				entity.setGroupid(CommonConstant.GROUP_NOT_SET);
//				entity.setU_uid(loginInfo.getLoginuserid());
//				entity.setU_time(systemTime);
//			});
//		}
//
//	}

}
