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
	public List<Cloud_productEntity> getProductAll() throws Exception {
		List<Cloud_productEntity> returnList = new ArrayList();
		Iterable<Cloud_productEntity> list = cloud_productRepository.findAll();
		list.forEach(s -> returnList.add(s));
		return returnList;

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
}
