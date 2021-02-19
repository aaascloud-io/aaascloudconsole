package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

//@Repository
public interface  Cloud_companyRepository extends CrudRepository<Cloud_companyEntity, Integer> {

	/*
	 * 会社情報取得
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_company c INNER JOIN cloud_user d ON c.companyid = d.companyid WHERE d.userid = :userid",nativeQuery = true)
	public Cloud_companyEntity findCompanyByUserid(@Param("userid") Integer userid);

	/*
	 * 配下会社一覧情報取得
	 * @param userids List<Integer> 配下ユーザIDリスト
	 *
	 */
	@Query(value = "SELECT DISTINCTROW c.* FROM cloud_company c INNER JOIN cloud_user u ON c.companyid = u.companyid WHERE u.userid IN :userids",nativeQuery = true)
	public List<Cloud_companyEntity> findUnderCompanyListByUseridIn(@Param("userids") List<Integer> userids);
}
