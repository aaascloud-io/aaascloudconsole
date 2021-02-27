package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

//@Repository
public interface  Cloud_productRepository extends CrudRepository<Cloud_productEntity, Integer> {

	/*
	 * プロダクトID一覧（プロダクト数取得用）
	 *
	 *
	 */
	@Query(value = "SELECT DISTINCTROW c.* FROM cloud_product c INNER JOIN cloud_project d ON d.productId = c.productId WHERE d.userid IN :userids",nativeQuery = true)
	public List<Cloud_productEntity> searchProductIdsByProjectsUseridIn(@Param("userids") List<Integer> userids);

	/*
	 * マイプロダクトID一覧（プロダクト管理用）
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_product c WHERE c.i_uid = :userid",nativeQuery = true)
	public List<Cloud_productEntity> searchMyProductsByUserid(@Param("userid") Integer userid);

	/*
	 * プロダクト検索（プロダクト管理用）
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_product c "
			+ " INNER JOIN cloud_producttype d ON d.producttypeid = c.producttypeid "
			+ " WHERE c.i_uid = :userid "
			+ " AND c.productname LIKE :productname "
			+ " AND d.producttypename LIKE :producttypename ",nativeQuery = true)
	public List<Cloud_productEntity> searchMyProductsByProducttypenameAndProductname(@Param("userid") Integer userid, @Param("producttypename") String producttypename, @Param("productname") String productname);

}
