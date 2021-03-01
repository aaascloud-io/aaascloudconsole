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
	@Query(value = "SELECT c.* FROM cloud_version c ORDER BY productid, versioncode DESC",nativeQuery = true)
	public List<Cloud_versionEntity> findAllVersions();

	/*
	 * 検索
	 */
	@Query(value = "SELECT v.* FROM cloud_version v "
			+ " INNER JOIN cloud_product p ON v.productid = p.productid "
			+ " WHERE p.productname LIKE :productname "
			+ " AND v.versionname LIKE :versionname "
			+ " ORDER BY v.productid, v.versioncode DESC",nativeQuery = true)
	public List<Cloud_versionEntity> searchVersionsByProductnameAndVersionname(@Param("productname") String productname, @Param("versionname") String versionname);

	/*
	 * プロダクト別一覧取得
	 */
	@Query(value = "SELECT c.* FROM cloud_version c WHERE c.productid = :productid ORDER BY versioncode DESC",nativeQuery = true)
	public List<Cloud_versionEntity> findByProductid(@Param("productid") Integer productid);
}
