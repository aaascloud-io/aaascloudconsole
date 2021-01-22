package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

//@Repository
public interface  Cloud_versionRepository extends CrudRepository<Cloud_versionEntity, Integer> {

	/*
	 * 一覧取得
	 */
	@Query(value = "SELECT c.* FROM cloud_version c WHERE c.productid = :productid ORDER BY versioncode DESC",nativeQuery = true)
	public List<Cloud_versionEntity> findByProductid(@Param("productid") Integer productid);
}
