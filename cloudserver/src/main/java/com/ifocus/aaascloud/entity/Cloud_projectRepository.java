package com.ifocus.aaascloud.entity;

import org.springframework.data.repository.CrudRepository;

//@Repository
public interface  Cloud_projectRepository extends CrudRepository<Cloud_projectEntity, Integer> {

	/*
	 * プロジェクト一覧
	 *
	 *
	 */
//	@Query("SELECT c FROM cloud_project c WHERE c.loginid = :loginid AND c.password = :password ")
//	@Autowired
//	public List<Cloud_userEntity> searchByLoginidAndPassword(@Param("loginid") String loginid, @Param("password") String password);

}
