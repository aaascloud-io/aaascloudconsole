package com.ifocus.aaascloud.repository;

import java.util.List;

import com.ifocus.aaascloud.entity.Cloud_versionEntity;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

//@Repository
public interface  Cloud_versionRepository extends CrudRepository<Cloud_versionEntity, Integer> {

	/*
	 * 	バージョン情報テーブル物理削除（deleteflag＝１の行）
	 *
	 *
	 */
	@Modifying
	@Transactional
	@Query(value = " DELETE FROM cloud_version "
			+ " WHERE deleteflag = 1 "
			+ " AND productid = :productid"
			+ " AND versioncode = :versioncode"
			+ " AND versionname = :versionname",nativeQuery = true)
	public void deleteVersionMarked(@Param("productid") Integer productid,@Param("versioncode") String versioncode,@Param("versionname") String versionname);

	/*
	 * 一覧取得
	 */
	@Query(value = "SELECT c.* FROM cloud_version c WHERE c.deleteflag = 0 ORDER BY productid, versioncode DESC",nativeQuery = true)
	public List<Cloud_versionEntity> findAllVersions();

	/*
	 * 検索
	 */
	@Query(value = "SELECT v.* FROM cloud_version v "
			+ " INNER JOIN cloud_product p ON v.productid = p.productid "
			+ " WHERE v.deleteflag = 0 AND  p.productname LIKE :productname "
			+ " AND v.versionname LIKE :versionname "
			+ " ORDER BY v.productid, v.versioncode DESC",nativeQuery = true)
	public List<Cloud_versionEntity> searchVersionsByProductnameAndVersionname(@Param("productname") String productname, @Param("versionname") String versionname);

	/*
	 * プロダクト別一覧取得
	 */
	@Query(value = "SELECT c.* FROM cloud_version c WHERE c.deleteflag = 0 AND c.productid = :productid ORDER BY versioncode DESC",nativeQuery = true)
	public List<Cloud_versionEntity> findByProductid(@Param("productid") Integer productid);
}
