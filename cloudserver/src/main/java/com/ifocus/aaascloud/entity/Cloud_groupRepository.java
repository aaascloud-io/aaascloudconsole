package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

//@Repository
public interface  Cloud_groupRepository extends CrudRepository<Cloud_groupEntity, Integer> {

	/*
	 * グループ物理削除（deleteflag＝１の行）
	 *
	 *
	 */
	@Modifying
	@Transactional
	@Query(value = " DELETE FROM cloud_group "
			+ " WHERE deleteflag = 1 "
			+ " AND projectid = :projectid"
			+ " AND groupname = :groupname",nativeQuery = true)
	public void deleteGroupMarked(@Param("projectid") Integer projectid,@Param("groupname") String groupname);
	/*
	 * プロジェクトの全グループ一覧
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_group c WHERE c.deleteflag = 0 AND c.projectid = :projectid",nativeQuery = true)
	public List<Cloud_groupEntity> searchGroupsByProjectid(@Param("projectid") Integer projectid);

	/*
	 * プロジェクトの全グループ数
	 *
	 *
	 */
	@Query(value = "SELECT COUNT(c.projectid) FROM cloud_group c WHERE c.deleteflag = 0 AND c.projectid = :projectid",nativeQuery = true)
	public Integer getProjectGroupCountsByProjectid(@Param("projectid") Integer projectid);

	/*
	 * グループ検索
	 *
	 *
	 */
	@Query(value = "SELECT g.* FROM cloud_group g "
			+ " INNER JOIN cloud_project p ON g.projectid = p.projectid "
			+ " WHERE g.deleteflag = 0 AND p.projectname LIKE :projectname "
			+ " AND g.groupname LIKE :groupname "
			+ " AND p.userid = :userid ",nativeQuery = true)
	public List<Cloud_groupEntity> searchGroupsByProjectnameAndGroupname(@Param("userid") Integer userid, @Param("projectname") String projectname, @Param("groupname") String groupname);

}
