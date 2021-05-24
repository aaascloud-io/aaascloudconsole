package com.ifocus.aaascloud.repository;

import java.util.List;

import com.ifocus.aaascloud.entity.Cloud_productEntity;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

//@Repository
public interface  Cloud_productRepository extends CrudRepository<Cloud_productEntity, Integer> {

	/*
	 * プロダクト一覧（プロダクト管理用）
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_product c WHERE c.deleteflag = 0 ",nativeQuery = true)
	public List<Cloud_productEntity> findAllValid();

	/*
	 * プロダクトロック（排他管理用）
	 *
	 *
	 */
	@Transactional
	@Query(value = "SELECT c.* FROM cloud_product c "
			+ " WHERE c.deleteflag = 0 "
			+ " AND c.productid = :productid "
			+ " FOR UPDATE ",nativeQuery = true)
	public Cloud_productEntity findByIdForUpdate(@Param("productid") Integer productid);

	/*
	 * プロダクト一括ロック（排他管理用）
	 *
	 *
	 */
	@Transactional
	@Query(value = "SELECT c.* FROM cloud_product c "
			+ " WHERE c.deleteflag = 0 "
			+ " AND c.productid IN :productids "
			+ " FOR UPDATE ",nativeQuery = true)
	public List<Cloud_productEntity> findAllByIdForUpdate(@Param("productids") List<Integer> productids);

	/*
	 * プロダクト物理削除（deleteflag＝１の行）
	 *
	 *
	 */
	@Modifying
	@Transactional
	@Query(value = " DELETE FROM cloud_product "
			+ " WHERE deleteflag = 1 "
			+ " AND producttypename = :producttypename"
			+ " AND createuserid = :createuserid"
			+ " AND productname = :productname",nativeQuery = true)
	public void deleteProductMarked(@Param("producttypename") String producttypename,@Param("createuserid") Integer createuserid,@Param("productname") String productname);

	/*
	 * プロダクトID一覧（プロダクト数取得用）
	 *
	 *
	 */
	@Query(value = "SELECT DISTINCTROW c.* FROM cloud_product c INNER JOIN cloud_project d ON d.productId = c.productId WHERE d.userid IN :userids "
			+ " AND c.deleteflag = 0 ",nativeQuery = true)
	public List<Cloud_productEntity> searchProductIdsByProjectsUseridIn(@Param("userids") List<Integer> userids);

	/*
	 * マイプロダクトID一覧（プロダクト管理用）
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_product c WHERE c.createuserid IN :createuserids"
			+ " AND c.deleteflag = 0 ",nativeQuery = true)
	public List<Cloud_productEntity> searchMyProductsByUserid(@Param("createuserids") List<Integer> createuserids);

	/*
	 * プロダクト検索（プロダクト管理用）
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_product c "
			+ " LEFT JOIN cloud_user u ON c.createuserid = u.userid "
			+ " WHERE c.createuserid IN :createuserid "
			+ " AND CONCAT(u.lastName,u.firstName) LIKE :name "
			+ " AND c.productname LIKE :productname "
			+ " AND c.producttypename LIKE :producttypename "
			+ " AND c.deleteflag = 0 ",nativeQuery = true)
	public List<Cloud_productEntity> searchMyProductsByProducttypenameAndProductname(@Param("createuserid") List<Integer> createuserid, @Param("name") String name, @Param("producttypename") String producttypename, @Param("productname") String productname);

}
