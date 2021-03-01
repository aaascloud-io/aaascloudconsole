package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

//@Repository
public interface  Cloud_errlogRepository extends CrudRepository<Cloud_errlogEntity, Integer> {

	/*
	 * エラー一覧
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_errlog c WHERE c.statusflag != 9 AND (c.userid IN :userids OR c.device IN :imeis OR c.device IN :sns) ",nativeQuery = true)
	public List<Cloud_errlogEntity> searchErrlogsByUseridInOrDeviceIn(@Param("userids") List<Integer> userids, @Param("imeis") List<String> imeis, @Param("sns") List<String> sns);

}
