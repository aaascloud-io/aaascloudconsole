package com.ifocus.aaascloud.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.ifocus.aaascloud.entity.Cloud_producttypeEntity;
import com.ifocus.aaascloud.entity.Cloud_producttypeRepository;
import com.ifocus.aaascloud.model.Cloud_producttypeModel;

@SpringBootApplication
@RestController
@Service
@Transactional
public class Cloud_producttypeService {

	@Autowired
	private Cloud_producttypeRepository cloud_producttypeRepository ;

	/*
	 * プロダクトタイプ一覧取得
	 *
	 *
	 */
	public List<Cloud_producttypeModel> getProductList() throws Exception {
		List<Cloud_producttypeEntity> list = getProductAll();
		return getModelsByEntitys(list);

	}

	/*
	 * プロダクトタイプ一覧取得
	 *
	 *
	 */
	public List<Cloud_producttypeEntity> getProductAll() throws Exception {
		List<Cloud_producttypeEntity> returnList = new ArrayList();
		Iterable<Cloud_producttypeEntity> list = cloud_producttypeRepository.findAll();
		list.forEach(s -> returnList.add(s));
		return returnList;

	}

	/*
	 * EntityリストからModeリストl取得
	 * @param entityList List<Cloud_deviceEntity> Entityリスト
	 * @return List<Cloud_deviceModel> Modeリスト
	 *
	 */
	public List<Cloud_producttypeModel> getModelsByEntitys(List<Cloud_producttypeEntity> entityList) throws Exception {
		List<Cloud_producttypeModel> modelList = new ArrayList();
		for (Cloud_producttypeEntity entity:entityList) {
			modelList.add(getModelByEntity(entity));
		}

		return modelList;

	}

	/*
	 * EntityからModel取得
	 * @param entity Cloud_producttypeEntity
	 * @return Cloud_producttypeModel
	 *
	 */
	public Cloud_producttypeModel getModelByEntity(Cloud_producttypeEntity entity) throws Exception {
		Cloud_producttypeModel model = new Cloud_producttypeModel();
		model.setProductTypeId(entity.getProductTypeId());
		model.setProductTypeName(entity.getProductTypeName());
		model.setSummary(entity.getSummary());
		model.setReleaseDate(entity.getReleaseDate());

		return model;

	}

}
