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
	public List<Cloud_deviceEntity> searchSelectableDevicesByCompanyid(@Param("companyid") Integer companyid);

	/*
	 * 配下各社デバイス一覧取得(デバイス管理画面用)
	 *
	 *
	 */
	@Query("SELECT c FROM cloud_device c WHERE c.companyid IN :companyids ORDER BY c.imei")
	@Autowired
	public List<Cloud_deviceEntity> searchUnderCompanyDevicesByCompanyidIn(@Param("companyids") List<Integer> companyids);

	/*
	 * 配下各社デバイス検索(デバイス管理画面用:グループ検索なし)
	 *
	 *
	 */
//	@Query(value = "SELECT d FROM cloud_device d INNER JOIN cloud_product pd ON d.productId = pd.productId INNER JOIN cloud_project pj ON d.projectId = pj.projectId LEFT JOIN cloud_group g ON d.groupId = g.groupId INNER JOIN cloud_company com ON d.companyId = com.companyId WHERE d.companyId IN :companyids AND (d.IMEI LIKE :imei OR d.ICCID LIKE :iccid OR d.SN LIKE :sn) AND pd.productName LIKE :productname AND pj.projectName LIKE :projectname AND com.industry LIKE :industry ORDER BY d.companyId,d.imei,nativeQuery=true)"
//			)
//	public List<Cloud_deviceEntity> abcd(
//			@Param("companyids") List<Integer> companyids,
//			@Param("imei") String imei,
//			@Param("iccid") String iccid,
//			@Param("sn") String sn,
//			@Param("productname") String productName,
//			@Param("projectname") String projectName,
//			@Param("industry") String industry
//		);

	/*
	 * 配下各社デバイス検索(デバイス管理画面用:グループ検索あり)
	 *
	 *
	 */
	@Query(   "SELECT d "
			+ "FROM cloud_device d "
			+ "INNER JOIN cloud_product pd ON d.productId = pd.productId "
			+ "INNER JOIN cloud_project pj ON d.projectId = pj.projectId "
			+ "LEFT JOIN cloud_group g ON d.groupId = g.groupId "
			+ "INNER JOIN cloud_company com ON d.companyId = com.companyId "
			+ "WHERE d.companyId IN :companyids "
			+ "AND (d.IMEI LIKE :imei "
			+ "    OR d.ICCID LIKE :iccid "
			+ "    OR d.SN LIKE :sn) "
			+ "AND pd.productName LIKE :productname "
			+ "AND pj.projectName LIKE :projectname "
			+ "AND com.industry LIKE :industry "
			+ "AND g.groupname LIKE :groupname "
			+ "ORDER BY d.companyId,d.imei")
	@Autowired
	public List<Cloud_deviceEntity> findByCompanyidInAndImeiLikeOrIccidLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLikeAndGroupentity_GroupnameLike(
			@Param("companyids") List<Integer> companyids,
			@Param("imei") String imei,
			@Param("iccid") String iccid,
			@Param("sn") String sn,
			@Param("productname") String productName,
			@Param("projectname") String projectName,
			@Param("industry") String industry,
			@Param("groupname") String groupname
		);

	/*
	 * 配下各社デバイス検索(デバイス管理画面用:グループ検索あり)
	 *
	 *
	 */
	@Query()
	@Autowired
	public List<Cloud_deviceEntity> findByCompanyidIn(@Param("companyids") List<Integer> companyids);

	/*
	 * 自社全デバイス一覧(デバイス管理画面用)
	 *
	 *
	 */
	@Query("SELECT c FROM cloud_device c WHERE c.companyid = :companyid ORDER BY c.imei")
	@Autowired
	public List<Cloud_deviceEntity> searchAllDevicesByCompanyid(@Param("companyid") Integer companyid);

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

	/*
	 * 配下各社デバイス一覧取得(ダッシュボード画面用)
	 *
	 *
	 */
	@Query("SELECT c FROM cloud_device c WHERE c.userid IN :userids ORDER BY c.productid,c.imei")
	@Autowired
	public List<Cloud_deviceEntity> searchUnderCompanyDevicesByUseridIn(@Param("userids") List<Integer> userids);

}
