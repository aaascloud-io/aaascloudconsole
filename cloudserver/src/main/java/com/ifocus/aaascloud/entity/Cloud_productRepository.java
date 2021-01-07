package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

//@Repository
public interface  Cloud_productRepository extends CrudRepository<Cloud_productEntity, Integer> {

	/*
	 * プロダクトID一覧（プロダクト数取得用）
	 *
	 *
	 */
//	@Query("SELECT DISTINCT pd FROM cloud_product pd INNER JOIN cloud_project pj ON pj.productId = pd.productId WHERE pj.userid IN :userids")
	@Query("SELECT pd FROM cloud_product pd INNER JOIN cloud_project pj ON pj.productId = pd.productId WHERE pj.userid IN :userids")
	@Autowired
	public List<Cloud_productEntity> searchProductIdsByProjects_UseridIn(@Param("userid") List<Integer> userids);

}
