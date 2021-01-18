package com.ifocus.aaascloud.entity;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.ifocus.aaascloud.model.Cloud_userModel;

//@Repository
public interface  Cloud_companyRepository extends CrudRepository<Cloud_companyEntity, Integer> {

	/*
	 * 会社情報取得
	 *
	 *
	 */
	@Query(value = "SELECT c.*,d.userId,d.userName FROM cloud_company c INNER JOIN cloud_user d ON c.companyid = d.companyid WHERE d.userid = :userid",nativeQuery = true)
	public Cloud_userModel findCompanyByUserid(@Param("userid") Integer userid);
}
