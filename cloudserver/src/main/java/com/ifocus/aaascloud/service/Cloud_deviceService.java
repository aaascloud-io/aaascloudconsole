package com.ifocus.aaascloud.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.ifocus.aaascloud.entity.Cloud_deviceEntity;
import com.ifocus.aaascloud.entity.Cloud_deviceRepository;
import com.ifocus.aaascloud.model.Cloud_deviceModel;

@SpringBootApplication
@RestController
@Service
@Transactional
public class Cloud_deviceService {

	@Autowired
	private Cloud_deviceRepository cloud_deviceRepository ;

	/*
	 * プロジェクトの全デバイス一覧取得
	 *
	 *
	 */
	public List<Cloud_deviceEntity> getAllDevices(Integer userid) throws Exception {
		List<Cloud_deviceEntity> returnList = new ArrayList();
//		Iterable<Cloud_deviceEntity> list = cloud_deviceRepository.(userid);
//		list.forEach(s -> returnList.add(s));
		return returnList;

	}

	/*
	 * グループ別デバイス一覧取得
	 *
	 *
	 */
	public List<Cloud_deviceEntity> getMyDevices(Integer userid) throws Exception {
		List<Cloud_deviceEntity> returnList = new ArrayList();
//		Iterable<Cloud_deviceEntity> list = cloud_deviceRepository.searchByUserid(userid);
//		list.forEach(s -> returnList.add(s));
		return returnList;

	}

	/*
	 * デバイス登録
	 *
	 *
	 */
	public Cloud_deviceEntity registerDevice(Cloud_deviceEntity entity) throws Exception {
		Cloud_deviceEntity insertedEntity = cloud_deviceRepository.save(entity);
		return insertedEntity;

	}

	/*
	 * デバイス更新
	 *
	 *
	 */
	public Cloud_deviceEntity updateDevice(Cloud_deviceEntity entity) throws Exception {
		Cloud_deviceEntity insertedEntity = cloud_deviceRepository.save(entity);
		return insertedEntity;

	}

	/*
	 * デバイス削除
	 *
	 *
	 */
	public void deleteDevice(Integer deviceid) throws Exception {
		if (cloud_deviceRepository.existsById(deviceid)) {
			cloud_deviceRepository.deleteById(deviceid);
		}
		return ;

	}

	/*
	 * EntityからModel取得
	 *
	 *
	 */
	public Cloud_deviceModel getModelByEntity(Cloud_deviceEntity entity) throws Exception {
		Cloud_deviceModel model = new Cloud_deviceModel();
		model.setDeviceid(entity.getDeviceid());
		model.setProjectid(entity.getProjectid());
		model.setGroupid(entity.getGroupid());
		model.setDevicename(entity.getDevicename());
		model.setImei(entity.getImei());
		model.setIccid(entity.getIccid());
		model.setSn(entity.getSn());
		model.setSim_iccid(entity.getSim_iccid());
		model.setSim_imei(entity.getSim_imei());
		model.setSim_tel(entity.getSim_tel());
		model.setCompanyid(entity.getCompanyid());
		model.setUserid(entity.getUserid());
		model.setAlive(entity.getAlive());

		return model;

	}

	/*
	 * EntityリストからModeリストl取得
	 *
	 *
	 */
	public List<Cloud_deviceModel> getModelsByEntitys(List<Cloud_deviceEntity> entityList) throws Exception {
		List<Cloud_deviceModel> modelList = new ArrayList();
		for (Cloud_deviceEntity entity:entityList) {
			modelList.add(getModelByEntity(entity));
		}

		return modelList;

	}
}
