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
import com.ifocus.aaascloud.entity.Cloud_productEntity;
import com.ifocus.aaascloud.entity.Cloud_productRepository;
import com.ifocus.aaascloud.entity.Cloud_projectEntity;
import com.ifocus.aaascloud.entity.Cloud_projectRepository;
import com.ifocus.aaascloud.model.Cloud_deviceModel;
import com.ifocus.aaascloud.model.Cloud_projectDetailModel;
import com.ifocus.aaascloud.model.Cloud_projectModel;

@SpringBootApplication
@RestController
@Service
@Transactional
public class Cloud_projectService {

	@Autowired
	private Cloud_projectRepository cloud_projectRepository ;
	@Autowired
	private Cloud_productRepository cloud_productRepository ;
	@Autowired
	private Cloud_groupRepository cloud_groupRepository ;
	@Autowired
	private Cloud_deviceRepository cloud_deviceRepository ;

	@Autowired
	private Cloud_groupService cloud_groupService ;
	@Autowired
	private Cloud_deviceService cloud_deviceService ;

	/*
	 * プロジェクト一覧取得
	 * @param userid Integer ターゲットユーザーID
	 * @List<Cloud_projectModel> プロジェクト一覧
	 */
	public List<Cloud_projectModel> getMyProjects(Integer userid) throws Exception {
		List<Cloud_projectModel> returnList = new ArrayList();
		Iterable<Cloud_projectEntity> list = cloud_projectRepository.searchByUserid(userid);
		list.forEach(s -> {
			Cloud_projectModel model = new Cloud_projectModel();
			model.setProjectid(s.getProjectid());
			model.setProjectname(s.getProjectname());
			model.setUserid(s.getUserid());
			model.setProductid(s.getProductid());
			model.setProjectsummary(s.getProjectsummary());
			/* プロダクト情報取得 */
			Optional<Cloud_productEntity> entity = cloud_productRepository.findById(model.getProductid());
			if (!entity.equals(Optional.empty())) {
				model.setProductname(entity.get().getProductname());
			}
			/* グループ数取得 */
			List<Cloud_groupEntity> groupList = cloud_groupRepository.searchGroupsByProjectid(model.getProjectid());
			model.setGroupCounts(groupList.size());
			/* デバイス数取得 */
			List<Cloud_deviceEntity> deviceList = cloud_deviceRepository.searchDevicesByProjectid(model.getProjectid());
			model.setDeviceCounts(deviceList.size());

			returnList.add(model);
		});
		return returnList;

	}

	/*
	 * プロジェクト一覧取得（プロジェクト数取得用）
	 * @param userids List<Integer> ターゲットユーザーIDリスト
	 * @List<Cloud_projectModel> プロジェクト一覧
	 */
	public List<Cloud_projectModel> getMyUnderProjects(List<Integer> userids) throws Exception {
		List<Cloud_projectModel> returnList = new ArrayList();
		Iterable<Cloud_projectEntity> list = cloud_projectRepository.searchByUseridIn(userids);
		list.forEach(s -> {
			Cloud_projectModel model = new Cloud_projectModel();
			model.setProjectid(s.getProjectid());
			model.setProjectname(s.getProjectname());
			model.setUserid(s.getUserid());
			model.setProductid(s.getProductid());
			model.setProjectsummary(s.getProjectsummary());

			returnList.add(model);
		});
		return returnList;

	}

	/*
	 * プロダクトID一覧（プロダクト数取得用）
	 * @param userids List<Integer> ターゲットユーザーIDリスト
	 * @List<Integer> プロジェクト一覧
	 */
//	public List<Cloud_productEntity> getMyUnderProducts(List<Integer> userids) throws Exception {
//		List<Cloud_productEntity> list = cloud_projectRepository.searchProductIdsByUseridIn(userids);
//		return list;
//
//	}

