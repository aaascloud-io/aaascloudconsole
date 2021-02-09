package com.ifocus.aaascloud.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.ifocus.aaascloud.entity.Cloud_productEntity;
import com.ifocus.aaascloud.entity.Cloud_productRepository;
import com.ifocus.aaascloud.model.Cloud_productModel;

@SpringBootApplication
@RestController
@Service
@Transactional
public class Cloud_productService {

	@Autowired
	private Cloud_productRepository cloud_productRepository ;

	/*
	 * プロダクト一覧取得
	 *
	 *
	 */
	public List<Cloud_productModel> getProductList() throws Exception {
		List<Cloud_productEntity> list = getProductAll();
		return getModelsByEntitys(list);

	}

	/*
	 * プロダクト一覧取得
	 *
	 *
	 */
	public List<Cloud_productEntity> getProductAll() throws Exception {
		List<Cloud_productEntity> returnList = new ArrayList();
		Iterable<Cloud_productEntity> list = cloud_productRepository.findAll();
		list.forEach(s -> returnList.add(s));
		return returnList;

	}

	/*
	 * プロダクトID一覧（プロダクト数取得用）
	 * @param userids List<Integer> ターゲットユーザーIDリスト
	 * @List<Integer> プロジェクト一覧
	 */
	public List<Cloud_productModel> getMyUnderProducts(List<Integer> userids) throws Exception {
		List<Cloud_productEntity> list = cloud_productRepository.searchProductIdsByProjectsUseridIn(userids);
		return getModelsByEntitys(list);

	}

	/*
	 * プロダクト詳細取得
	 *
	 *
	 */
	public Cloud_productEntity getProductDetail(Integer productid) throws Exception {
		Optional<Cloud_productEntity> entity = cloud_productRepository.findById(productid);
		return entity.get();

	}

	/*
	 * プロダクト登録・更新
	 *
	 *
	 */
	public Cloud_productEntity registerProduct(Cloud_productEntity entity) throws Exception {
		Cloud_productEntity insertedEntity = cloud_productRepository.save(entity);
		return insertedEntity;

	}

	/*
	 * プロダクト削除
	 *
	 *
	 */
	public void deleteProduct(Integer productid) throws Exception {
		if (cloud_productRepository.existsById(productid)) {
			cloud_productRepository.deleteById(productid);
		}
		return ;

	}

	/*
	 * EntityリストからModeリストl取得
	 * @param entityList List<Cloud_deviceEntity> Entityリスト
	 * @return List<Cloud_deviceModel> Modeリスト
	 *
	 */
	public List<Cloud_productModel> getModelsByEntitys(List<Cloud_productEntity> entityList) throws Exception {
		List<Cloud_productModel> modelList = new ArrayList();
		for (Cloud_productEntity entity:entityList) {
			modelList.add(getModelByEntity(entity));
		}

		return modelList;

	}

	/*
	 * EntityからModel取得
	 * @param entity Cloud_productEntity
	 * @return Cloud_productModel
	 *
	 */
	public Cloud_productModel getModelByEntity(Cloud_productEntity entity) throws Exception {
		Cloud_productModel model = new Cloud_productModel();
		model.setProductid(entity.getProductid());
		model.setProducttypeid(entity.getProductTypeId());
		model.setProductcode(entity.getProductcode());
		model.setProductname(entity.getProductname());
		model.setModel(entity.getModel());
		model.setVersion(entity.getVersion());
		model.setSimflag(entity.getSimflag());
		model.setSummary(entity.getSummary());
		model.setAlive(entity.getAlive());

		return model;

	}

}
