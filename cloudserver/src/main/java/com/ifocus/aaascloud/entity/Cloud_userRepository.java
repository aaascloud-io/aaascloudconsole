package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

//@Repository
public interface  Cloud_userRepository extends CrudRepository<Cloud_userEntity, Integer> {

	/*
	 * ユーザ取得
	 *
	 *
	 */
	@Query("SELECT c FROM cloud_user c WHERE c.username = :username ")
	@Autowired
	public Cloud_userEntity findByUsername(@Param("username") String username);

	/*
	 * ユーザ一覧
	 *
	 *
	 */
	@Query("SELECT c FROM cloud_user c WHERE c.upperuserid = :upperuserid")
	@Autowired
	public List<Cloud_userEntity> getUsersByUpperuserid(@Param("upperuserid") Integer upperuserid);

	/*
	 * 配下ユーザの会社ID一覧取得
	 *
	 *
	 */
	@Query("SELECT DISTINCT c FROM cloud_user c WHERE c.upperuserid = :upperuserid")
	@Autowired
	public List<Cloud_userEntity> getUnderUserCompanyIdsByUpperuserid(@Param("upperuserid") Integer upperuserid);

	/*
	 * 会社ユーザ一覧
	 *
	 *
	 */
	@Query("SELECT c FROM cloud_user c WHERE c.companyid = :companyid")
	@Autowired
	public List<Cloud_userEntity> getUsersByCompanyid(@Param("companyid") Integer companyid);

	public List<Cloud_userEntity> findByCompanyid(Integer companyid);

//	/*
//	 * 配下ユーザ検索
//	 *
//	 *
//	 */
//	@Query(value = "SELECT u.* "
//			+ "FROM cloud_user u "
//			+ "INNER JOIN cloud_company c ON c.companyid = u.companyid "
//			+ "WHERE u.userid IN :userids "
//			+ "AND c.companyname LIKE :companyname ")
//	public List<Cloud_userEntity> searchUnderUsersByCompanyname(@Param("userids") List<Integer> userids, @Param("companyname") String companyname);
}