	/*
	 * プロジェクト詳細取得
	 * @param projectid Integer プロジェクトID
	 * @return Cloud_projectDetailModel プロジェクト詳細
	 */
	public Cloud_projectDetailModel getMyProject(Integer projectid) throws Exception {
		Cloud_projectDetailModel model = null;

		Optional<Cloud_projectEntity> myEntity = cloud_projectRepository.findById(projectid);
		if (!myEntity.equals(Optional.empty())) {
			model = new Cloud_projectDetailModel();
			model.setProjectid(myEntity.get().getProjectid());
			model.setProjectname(myEntity.get().getProjectname());
			model.setUserid(myEntity.get().getUserid());
			model.setProductid(myEntity.get().getProductid());
			model.setProjectsummary(myEntity.get().getProjectsummary());

			/* プロダクト情報取得 */
			Optional<Cloud_productEntity> cloud_productEntity = cloud_productRepository.findById(model.getProductid());
			if (!cloud_productEntity.equals(Optional.empty())) {
				/* プロダクト名を設定 */
				model.setProductname(cloud_productEntity.get().getProductname());
			}
			/* グループ数取得 */
			model.setGroupCounts(cloud_groupRepository.getProjectGroupCountsByProjectid(model.getProjectid()));
			/* グループ一覧を設定 */
			model.setGroupList(cloud_groupService.getGroups(model.getProjectid()));
			/* デバイス数取得 */
			model.setDeviceCounts(cloud_deviceRepository.getProjectDeviceCountsByProjectid(model.getProjectid()));
			/* デバイス一覧を設定 */
			model.setDeviceList(cloud_deviceService.getProjectDevices(model.getProjectid()));
		}


		return model;

	}

	/*
	 * プロジェクト登録
	 * @param Cloud_projectDetailModel プロジェクト詳細
	 * @return projectid Integer プロジェクトID
	 */
	public Integer registerProject(Cloud_projectDetailModel model) throws Exception {


		////////////////////////////////////////////////////////
		// プロジェクト登録
		////////////////////////////////////////////////////////
		Cloud_projectEntity insertEntity = this.getCloud_projectEntityFromModel(model);
		Cloud_projectEntity insertedEntity = cloud_projectRepository.save(insertEntity);

		// プロジェクトIDをモデルに設定する
		model.setProductid(insertedEntity.getProductid());

		// プロジェクトIDを各グループに設定する
		this.setTakeoverInfoToGroups(model);

		////////////////////////////////////////////////////////
		// グループ登録(グループデバイス登録を含む)
		////////////////////////////////////////////////////////
		cloud_groupService.registerGroups(model.getGroupList());

		////////////////////////////////////////////////////////
		// プロジェクトデバイス更新
		////////////////////////////////////////////////////////
		// 更新対象デバイス取得
		Iterable<Cloud_deviceEntity> entityList = cloud_deviceRepository.findAllById(this.getDeviceidList(model.getDeviceList()));
		// 更新情報設定
		cloud_groupService.setUpdateInfoToEntityForProjectDevice(model, entityList);
		// グループデバイス一括更新
		cloud_deviceRepository.saveAll(entityList);

		return insertedEntity.getProjectid();

	}

	/*
	 * プロジェクト更新
	 * @param Cloud_projectDetailModel プロジェクト詳細
	 * @return projectid Integer プロジェクトID
	 *
	 */
	public Integer updateProject(Cloud_projectDetailModel model) throws Exception {
		Integer updatedProjectId = null;

		////////////////////////////////////////////////////////
		// プロジェクト更新
		////////////////////////////////////////////////////////
		/* 既存プロジェクト取得 */
		Optional<Cloud_projectEntity> toBeUpdate = cloud_projectRepository.findById(model.getProjectid());
		if (!toBeUpdate.equals(Optional.empty())) {
			Cloud_projectEntity updateEntity = toBeUpdate.get();
			/* 更新情報設定 */
			this.setCloud_projectEntityFromModel(model, updateEntity);
			Cloud_projectEntity updatedEntity = cloud_projectRepository.save(updateEntity);

			////////////////////////////////////////////////////////
			// プロジェクトデバイス更新
			////////////////////////////////////////////////////////
			// 更新対象デバイス取得
			List<Cloud_deviceEntity> entityList = (List<Cloud_deviceEntity>) cloud_deviceRepository.findAllById(this.getDeviceidList(model.getDeviceList()));
			// プロジェクト＆グループ情報クリア
			cloud_groupService.clearProjectAndGroupInfoToEntity(model.getLoginInfo(), entityList);
			// デバイス一括更新
			cloud_deviceRepository.saveAll(entityList);

			////////////////////////////////////////////////////////
			// グループ更新(Idあり & Alive = 1)
			////////////////////////////////////////////////////////
			cloud_groupService.updateGroups(model.getUpdateGroupList());

			////////////////////////////////////////////////////////
			// グループ登録(Idなし)
			////////////////////////////////////////////////////////
			cloud_groupService.registerGroups(model.getRegisterGroupList());

			////////////////////////////////////////////////////////
			// グループ削除(Idあり & Alive = 0)
			////////////////////////////////////////////////////////
			cloud_groupService.deleteGroups(model.getDeleteGroupList());

			updatedProjectId = updatedEntity.getProjectid();
		}

		return updatedProjectId;

	}

