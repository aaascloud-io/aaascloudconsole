package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

//@Repository
public interface  Cloud_groupRepository extends CrudRepository<Cloud_groupEntity, Integer> {

	/*
	 * プロジェクトの全グループ一覧
	 *
	 *
	 */
	@Query("SELECT * FROM cloud_group c WHERE c.projectid = :projectid")
	@Autowired
	public List<Cloud_groupEntity> searchGroupsByProjectid(@Param("projectid") Integer projectid);

	/*
	 * プロジェクトの全グループ数
	 *
	 *
	 */
	@Query("SELECT COUNT(c.projectid) FROM cloud_group c WHERE c.projectid = :projectid")
	@Autowired
	public Integer getProjectGroupCountsByProjectid(@Param("projectid") Integer projectid);

}
