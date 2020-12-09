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
	@Query("SELECT c FROM cloud_project c WHERE c.loginid = :loginid AND c.password = :password ")
	@Autowired
	public List<Cloud_userEntity> searchByLoginidAndPassword(@Param("loginid") String loginid, @Param("password") String password);

}
