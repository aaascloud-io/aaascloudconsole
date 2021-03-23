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

import com.ifocus.aaascloud.constant.CommonConstant;
import com.ifocus.aaascloud.constant.DeleteFlagConstant;
import com.ifocus.aaascloud.entity.Cloud_productEntity;
import com.ifocus.aaascloud.entity.Cloud_productRepository;
import com.ifocus.aaascloud.entity.Cloud_userEntity;
import com.ifocus.aaascloud.entity.Cloud_userRepository;
import com.ifocus.aaascloud.model.Cloud_productModel;

@SpringBootApplication
@RestController
@Service
@Transactional
public class Cloud_productService {

	@Autowired
	private Cloud_productRepository cloud_productRepository ;
	@Autowired
	private Cloud_userRepository cloud_userRepository ;

	/*
	 *マイプロダクト一覧取得
	 *
	 *
	 */
	public List<Cloud_productModel> getMyProductList(List<Integer> useridlist, Cloud_productModel model) throws Exception {
		List<Cloud_productEntity> list = cloud_productRepository.searchMyProductsByUserid(useridlist);
		return getModelsByEntitys(list);

	}

	/*
	 *マイプロダクト検索
	 *
	 *
	 */
	public List<Cloud_productModel> searchMyProductList(List<Integer> userList,Cloud_productModel model) throws Exception {

		List<Cloud_productEntity> list = cloud_productRepository.searchMyProductsByProducttypenameAndProductname(
				userList,
				model.getCreateusernameForSearch(),
				model.getProducttypenameForSearch(),
				model.getProductnameForSearch());
		return getModelsByEntitys(list);

	}

	/*
	 *マイプロダクト検索(ダッシュボード用)
	 *
	 *
	 */
	public List<Cloud_productModel> searchMyProductList(List<Integer> userList) throws Exception {

		List<Cloud_productEntity> list = cloud_productRepository.searchMyProductsByProducttypenameAndProductname(
				userList,
				CommonConstant.DEFAULT_MATCH_ALL,
				CommonConstant.DEFAULT_MATCH_ALL,
				CommonConstant.DEFAULT_MATCH_ALL);
		return getModelsByEntitys(list);

	}

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
		List<Cloud_productEntity> returnList = new ArrayList<Cloud_productEntity>();
		// Iterable<Cloud_productEntity> list = cloud_productRepository.findAll();
		Iterable<Cloud_productEntity> list = cloud_productRepository.findAllValid();
		list.forEach(s -> returnList.add(s));
		return returnList;

	}

	/*
	 * プロダクト検索（プロダクト管理用）
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
	public Cloud_productModel getProductDetail(Integer productid) throws Exception {
		Optional<Cloud_productEntity> entity = cloud_productRepository.findById(productid);
		return getModelByEntity(entity.get());

	}

	/*
	 * プロダクト登録
	 *
	 *
	 */
	public Cloud_productEntity registerProduct(Cloud_productEntity entity) throws Exception {

		// 削除済行を物理削除する
		cloud_productRepository.deleteProductMarked(entity.getProducttypename(),entity.getCreateuserid(),entity.getProductname());
		// プロダクト登録
		Cloud_productEntity insertedEntity = cloud_productRepository.save(entity);
		return insertedEntity;

	}

	/*
	 * プロダクト更新
	 *
	 *
	 */
	public Cloud_productEntity updateProduct(Cloud_productEntity entity) throws Exception {
		// 更新行をロックする
		cloud_productRepository.findByIdForUpdate(entity.getProductid());
		// プロダクト更新
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
	 * プロダクト論理削除
	 *
	 *
	 */
	public void updateProductForDelete(Cloud_productModel model) throws Exception {
		// 更新行をロックする
		cloud_productRepository.findByIdForUpdate(model.getProductid());
		// プロダクト論理削除
		Optional<Cloud_productEntity> product = cloud_productRepository.findById(model.getProductid());
		if (product != null && product.isPresent()) {

			Cloud_productEntity entity = product.get();

			// プロダクト論理削除
			entity.setDeleteflag(DeleteFlagConstant.DELETED);
			entity.setU_uid(model.getLoginInfo().getLoginuserid());
			entity.setU_time(new Timestamp(System.currentTimeMillis()));
			// DB更新
			cloud_productRepository.save(entity);
		}
		return ;

	}

	/*
	 * プロダクト一括削除
	 *
	 *
	 */
	public void deleteProducts(List<Integer> productids) throws Exception {
		Iterable<Cloud_productEntity> products = cloud_productRepository.findAllById(productids);
		cloud_productRepository.deleteAll(products);
		return ;

	}

	/*
	 * プロダクト一括論理削除
	 *
	 *
	 */
	public void updateProductsForDelete(Cloud_productModel model) throws Exception {

		// 更新行を一括ロックする
		cloud_productRepository.findAllByIdForUpdate(model.getProductidlist());
		// 対象取得
		Iterable<Cloud_productEntity> products = cloud_productRepository.findAllById(model.getProductidlist());
		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());
		for (Cloud_productEntity entity:products) {

			// プロダクト論理削除
			entity.setDeleteflag(DeleteFlagConstant.DELETED);
			entity.setU_uid(model.getLoginInfo().getLoginuserid());
			entity.setU_time(systemTime);
		}
		// DB更新
		cloud_productRepository.saveAll(products);
		return ;

	}

	/*
	 * EntityリストからModeリストl取得
	 * @param entityList List<Cloud_deviceEntity> Entityリスト
	 * @return List<Cloud_deviceModel> Modeリスト
	 *
	 */
	public List<Cloud_productModel> getModelsByEntitys(List<Cloud_productEntity> entityList) throws Exception {
		List<Cloud_productModel> modelList = new ArrayList<Cloud_productModel>();
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
		model.setProducttypename(entity.getProducttypename());
		model.setProductcode(entity.getProductcode());
		model.setProductname(entity.getProductname());
		model.setModel(entity.getModel());
		model.setVersion(entity.getVersion());
		model.setSimflag(entity.getSimflag());
		model.setSummary(entity.getSummary());
		model.setDeleteflag(entity.getDeleteflag());
		model.setAlive(entity.getAlive());
		model.setCreateuserid(entity.getCreateuserid());
		// 作成者名取得
		Optional<Cloud_userEntity> createuser = cloud_userRepository.findById(entity.getCreateuserid());
		model.setFirstname(createuser.get().getFirstname());
		model.setLastname(createuser.get().getLastname());
		model.setCreateusername(createuser.get().getLastname() + " " + createuser.get().getFirstname());

		return model;

	}

}
