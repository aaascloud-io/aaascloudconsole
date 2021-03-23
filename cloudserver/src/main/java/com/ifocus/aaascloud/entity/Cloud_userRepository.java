package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

//@Repository
public interface  Cloud_userRepository extends CrudRepository<Cloud_userEntity, Integer> {
	
	/*
	 * ユーザー物理削除（deleteflag＝１の行）
	 *
	 *
	 */
	@Modifying
	@Transactional
	@Query(value = " DELETE FROM cloud_user "
			+ " WHERE deleteflag = 1 "
			+ " AND username = :username"
			+ "AND lastname LIKE :lastname "
			+ "AND firstname LIKE :firstname "
			+ "AND email LIKE :email ", nativeQuery = true)
	public void deleteUserMarked(@Param("username") String username,@Param("lastname") String lastname,@Param("firstname") String firstname,@Param("email") String email);

	/*
	 * ユーザ取得
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_user c WHERE c.deleteflag = 0 AND c.username = :username", nativeQuery = true)
	public Cloud_userEntity findByUsername(@Param("username") String username);

	/*
	 * ユーザ取得
	 *
	 *
	 */
	@Query(value = "SELECT u.* "
			+ " FROM cloud_user u "
			+ " WHERE u.deleteflag = 0 AND u.token = :token ", nativeQuery = true)
	public Cloud_userEntity findByToken(@Param("token") String token);

	/*
	 * ユーザ一覧
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_user c WHERE c.deleteflag = 0 AND c.upperuserid = :upperuserid", nativeQuery = true)
	public List<Cloud_userEntity> getUsersByUpperuserid(@Param("upperuserid") Integer upperuserid);

	/*
	 * 配下ユーザの会社ID一覧取得
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_user c WHERE c.deleteflag = 0 AND c.upperuserid = :upperuserid", nativeQuery = true)
	public List<Cloud_userEntity> getUnderUserCompanyIdsByUpperuserid(@Param("upperuserid") Integer upperuserid);

	/*
	 * 会社ユーザ一覧
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_user c WHERE c.deleteflag = 0 AND c.companyid = :companyid", nativeQuery = true)
	public List<Cloud_userEntity> getUsersByCompanyid(@Param("companyid") Integer companyid);

	/*
	 * 配下ユーザ検索
	 *
	 *
	 */
	@Query(value = "SELECT u.* "
			+ "FROM cloud_user u "
			+ "INNER JOIN cloud_company c ON c.companyid = u.companyid "
			+ "WHERE u.deleteflag = 0 AND u.userid IN :userids "
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
