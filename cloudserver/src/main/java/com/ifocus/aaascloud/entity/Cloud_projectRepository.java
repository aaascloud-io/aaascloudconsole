package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

//@Repository
public interface  Cloud_projectRepository extends CrudRepository<Cloud_projectEntity, Integer> {

	/*
	 * プロジェクト一覧
	 *
	 *
	 */
	@Query("SELECT c FROM cloud_project c WHERE c.userid = :userid ORDER BY c.projectname")
	@Autowired
	public List<Cloud_projectEntity> searchByUserid(@Param("userid") Integer userid);

	/*
	 * プロジェクト検索
	 *
	 *
	 */
	@Query("SELECT c.* FROM cloud_project c "
			+ "WHERE c.userid = :userid "
			+ "AND c.projectname LIKE :projectname "
			+ "ORDER BY c.projectname")
	@Autowired
	public List<Cloud_projectEntity> searchByUseridAndProjectnameLike(@Param("userid") Integer userid, @Param("projectname") String projectname);

	/*
	 * プロジェクト一覧（プロジェクト数取得用）
	 *
	 *
	 */
	@Query("SELECT c FROM cloud_project c WHERE c.userid IN :userids")
	@Autowired
	public List<Cloud_projectEntity> searchByUseridIn(@Param("userid") List<Integer> userids);

}
