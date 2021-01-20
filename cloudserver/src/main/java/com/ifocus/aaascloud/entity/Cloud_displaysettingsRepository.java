package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

//@Repository
public interface  Cloud_displaysettingsRepository extends CrudRepository<Cloud_displaysettingsEntity, Integer> {

	/*
	 * 画面表示項目情報取得
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_displaysettings c WHERE c.companyid = :companyid ORDER BY c.displayorder",nativeQuery = true)
	public List<Cloud_displaysettingsEntity> searchCompanyDisplayInfoByCompanyid(@Param("companyid") Integer companyid);

}
