package com.ifocus.aaascloud.repository;

import java.util.List;

import com.ifocus.aaascloud.entity.Cloud_errlogEntity;
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
	@Query(value = "SELECT c.* FROM cloud_errlog c WHERE c.deleteflag = 0 AND c.statusflag != 9 AND (c.userid IN :userids OR c.device IN :imeis OR c.device IN :sns) ",nativeQuery = true)
	public List<Cloud_errlogEntity> searchErrlogsByUseridInOrDeviceIn(@Param("userids") List<Integer> userids, @Param("imeis") List<String> imeis, @Param("sns") List<String> sns);

}
