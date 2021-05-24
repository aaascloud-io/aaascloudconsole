package com.ifocus.aaascloud.repository;

import java.util.List;

import com.ifocus.aaascloud.entity.Cloud_companyEntity;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

//@Repository
public interface  Cloud_companyRepository extends CrudRepository<Cloud_companyEntity, Integer> {


	/*
	 * 会社テーブル物理削除（deleteflag＝１の行）
	 *
	 *
	 */
	@Modifying
	@Transactional
	@Query(value = " DELETE FROM cloud_company "
			+ " WHERE deleteflag = 1 "
			+ " AND corporatenumber = :corporatenumber",nativeQuery = true)
	public void deleteCompanyMarked(@Param("corporatenumber") String corporatenumber);

	/*
	 * 会社情報取得
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_company c INNER JOIN cloud_user d ON c.companyid = d.companyid WHERE d.userid = :userid"
			+ " AND c.deleteflag = 0 ",nativeQuery = true)
	public Cloud_companyEntity findCompanyByUserid(@Param("userid") Integer userid);

	/*
	 * 配下会社一覧情報取得
	 * @param userids List<Integer> 配下ユーザIDリスト
	 *
	 */
	@Query(value = "SELECT DISTINCTROW c.* FROM cloud_company c INNER JOIN cloud_user u ON c.companyid = u.companyid WHERE u.userid IN :userids"
			+ " AND c.deleteflag = 0 ",nativeQuery = true)
	public List<Cloud_companyEntity> findUnderCompanyListByUseridIn(@Param("userids") List<Integer> userids);
}
