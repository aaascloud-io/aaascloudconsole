package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

//@Repository
public interface  Cloud_groupRepository extends CrudRepository<Cloud_groupEntity, Integer> {

	/*
	 * プロジェクトの全グループ一覧
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_group c WHERE c.projectid = :projectid",nativeQuery = true)
	public List<Cloud_groupEntity> searchGroupsByProjectid(@Param("projectid") Integer projectid);

	/*
	 * プロジェクトの全グループ数
	 *
	 *
	 */
	@Query(value = "SELECT COUNT(c.projectid) FROM cloud_group c WHERE c.projectid = :projectid",nativeQuery = true)
	public Integer getProjectGroupCountsByProjectid(@Param("projectid") Integer projectid);

	/*
	 * グループ検索
	 *
	 *
	 */
	@Query(value = "SELECT g.* FROM cloud_group g "
			+ " INNER JOIN cloud_project p ON g.projectid = p.projectid "
			+ " WHERE p.projectname LIKE :projectname "
			+ " AND g.groupname LIKE :groupname "
			+ " AND p.userid = :userid ",nativeQuery = true)
	public List<Cloud_groupEntity> searchGroupsByProjectnameAndGroupname(@Param("userid") Integer userid, @Param("projectname") String projectname, @Param("groupname") String groupname);

}
