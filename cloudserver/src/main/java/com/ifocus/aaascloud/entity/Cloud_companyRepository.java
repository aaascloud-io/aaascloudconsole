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

	public List<Cloud_companyEntity> findByCorporatenumber(String corporatenumber);

}
