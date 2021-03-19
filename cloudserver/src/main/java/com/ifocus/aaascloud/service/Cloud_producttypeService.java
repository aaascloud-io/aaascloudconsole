package com.ifocus.aaascloud.service;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.ifocus.aaascloud.constant.ProductTypeConstant;
import com.ifocus.aaascloud.model.Cloud_producttypeModel;

@SpringBootApplication
@RestController
@Service
@Transactional
public class Cloud_producttypeService {

	/*
	 * プロダクトタイプ一覧取得
	 *
	 *
	 */
	public List<Cloud_producttypeModel> getProductList() throws Exception {

		List<Cloud_producttypeModel> returnList = new ArrayList<Cloud_producttypeModel>();
		ProductTypeConstant productType = new ProductTypeConstant();

	    for (Field field : productType.getClass().getDeclaredFields()) {
	        field.setAccessible(true);
	        Cloud_producttypeModel model = new Cloud_producttypeModel();
	        model.setProducttypename((String)field.get(productType));
	        returnList.add(model);
	    }

		return returnList;

	}

}
