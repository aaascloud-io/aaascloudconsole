package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

//@Repository
public interface  Cloud_deviceRepository extends CrudRepository<Cloud_deviceEntity, Integer> {

	/*
	 * プロジェクトなしの全デバイス一覧(デバイス選択子画面用)
	 *
	 *
	 */
	@Query("SELECT c FROM cloud_device c WHERE c.projectid = 0 AND c.companyid = :companyid")
	@Autowired
	public List<Cloud_deviceEntity> searchMyDevicesByCompanyid(@Param("companyid") Integer companyid);

	/*
	 * 自社全デバイス一覧(デバイス管理画面用)
	 *
	 *
	 */
	@Query("SELECT c FROM cloud_device c WHERE c.companyid = :companyid")
	@Autowired
	public List<Cloud_deviceEntity> searchMyDevicesAllByCompanyid(@Param("companyid") Integer companyid);

	/*
	 * プロジェクトの全デバイス一覧(デバイス管理画面用)
	 *
	 *
	 */
	@Query("SELECT c FROM cloud_device c WHERE c.projectid = :projectid")
	@Autowired
	public List<Cloud_deviceEntity> searchDevicesByProjectid(@Param("projectid") Integer projectid);

	/*
	 * プロジェクトの全デバイス数
	 *
	 *
	 */
	@Query("SELECT COUNT(c) FROM cloud_device c WHERE c.projectid = :projectid")
	@Autowired
	public Integer getProjectDeviceCountsByProjectid(@Param("projectid") Integer projectid);

	/*
	 * グループの全デバイス一覧
	 *
	 *
	 */
	@Query("SELECT c FROM cloud_device c WHERE c.projectid = :projectid AND c.groupid = :groupid")
	@Autowired
	public List<Cloud_deviceEntity> searchDevicesByProjectidAndGroupid(@Param("projectid") Integer projectid, @Param("groupid") Integer groupid);

	/*
	 * グループの全デバイス数
	 *
	 *
	 */
	@Query("SELECT COUNT(c) FROM cloud_device c WHERE c.projectid = :projectid AND c.groupid = :groupid")
	@Autowired
	public Integer getGroupDeviceCountsByProjectidAndGroupid(@Param("projectid") Integer projectid, @Param("groupid") Integer groupid);
}
