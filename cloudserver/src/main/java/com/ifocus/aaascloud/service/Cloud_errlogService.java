package com.ifocus.aaascloud.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.ifocus.aaascloud.entity.Cloud_errlogEntity;
import com.ifocus.aaascloud.entity.Cloud_errlogRepository;
import com.ifocus.aaascloud.model.Cloud_errlogModel;

@SpringBootApplication
@RestController
@Service
@Transactional
public class Cloud_errlogService {

	@Autowired
	private Cloud_errlogRepository cloud_errlogRepository ;

	/*
	 * エラーログ一覧情報取得
	 *
	 */
	public List<Cloud_errlogModel> getErrlogList(List<Integer> useridList,	List<String> imeiList, List<String> iccidList, List<String> snList)
	throws Exception {
		Cloud_errlogModel model = new Cloud_errlogModel();
		List<Cloud_errlogEntity> list = cloud_errlogRepository.searchErrlogsByUseridInOrDeviceIn(useridList,imeiList,iccidList,snList);
		return getModelsByEntitys(list);

	}

	/*
	 * EntityリストからModeリストl取得
	 * @param entityList List<Cloud_errlogEntity> Entityリスト
	 * @return List<Cloud_errlogModel> Modeリスト
	 *
	 */
	public List<Cloud_errlogModel> getModelsByEntitys(List<Cloud_errlogEntity> entityList) throws Exception {
		List<Cloud_errlogModel> modelList = new ArrayList();
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
	public Cloud_errlogModel getModelByEntity(Cloud_errlogEntity entity) throws Exception {
		Cloud_errlogModel model = new Cloud_errlogModel();
		model.setRowid(entity.getRowid());
		model.setUserid(entity.getUserid());
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

		return model;

	}

}
