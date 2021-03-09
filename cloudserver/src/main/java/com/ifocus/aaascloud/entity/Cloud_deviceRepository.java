package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

//@Repository
public interface  Cloud_deviceRepository extends CrudRepository<Cloud_deviceEntity, Integer> {

	/*
	 * プロジェクトなしの全デバイス一覧(デバイス選択子画面用)
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c "
			+ "WHERE c.companyid = :companyid "
			+ "AND (c.projectid IS NULL OR c.projectid = 0) ", nativeQuery = true)
	public List<Cloud_deviceEntity> searchSelectableDevicesByCompanyid(@Param("companyid") Integer companyid);

	/*
	 * 配下各社デバイス一覧取得(デバイス管理画面用)
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.companyid IN :companyids ORDER BY c.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> searchUnderCompanyDevicesByCompanyidIn(@Param("companyids") List<Integer> companyids);

	/*
	 * 配下ユーザデバイス一覧取得(デバイス管理画面用)
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.userid IN :userids ORDER BY c.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> searchUnderUserDevicesByUseridIn(@Param("userids") List<Integer> userids);

	/*
	 * 配下各社デバイス検索(デバイス管理画面用:グループ条件＝あり、プロジェクト名条件＝なし)
	 *
	 *
	 */
	@Query(value = "SELECT d.* "
			+ " FROM cloud_device d "
			+ " LEFT JOIN cloud_product pd ON d.productId = pd.productId "
			+ " LEFT JOIN cloud_company com ON d.companyId = com.companyId "
			+ " LEFT JOIN cloud_group g ON d.groupId = g.groupId "
			+ " WHERE d.companyId IN :companyids "
			+ " AND (d.IMEI LIKE :imei "
			+ "    OR d.SN LIKE :sn) "
			+ " AND pd.productName LIKE :productname "
			+ " AND com.industry LIKE :industry "
			+ " AND g.groupname LIKE :groupname "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByCompanyidInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndCompany_IndustryLikeAndGroupentity_GroupnameLike(
			@Param("companyids") List<Integer> companyids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("productname") String productName,
			@Param("industry") String industry,
			@Param("groupname") String groupname
		);

	/*
	 * 配下各社デバイス検索(デバイス管理画面用:グループ条件＝あり、プロジェクト名条件＝あり)
	 *
	 *
	 */
	@Query(value = "SELECT d.* "
			+ " FROM cloud_device d "
			+ " LEFT JOIN cloud_product pd ON d.productId = pd.productId "
			+ " LEFT JOIN cloud_project pj ON d.projectId = pj.projectId "
			+ " LEFT JOIN cloud_company com ON d.companyId = com.companyId "
			+ " LEFT JOIN cloud_group g ON d.groupId = g.groupId "
			+ " WHERE d.companyId IN :companyids "
			+ " AND (d.IMEI LIKE :imei "
			+ "    OR d.SN LIKE :sn) "
			+ " AND pd.productName LIKE :productname "
			+ " AND pj.projectName LIKE :projectname "
			+ " AND com.industry LIKE :industry "
			+ " AND g.groupname LIKE :groupname "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByCompanyidInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLikeAndGroupentity_GroupnameLike(
			@Param("companyids") List<Integer> companyids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("productname") String productName,
			@Param("projectname") String projectName,
			@Param("industry") String industry,
			@Param("groupname") String groupname
		);

	/*
	 * 配下各社デバイス検索(デバイス管理画面用:グループ条件＝なし、プロジェクト名条件＝なし)
	 *
	 *
	 */
	@Query(value = "SELECT d.* "
			+ " FROM cloud_device d "
			+ " LEFT JOIN cloud_product pd ON d.productId = pd.productId "
			+ " LEFT JOIN cloud_company com ON d.companyId = com.companyId "
			+ " WHERE d.companyId IN :companyids "
			+ " AND (d.IMEI LIKE :imei "
			+ "    OR d.SN LIKE :sn) "
			+ " AND pd.productName LIKE :productname "
			+ " AND com.industry LIKE :industry "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByCompanyidInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndCompany_IndustryLike(
			@Param("companyids") List<Integer> companyids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("productname") String productName,
			@Param("industry") String industry
		);

	/*
	 * 配下各社デバイス検索(デバイス管理画面用:グループ条件＝なし、プロジェクト名条件＝あり)
	 *
	 *
	 */
	@Query(value = "SELECT d.* "
			+ " FROM cloud_device d "
			+ " LEFT JOIN cloud_product pd ON d.productId = pd.productId "
			+ " LEFT JOIN cloud_project pj ON d.projectId = pj.projectId "
			+ " LEFT JOIN cloud_company com ON d.companyId = com.companyId "
			+ " WHERE d.companyId IN :companyids "
			+ " AND (d.IMEI LIKE :imei "
			+ "    OR d.SN LIKE :sn) "
			+ " AND pd.productName LIKE :productname "
			+ " AND pj.projectName LIKE :projectname "
			+ " AND com.industry LIKE :industry "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByCompanyidInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLike(
			@Param("companyids") List<Integer> companyids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("productname") String productName,
			@Param("projectname") String projectName,
			@Param("industry") String industry
		);

	/*
	 * 配下ユーザデバイス検索(デバイス管理画面用:グループ条件＝あり、プロジェクト名条件＝なし)
	 *
	 *
	 */
	@Query(value = "SELECT d.* "
			+ " FROM cloud_device d "
			+ " LEFT JOIN cloud_product pd ON d.productId = pd.productId "
			+ " LEFT JOIN cloud_company com ON d.companyId = com.companyId "
			+ " LEFT JOIN cloud_group g ON d.groupId = g.groupId "
			+ " WHERE d.userid IN :userids "
			+ " AND (d.IMEI LIKE :imei "
			+ "    OR d.SN LIKE :sn) "
			+ " AND pd.productName LIKE :productname "
			+ " AND com.industry LIKE :industry "
			+ " AND g.groupname LIKE :groupname "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByUseridInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndCompany_IndustryLikeAndGroupentity_GroupnameLike(
			@Param("userids") List<Integer> userids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("productname") String productName,
			@Param("industry") String industry,
			@Param("groupname") String groupname
		);

	/*
	 * 配下ユーザデバイス検索(デバイス管理画面用:グループ条件＝あり、プロジェクト名条件＝あり)
	 *
	 *
	 */
	@Query(value = "SELECT d.* "
			+ " FROM cloud_device d "
			+ " LEFT JOIN cloud_product pd ON d.productId = pd.productId "
			+ " LEFT JOIN cloud_project pj ON d.projectId = pj.projectId "
			+ " LEFT JOIN cloud_company com ON d.companyId = com.companyId "
			+ " LEFT JOIN cloud_group g ON d.groupId = g.groupId "
			+ " WHERE d.userid IN :userids "
			+ " AND (d.IMEI LIKE :imei "
			+ "    OR d.SN LIKE :sn) "
			+ " AND pd.productName LIKE :productname "
			+ " AND pj.projectName LIKE :projectname "
			+ " AND com.industry LIKE :industry "
			+ " AND g.groupname LIKE :groupname "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByUseridInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLikeAndGroupentity_GroupnameLike(
			@Param("userids") List<Integer> userids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("productname") String productName,
			@Param("projectname") String projectName,
			@Param("industry") String industry,
			@Param("groupname") String groupname
		);

	/*
	 * 配下ユーザデバイス検索(デバイス管理画面用:グループ条件＝なし、プロジェクト名条件＝なし)
	 *
	 *
	 */
	@Query(value = "SELECT d.* "
			+ " FROM cloud_device d "
			+ " LEFT JOIN cloud_product pd ON d.productId = pd.productId "
			+ " LEFT JOIN cloud_company com ON d.companyId = com.companyId "
			+ " WHERE d.userid IN :userids "
			+ " AND (d.IMEI LIKE :imei "
			+ "    OR d.SN LIKE :sn) "
			+ " AND pd.productName LIKE :productname "
			+ " AND com.industry LIKE :industry "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByUseridInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndCompany_IndustryLike(
			@Param("userids") List<Integer> userids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("productname") String productName,
			@Param("industry") String industry
		);

	/*
	 * 配下ユーザデバイス検索(デバイス管理画面用:グループ条件＝なし、プロジェクト名条件＝あり)
	 *
	 *
	 */
	@Query(value = "SELECT d.* "
			+ " FROM cloud_device d "
			+ " LEFT JOIN cloud_product pd ON d.productId = pd.productId "
			+ " LEFT JOIN cloud_project pj ON d.projectId = pj.projectId "
			+ " LEFT JOIN cloud_company com ON d.companyId = com.companyId "
			+ " WHERE d.userid IN :userids "
			+ " AND (d.IMEI LIKE :imei "
			+ "    OR d.SN LIKE :sn) "
			+ " AND pd.productName LIKE :productname "
			+ " AND pj.projectName LIKE :projectname "
			+ " AND com.industry LIKE :industry "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByUseridInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLike(
			@Param("userids") List<Integer> userids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("productname") String productName,
			@Param("projectname") String projectName,
			@Param("industry") String industry
		);

	/*
	 * 自社全デバイス一覧(デバイス管理画面用)
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.companyid = :companyid ORDER BY c.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> searchAllDevicesByCompanyid(@Param("companyid") Integer companyid);

	/*
	 * プロジェクトの全デバイス一覧(デバイス管理画面用)
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.projectid = :projectid", nativeQuery = true)
	public List<Cloud_deviceEntity> searchDevicesByProjectid(@Param("projectid") Integer projectid);

	/*
	 * プロジェクトのみ所属するデバイス一覧
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.projectid = :projectid AND (c.groupid IS NULL OR c.groupid = 0) ", nativeQuery = true)
	public List<Cloud_deviceEntity> searchProjectDevicesWithNoGroupByProjectid(@Param("projectid") Integer projectid);

	/*
	 * プロジェクトの全デバイス数
	 *
	 *
	 */
	@Query(value = "SELECT COUNT(c) FROM cloud_device c WHERE c.projectid = :projectid", nativeQuery = true)
	public Integer getProjectDeviceCountsByProjectid(@Param("projectid") Integer projectid);

	/*
	 * グループの全デバイス一覧
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.projectid = :projectid AND c.groupid = :groupid", nativeQuery = true)
	public List<Cloud_deviceEntity> searchDevicesByProjectidAndGroupid(@Param("projectid") Integer projectid, @Param("groupid") Integer groupid);

	/*
	 * グループの全デバイス一覧
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.groupid = :groupid", nativeQuery = true)
	public List<Cloud_deviceEntity> searchDevicesByGroupid(@Param("groupid") Integer groupid);

	/*
	 * グループの全デバイス数
	 *
	 *
	 */
	@Query(value = "SELECT COUNT(c) FROM cloud_device c WHERE c.projectid = :projectid AND c.groupid = :groupid", nativeQuery = true)
	public Integer getGroupDeviceCountsByProjectidAndGroupid(@Param("projectid") Integer projectid, @Param("groupid") Integer groupid);

	/*
	 * 配下各社デバイス一覧取得(ダッシュボード画面用)
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.userid IN :userids ORDER BY c.productid,c.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> searchUnderCompanyDevicesByUseridIn(@Param("userids") List<Integer> userids);

	/*
	 * 配下各社プロダクトタイプ別デバイス一覧取得(ダッシュボード画面用)
	 *
	 *
	 */
	@Query(value = "SELECT d.* "
			+ "FROM cloud_device d "
			+ "INNER JOIN cloud_product pd ON d.productId = pd.productId "
			+ "INNER JOIN cloud_producttype pt ON pd.productTypeId = pt.productTypeId "
			+ "WHERE pt.productTypeName = :producttype "
			+ "AND d.userid IN :userids "
			+ "ORDER BY d.productid,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> searchUnderCompanyDevicesByProducttypeAndUseridIn( @Param("producttype") String producttype, @Param("userids") List<Integer> userids);

	/*
	 * IMEI存在チェック
	 *
	 *
	 */
	public List<Cloud_deviceEntity> searchDevicesByImeiIn(@Param("imei") List<String> imei);

	/*
	 * SN存在チェック
	 *
	 *
	 */
	public List<Cloud_deviceEntity> searchDeviceBySnIn(@Param("sn") List<String> sn);

	/*
	 * SIM_IMSI存在チェック
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.sim_imsi IN :sim_imsi ", nativeQuery = true)
	public List<Cloud_deviceEntity> searchDeviceBySim_imsiIn(@Param("sim_imsi") List<String> sim_imsi);

	/*
	 * SIM_ICCID存在チェック
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.sim_iccid IN :sim_iccid ", nativeQuery = true)
	public List<Cloud_deviceEntity> searchDeviceBySim_iccidIn(@Param("sim_iccid") List<String> sim_iccid);

	/*
	 * SIM_TEL存在チェック
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.sim_tel IN :sim_tel ", nativeQuery = true)
	public List<Cloud_deviceEntity> searchDeviceBySim_telIn(@Param("sim_tel") List<String> sim_tel);

}
