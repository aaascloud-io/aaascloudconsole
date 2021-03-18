package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

//@Repository
public interface  Cloud_projectRepository extends CrudRepository<Cloud_projectEntity, Integer> {

	/*
	 * マイプロジェクト一覧
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_project c WHERE c.userid = :userid ORDER BY c.projectname", nativeQuery = true)
	public List<Cloud_projectEntity> searchByUserid(@Param("userid") Integer userid);

	/*
	 * プロジェクト検索
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_project c "
			+ " INNER JOIN cloud_product d ON c.productid = d.productid "
			+ " WHERE c.userid = :userid "
			+ " AND c.projectname LIKE :projectname "
			+ " AND d.productname LIKE :productname "
			+ " ORDER BY c.projectname", nativeQuery = true)
	public List<Cloud_projectEntity> searchByUseridAndProjectnameLikeAndProductnameLike(@Param("userid") Integer userid, @Param("projectname") String projectname, @Param("productname") String productname);

	/*
	 * プロジェクト一覧（プロジェクト数取得用）
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_project c WHERE c.userid IN :userids  ORDER BY c.projectname", nativeQuery = true)
	public List<Cloud_projectEntity> searchByUseridIn(@Param("userids") List<Integer> userids);

}
