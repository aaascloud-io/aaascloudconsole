package com.ifocus.aaascloud.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.ifocus.aaascloud.entity.Cloud_deviceEntity;
import com.ifocus.aaascloud.entity.Cloud_deviceRepository;
import com.ifocus.aaascloud.entity.Cloud_groupEntity;
import com.ifocus.aaascloud.entity.Cloud_groupRepository;
import com.ifocus.aaascloud.entity.Cloud_productEntity;
import com.ifocus.aaascloud.entity.Cloud_productRepository;
import com.ifocus.aaascloud.entity.Cloud_projectEntity;
import com.ifocus.aaascloud.entity.Cloud_projectRepository;
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
	 *
	 *
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
	 *
	 *
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
	 *
	 *
	 */
	public Cloud_projectEntity registerProject(Cloud_projectEntity entity) throws Exception {
		Cloud_projectEntity insertedEntity = cloud_projectRepository.save(entity);
		return insertedEntity;

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
}
