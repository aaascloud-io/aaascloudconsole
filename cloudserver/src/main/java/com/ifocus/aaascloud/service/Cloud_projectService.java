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
			if (entity != null ) {
				model.setProductname(entity.get().getProductname());
			}
			/* グループ数取得 */
			model.setGroupCounts(cloud_groupRepository.getProjectGroupCountsByProjectid(model.getProjectid()));
			/* デバイス数取得 */
			model.setDeviceCounts(cloud_deviceRepository.getProjectDeviceCountsByProjectid(model.getProjectid()));

			returnList.add(model);
		});
		return returnList;

	}

	/*
	 * プロジェクト詳細取得
	 * @param projectid Integer プロジェクトID
	 * @return Cloud_projectDetailModel プロジェクト詳細
	 */
	public Cloud_projectDetailModel getMyProject(Integer projectid) throws Exception {
		Cloud_projectDetailModel model = new Cloud_projectDetailModel();
		Optional<Cloud_projectEntity> myEntity = cloud_projectRepository.findById(projectid);

		model.setProjectid(myEntity.get().getProjectid());
		model.setProjectname(myEntity.get().getProjectname());
		model.setUserid(myEntity.get().getUserid());
		model.setProductid(myEntity.get().getProductid());
		model.setProjectsummary(myEntity.get().getProjectsummary());

		/* プロダクト情報取得 */
		Optional<Cloud_productEntity> cloud_productEntity = cloud_productRepository.findById(model.getProductid());
		if (cloud_productEntity != null ) {
			/* プロダクト名を設定 */
			model.setProductname(cloud_productEntity.get().getProductname());
		}
		/* グループ数取得 */
		model.setGroupCounts(cloud_groupRepository.getProjectGroupCountsByProjectid(model.getProjectid()));
		/* グループ一覧取得 */
		List<Cloud_groupEntity> groupList = cloud_groupRepository.searchGroupsByProjectid(model.getProjectid());
		/* グループ一覧を設定 */
		model.setGroupList(cloud_groupService.getModelsByEntitys(groupList));
		/* デバイス数取得 */
		model.setDeviceCounts(cloud_deviceRepository.getProjectDeviceCountsByProjectid(model.getProjectid()));
		/* デバイス一覧取得 */
		List<Cloud_deviceEntity> deviceList = cloud_deviceRepository.searchDevicesByProjectid(model.getProjectid());
		/* デバイス一覧を設定 */
		model.setDeviceList(cloud_deviceService.getModelsByEntitys(deviceList));

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
		cloud_groupService.setUpdateInfoToEntity(model, entityList);
		// グループデバイス一括更新
		cloud_deviceRepository.saveAll(entityList);

		return insertedEntity.getProjectid();

	}

	/*
	 * プロジェクト更新
	 *
	 *
	 */
	public Cloud_projectEntity updateProject(Cloud_projectEntity entity) throws Exception {
		Cloud_projectEntity insertedEntity = cloud_projectRepository.save(entity);
		return insertedEntity;

	}

	/*
	 * プロジェクト削除
	 *
	 *
	 */
	public void deleteProject(Integer productid) throws Exception {
		if (cloud_projectRepository.existsById(productid)) {
			cloud_projectRepository.deleteById(productid);
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

		// 引継ぎ情報設定
		model.getGroupList().forEach(
				s ->{
					s.setLoginInfo(model.getLoginInfo()); 				// LoginInfo引継ぎ
					s.setTargetUserInfo(model.getTargetUserInfo()); 	// TargetUserInfo引継ぎ
					s.setProjectid(model.getProjectid()); 				// プロジェクトID引継ぎ
				}
		);

	}

	/*
	 * デバイスIDリスト取得
	 *
	 * @param deviceList List<Cloud_deviceModel>
	 * @return List<Integer>
	 *
	 */
	private List<Integer> getDeviceidList(List<Cloud_deviceModel> deviceList) throws Exception {

		List<Integer> deviceidList = new ArrayList();
		deviceList.forEach(
				s ->{
					deviceidList.add(s.getDeviceid());
				}
		);
		return deviceidList;

	}
}
