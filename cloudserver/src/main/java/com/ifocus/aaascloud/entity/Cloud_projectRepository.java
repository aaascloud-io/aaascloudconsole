package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

//@Repository
public interface  Cloud_projectRepository extends CrudRepository<Cloud_projectEntity, Integer> {

	/*
	 * プロジェクト物理削除（deleteflag＝１の行）
	 *
	 *
	 */
	@Modifying
	@Transactional
	@Query(value = " DELETE FROM cloud_project "
			+ " WHERE deleteflag = 1 "
			+ " AND userid = :userid"
			+ " AND projectname = :projectname"
			+ " AND productid = :productid",nativeQuery = true)
	public void deleteProjectMarked(@Param("userid") Integer userid,@Param("projectname") String projectname,@Param("productid") Integer productid);

	/*
	 * マイプロジェクト一覧
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_project c WHERE c.deleteflag = 0 AND c.userid = :userid ORDER BY c.projectname", nativeQuery = true)
	public List<Cloud_projectEntity> searchByUserid(@Param("userid") Integer userid);

	/*
	 * プロジェクト検索
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_project c "
			+ " INNER JOIN cloud_product d ON c.productid = d.productid "
			+ " WHERE c.deleteflag = 0 AND c.userid = :userid "
			+ " AND c.projectname LIKE :projectname "
			+ " AND d.productname LIKE :productname "
			+ " ORDER BY c.projectname", nativeQuery = true)
	public List<Cloud_projectEntity> searchByUseridAndProjectnameLikeAndProductnameLike(@Param("userid") Integer userid, @Param("projectname") String projectname, @Param("productname") String productname);

	/*
	 * プロジェクト一覧（プロジェクト数取得用）
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_project c WHERE c.deleteflag = 0 AND c.userid IN :userids  ORDER BY c.projectname", nativeQuery = true)
	public List<Cloud_projectEntity> searchByUseridIn(@Param("userids") List<Integer> userids);

}
