package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

//@Repository
public interface  Cloud_userRepository extends CrudRepository<Cloud_userEntity, Integer> {

	/*
	 * ログイン認証
	 *
	 *
	 */
	@Query("SELECT c FROM cloud_user c WHERE c.loginid = :loginid AND c.password = :password ")
	@Autowired
	public List<Cloud_userEntity> searchByLoginidAndPassword(@Param("loginid") String loginid, @Param("password") String password);

}