	/*
	 * プロジェクト削除
	 * @param model Cloud_projectModel プロジェクト詳細
	 *
	 */
	public void deleteProject(Cloud_projectModel model) throws Exception {

		////////////////////////////////////////////////////////
		// プロジェクトデバイス更新
		////////////////////////////////////////////////////////
		// 更新対象デバイス取得
		List<Cloud_deviceEntity> deviceEntityList = cloud_deviceRepository.searchDevicesByProjectid(model.getProjectid());
		// プロジェクト＆グループ情報クリア
		cloud_groupService.clearProjectAndGroupInfoToEntity(model.getLoginInfo(), deviceEntityList);
		// デバイス一括更新
		cloud_deviceRepository.saveAll(deviceEntityList);

		////////////////////////////////////////////////////////
		// グループ削除
		////////////////////////////////////////////////////////
		List<Cloud_groupEntity> groupEntityList = cloud_groupRepository.searchGroupsByProjectid(model.getProjectid());
		cloud_groupRepository.deleteAll(groupEntityList);

		////////////////////////////////////////////////////////
		// プロジェクト削除
		////////////////////////////////////////////////////////
		if (cloud_projectRepository.existsById(model.getProjectid())) {
			cloud_projectRepository.deleteById(model.getProjectid());
		}
		return ;

	}

	/*
	 * 一括プロジェクト削除
	 * @param modelList List<Cloud_projectModel> プロジェクトリスト
	 *
	 */
	public void deleteProjects(List<Cloud_projectModel> modelList) throws Exception {

		for (Cloud_projectModel mode:modelList) {
			deleteProject(mode);
		}
		return ;

	}

	/*
	 * プロジェクトEntityを取得する
	 *
	 * @param Cloud_projectDetailModel プロジェクト詳細
	 * @return Cloud_projectEntity 登録用プロジェクトEntity
	 *
	 */
	private Cloud_projectEntity getCloud_projectEntityFromModel(Cloud_projectDetailModel model) throws Exception {
		Cloud_projectEntity entity = new Cloud_projectEntity();

		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());
		entity.setUserid(model.getTargetUserInfo().getTargetuserid());
		entity.setProjectname(model.getProjectname());
		entity.setProductid(model.getProductid());
		entity.setProjectsummary(model.getProjectsummary());
		entity.setAlive(AliveConstant.ALIVE);
		entity.setI_uid(model.getLoginInfo().getLoginuserid());
		entity.setI_time(systemTime);
		entity.setU_uid(model.getLoginInfo().getLoginuserid());
		entity.setU_time(systemTime);

		return entity;

	}

	/*
	 * プロジェクトIDを各グループに設定する
	 *
	 * @param Cloud_projectDetailModel プロジェクト詳細
	 *
	 */
	private void setTakeoverInfoToGroups(Cloud_projectDetailModel model) throws Exception {

		if (model.getGroupList() != null && model.getGroupList().size() > 0) {
			// 引継ぎ情報設定
			model.getGroupList().forEach(
					s ->{
						s.setLoginInfo(model.getLoginInfo()); 				// LoginInfo引継ぎ
						s.setTargetUserInfo(model.getTargetUserInfo()); 	// TargetUserInfo引継ぎ
						s.setProjectid(model.getProjectid()); 				// プロジェクトID引継ぎ
					}
			);
		}

	}

	/*
	 * デバイスIDリスト取得
	 *
	 * @param deviceList List<Cloud_deviceModel>
	 * @return List<Integer>
	 *
	 */
	private List<Integer> getDeviceidList(List<Cloud_deviceModel> deviceList) throws Exception {

		List<Integer> deviceidList = new ArrayList<Integer>();
		if (deviceList != null && deviceList.size() > 0) {
			deviceList.forEach(
					s ->{
						deviceidList.add(s.getDeviceid());
					}
			);
		}
		return deviceidList;

	}

	/*
	 * プロジェクトEntityに更新情報を設定する
	 *
	 * @param model Cloud_projectDetailModel プロジェクト詳細
	 * @param updateEntity Cloud_projectEntity 更新プロジェクトEntity
	 *
	 */
	private void setCloud_projectEntityFromModel(
			Cloud_projectDetailModel model,
			Cloud_projectEntity updateEntity) throws Exception {

		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());
		updateEntity.setUserid(model.getTargetUserInfo().getTargetuserid());
		updateEntity.setProjectname(model.getProjectname());
		updateEntity.setProductid(model.getProductid());
		updateEntity.setProjectsummary(model.getProjectsummary());
		updateEntity.setAlive(AliveConstant.ALIVE);
		updateEntity.setU_uid(model.getLoginInfo().getLoginuserid());
		updateEntity.setU_time(systemTime);

	}

}
