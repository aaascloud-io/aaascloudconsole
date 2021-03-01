package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

//@Repository
public interface  Cloud_userRepository extends CrudRepository<Cloud_userEntity, Integer> {

	/*
	 * ユーザ取得
	 *
	 *
	 */
	public Cloud_userEntity findByUsername(@Param("username") String username);

	/*
	 * ユーザ一覧
	 *
	 *
	 */
	public List<Cloud_userEntity> getUsersByUpperuserid(@Param("upperuserid") Integer upperuserid);

	/*
	 * 配下ユーザの会社ID一覧取得
	 *
	 *
	 */
	public List<Cloud_userEntity> getUnderUserCompanyIdsByUpperuserid(@Param("upperuserid") Integer upperuserid);

	/*
	 * 会社ユーザ一覧
	 *
	 *
	 */
	public List<Cloud_userEntity> getUsersByCompanyid(@Param("companyid") Integer companyid);

	/*
	 * 配下ユーザ検索
	 *
	 *
	 */
	@Query(value = "SELECT u.* "
			+ "FROM cloud_user u "
			+ "INNER JOIN cloud_company c ON c.companyid = u.companyid "
			+ "WHERE u.userid IN :userids "
			+ "AND c.companyname LIKE :companyname "
			+ "AND u.firstname LIKE :firstname "
			+ "AND u.lastname LIKE :lastname "
			+ "AND u.email LIKE :email ", nativeQuery = true)
	public List<Cloud_userEntity> searchUnderUsersByCompanyname(@Param("userids") List<Integer> userids,
			@Param("companyname") String companyname,
			@Param("firstname") String firstname,
			@Param("lastname") String lastname,
			@Param("email") String email);

}
