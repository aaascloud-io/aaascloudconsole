package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

//@Repository
public interface Cloud_errresumeRepository extends CrudRepository<Cloud_errresumeEntity, Integer> {

	/*
	 * エラー履歴情報一覧取得
	 */
	@Query(value = "SELECT c.* FROM cloud_errresume c WHERE c.errlogid = :errlogid ORDER BY i_time DESC",nativeQuery = true)
	public List<Cloud_errresumeEntity> findListByErrlogid(@Param("errlogid") Integer errlogid);

}
