package com.ifocus.aaascloud.entity;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
 
//@Repository
public interface  Cloud_deviceRepository extends CrudRepository<Cloud_deviceEntity, Integer>, JpaSpecificationExecutor<Cloud_deviceEntity> {

	/*
	 * デバイス物理削除（deleteflag＝１の行）
	 *
	 *
	 */
	@Modifying
	@Transactional
	@Query(value = " DELETE FROM cloud_device "
			+ " WHERE deleteflag = 1 "
			+ " AND sn = :sn",nativeQuery = true)
	public void deleteDeviceMarked(@Param("sn") String sn);


	@Query(value = "SELECT d.* "
			+ " FROM cloud_device d "
			+ " LEFT JOIN cloud_product pd ON d.productId = pd.productId "
			+ " LEFT JOIN cloud_project pj ON d.projectId = pj.projectId "
			+ " LEFT JOIN cloud_company com ON d.companyId = com.companyId "
			+ " LEFT JOIN cloud_group g ON d.groupId = g.groupId "
			+ " WHERE d.deleteflag = 0"
			+ " AND d.userid IN :userids "
			+ " AND (d.IMEI LIKE :imei "
			+ " OR d.SN LIKE :sn OR d.SIM_ICCID LIKE :sim_iccid) "
			+ " AND IFNULL(pd.productName, '') LIKE :productname "
			+ " AND IFNULL(pj.projectName, '') LIKE :projectname "
			+ " AND IFNULL(g.groupname, '') LIKE :groupname "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByQuery(
			@Param("userids") List<Integer> userids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("sim_iccid") String sim_iccid,
			@Param("productname") String productName,
			@Param("projectname") String projectName,
			@Param("groupname") String groupname
		);
	
	@Query(value = "SELECT d.* "
			+ " FROM cloud_device d "
			+ " LEFT JOIN cloud_product pd ON d.productId = pd.productId "
			+ " LEFT JOIN cloud_project pj ON d.projectId = pj.projectId "
			+ " LEFT JOIN cloud_company com ON d.companyId = com.companyId "
			+ " LEFT JOIN cloud_group g ON d.groupId = g.groupId "
			+ " WHERE d.deleteflag = 0 "
			+ " AND d.userid IN :userids "
			+ " AND (d.IMEI LIKE :imei "
			+ " OR d.SN LIKE :sn OR d.SIM_ICCID LIKE :sim_iccid) "
			+ " AND IFNULL(pd.productName, '') LIKE :productname "
			+ " AND IFNULL(pj.projectName, '') LIKE :projectname "
			+ " AND com.companyid = :companyid "
			+ " AND IFNULL(g.groupname, '') LIKE :groupname "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByQueryByCompanyid(
			@Param("companyid") Integer companyid,
			@Param("userids") List<Integer> userids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("sim_iccid") String sim_iccid,
			@Param("productname") String productName,
			@Param("projectname") String projectName,
			@Param("groupname") String groupname
		);

	/*
	 * プロジェクトなしの全デバイス一覧(デバイス選択子画面用)
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c "
			+ "WHERE c.deleteflag = 0 AND  c.companyid = :companyid "
			+ " AND c.userid IN :userids "
			+ " AND (c.projectid IS NULL OR c.projectid = 0) ", nativeQuery = true)
	public List<Cloud_deviceEntity> searchSelectableDevicesByCompanyidAndUserids(@Param("companyid") Integer companyid, List<Integer> userids);

	/*
	 * 配下各社デバイス一覧取得(デバイス管理画面用)
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.deleteflag = 0 AND  c.companyid IN :companyids ORDER BY c.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> searchUnderCompanyDevicesByCompanyidIn(@Param("companyids") List<Integer> companyids);

	/*
	 * 配下ユーザデバイス一覧取得(デバイス管理画面用)
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.deleteflag = 0 AND  c.userid IN :userids ORDER BY c.imei", nativeQuery = true)
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
			+ " WHERE d.deleteflag = 0 AND  d.companyId IN :companyids "
			+ " AND (d.IMEI LIKE :imei "
			+ "    OR d.SN LIKE :sn) "
			+ " AND pd.productName LIKE :productname "
			+ " AND g.groupname LIKE :groupname "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByCompanyidInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndCompany_IndustryLikeAndGroupentity_GroupnameLike(
			@Param("companyids") List<Integer> companyids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("productname") String productName,
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
			+ " WHERE d.deleteflag = 0 AND  d.companyId IN :companyids "
			+ " AND (d.IMEI LIKE :imei "
			+ "    OR d.SN LIKE :sn) "
			+ " AND pd.productName LIKE :productname "
			+ " AND pj.projectName LIKE :projectname "
			+ " AND g.groupname LIKE :groupname "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByCompanyidInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLikeAndGroupentity_GroupnameLike(
			@Param("companyids") List<Integer> companyids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("productname") String productName,
			@Param("projectname") String projectName,
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
			+ " WHERE d.deleteflag = 0 AND  d.companyId IN :companyids "
			+ " AND (d.IMEI LIKE :imei "
			+ "    OR d.SN LIKE :sn) "
			+ " AND pd.productName LIKE :productname "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByCompanyidInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndCompany_IndustryLike(
			@Param("companyids") List<Integer> companyids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("productname") String productName
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
			+ " WHERE d.deleteflag = 0 AND  d.companyId IN :companyids "
			+ " AND (d.IMEI LIKE :imei "
			+ "    OR d.SN LIKE :sn) "
			+ " AND pd.productName LIKE :productname "
			+ " AND pj.projectName LIKE :projectname "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByCompanyidInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLike(
			@Param("companyids") List<Integer> companyids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("productname") String productName,
			@Param("projectname") String projectName
		);

	/*
	 * 配下ユーザデバイス検索(デバイス管理画面用:所有者条件＝なし、グループ条件＝あり、プロジェクト名条件＝なし)
	 *
	 *
	 */
	@Query(value = "SELECT d.* "
			+ " FROM cloud_device d "
			+ " LEFT JOIN cloud_product pd ON d.productId = pd.productId "
			+ " LEFT JOIN cloud_company com ON d.companyId = com.companyId "
			+ " LEFT JOIN cloud_group g ON d.groupId = g.groupId "
			+ " WHERE d.deleteflag = 0 AND  d.userid IN :userids "
			+ " AND (d.IMEI LIKE :imei "
			+ " OR d.SN LIKE :sn OR d.SIM_ICCID LIKE :sim_iccid) "
			+ " AND pd.productName LIKE :productname "
			+ " AND g.groupname LIKE :groupname "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByNoCompanyHasGroupNoProject(
			@Param("userids") List<Integer> userids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("sim_iccid") String sim_iccid,
			@Param("productname") String productName,
			@Param("groupname") String groupname
		);

	/*
	 * 配下ユーザデバイス検索(デバイス管理画面用:所有者条件＝なし、グループ条件＝あり、プロジェクト名条件＝あり)
	 *
	 *
	 */
	@Query(value = "SELECT d.* "
			+ " FROM cloud_device d "
			+ " LEFT JOIN cloud_product pd ON d.productId = pd.productId "
			+ " LEFT JOIN cloud_project pj ON d.projectId = pj.projectId "
			+ " LEFT JOIN cloud_company com ON d.companyId = com.companyId "
			+ " LEFT JOIN cloud_group g ON d.groupId = g.groupId "
			+ " WHERE d.deleteflag = 0 AND  d.userid IN :userids "
			+ " AND (d.IMEI LIKE :imei "
			+ " OR d.SN LIKE :sn OR d.SIM_ICCID LIKE :sim_iccid) "
			+ " AND pd.productName LIKE :productname "
			+ " AND pj.projectName LIKE :projectname "
			+ " AND g.groupname LIKE :groupname "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByNoCompanyHasGroupHasProject(
			@Param("userids") List<Integer> userids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("sim_iccid") String sim_iccid,
			@Param("productname") String productName,
			@Param("projectname") String projectName,
			@Param("groupname") String groupname
		);

	/*
	 * 配下ユーザデバイス検索(デバイス管理画面用:所有者条件＝なし、グループ条件＝なし、プロジェクト名条件＝なし)
	 *
	 *
	 */
	@Query(value = "SELECT d.* "
			+ " FROM cloud_device d "
			+ " LEFT JOIN cloud_product pd ON d.productId = pd.productId "
			+ " LEFT JOIN cloud_company com ON d.companyId = com.companyId "
			+ " WHERE d.deleteflag = 0 AND  d.userid IN :userids "
			+ " AND (d.IMEI LIKE :imei "
			+ "    OR d.SN LIKE :sn OR d.SIM_ICCID LIKE :sim_iccid) "
			+ " AND pd.productName LIKE :productname "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByNoCompanyNoGroupNoProject(
			@Param("userids") List<Integer> userids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("sim_iccid") String sim_iccid,
			@Param("productname") String productName
		);

	/*
	 * 配下ユーザデバイス検索(デバイス管理画面用:所有者条件＝なし、グループ条件＝なし、プロジェクト名条件＝あり)
	 *
	 *
	 */
	@Query(value = "SELECT d.* "
			+ " FROM cloud_device d "
			+ " LEFT JOIN cloud_product pd ON d.productId = pd.productId "
			+ " LEFT JOIN cloud_project pj ON d.projectId = pj.projectId "
			+ " LEFT JOIN cloud_company com ON d.companyId = com.companyId "
			+ " WHERE d.deleteflag = 0 AND  d.userid IN :userids "
			+ " AND (d.IMEI LIKE :imei "
			+ " OR d.SN LIKE :sn OR d.SIM_ICCID LIKE :sim_iccid) "
			+ " AND pd.productName LIKE :productname "
			+ " AND pj.projectName LIKE :projectname "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByNoCompanyNoGroupHasProject(
			@Param("userids") List<Integer> userids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("sim_iccid") String sim_iccid,
			@Param("productname") String productName,
			@Param("projectname") String projectName
		);

	/*
	 * 配下ユーザデバイス検索(デバイス管理画面用:所有者条件＝あり、グループ条件＝あり、プロジェクト名条件＝なし)
	 *
	 *
	 */
	@Query(value = "SELECT d.* "
			+ " FROM cloud_device d "
			+ " LEFT JOIN cloud_product pd ON d.productId = pd.productId "
			+ " LEFT JOIN cloud_company com ON d.companyId = com.companyId "
			+ " LEFT JOIN cloud_group g ON d.groupId = g.groupId "
			+ " WHERE d.deleteflag = 0 AND  d.userid IN :userids "
			+ " AND (d.IMEI LIKE :imei "
			+ " OR d.SN LIKE :sn OR d.SIM_ICCID LIKE :sim_iccid) "
			+ " AND pd.productName LIKE :productname "
			+ " AND com.companyid = :companyid "
			+ " AND g.groupname LIKE :groupname "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByHasCompanyHasGroupNoProject(
			@Param("companyid") Integer companyid,
			@Param("userids") List<Integer> userids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("sim_iccid") String sim_iccid,
			@Param("productname") String productName,
			@Param("groupname") String groupname
		);

	/*
	 * 配下ユーザデバイス検索(デバイス管理画面用:所有者条件＝あり、グループ条件＝あり、プロジェクト名条件＝あり)
	 *
	 *
	 */
	@Query(value = "SELECT d.* "
			+ " FROM cloud_device d "
			+ " LEFT JOIN cloud_product pd ON d.productId = pd.productId "
			+ " LEFT JOIN cloud_project pj ON d.projectId = pj.projectId "
			+ " LEFT JOIN cloud_company com ON d.companyId = com.companyId "
			+ " LEFT JOIN cloud_group g ON d.groupId = g.groupId "
			+ " WHERE d.deleteflag = 0 AND  d.userid IN :userids "
			+ " AND (d.IMEI LIKE :imei "
			+ " OR d.SN LIKE :sn OR d.SIM_ICCID LIKE :sim_iccid) "
			+ " AND pd.productName LIKE :productname "
			+ " AND pj.projectName LIKE :projectname "
			+ " AND com.companyid = :companyid "
			+ " AND g.groupname LIKE :groupname "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByHasCompanyHasGroupHasProject(
			@Param("companyid") Integer companyid,
			@Param("userids") List<Integer> userids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("sim_iccid") String sim_iccid,
			@Param("productname") String productName,
			@Param("projectname") String projectName,
			@Param("groupname") String groupname
		);

	/*
	 * 配下ユーザデバイス検索(デバイス管理画面用:所有者条件＝あり、グループ条件＝なし、プロジェクト名条件＝なし)
	 *
	 *
	 */
	@Query(value = "SELECT d.* "
			+ " FROM cloud_device d "
			+ " LEFT JOIN cloud_product pd ON d.productId = pd.productId "
			+ " LEFT JOIN cloud_company com ON d.companyId = com.companyId "
			+ " WHERE d.deleteflag = 0 AND  d.userid IN :userids "
			+ " AND (d.IMEI LIKE :imei "
			+ " OR d.SN LIKE :sn OR d.SIM_ICCID LIKE :sim_iccid) "
			+ " AND pd.productName LIKE :productname "
			+ " AND com.companyid = :companyid "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByHasCompanyNoGroupNoProject(
			@Param("companyid") Integer companyid,
			@Param("userids") List<Integer> userids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("sim_iccid") String sim_iccid,
			@Param("productname") String productName
		);

	/*
	 * 配下ユーザデバイス検索(デバイス管理画面用:所有者条件＝あり、グループ条件＝なし、プロジェクト名条件＝あり)
	 *
	 *
	 */
	@Query(value = "SELECT d.* "
			+ " FROM cloud_device d "
			+ " LEFT JOIN cloud_product pd ON d.productId = pd.productId "
			+ " LEFT JOIN cloud_project pj ON d.projectId = pj.projectId "
			+ " LEFT JOIN cloud_company com ON d.companyId = com.companyId "
			+ " WHERE d.deleteflag = 0 AND d.userid IN :userids "
			+ " AND (d.IMEI LIKE :imei "
			+ " OR d.SN LIKE :sn OR d.SIM_ICCID LIKE :sim_iccid) "
			+ " AND pd.productName LIKE :productname "
			+ " AND pj.projectName LIKE :projectname "
			+ " AND com.companyid = :companyid "
			+ " ORDER BY d.companyId,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> findByHasCompanyNoGroupHasProject(
			@Param("companyid") Integer companyid,
			@Param("userids") List<Integer> userids,
			@Param("imei") String imei,
			@Param("sn") String sn,
			@Param("sim_iccid") String sim_iccid,
			@Param("productname") String productName,
			@Param("projectname") String projectName
		);

	/*
	 * 自社全デバイス一覧(デバイス管理画面用)
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.deleteflag = 0 AND c.companyid = :companyid ORDER BY c.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> searchAllDevicesByCompanyid(@Param("companyid") Integer companyid);

	/*
	 * プロジェクトの全デバイス一覧(デバイス管理画面用)
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.deleteflag = 0 AND c.projectid = :projectid", nativeQuery = true)
	public List<Cloud_deviceEntity> searchDevicesByProjectid(@Param("projectid") Integer projectid);

	/*
	 * プロジェクトのみ所属するデバイス一覧
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.deleteflag = 0 AND c.projectid = :projectid AND (c.groupid IS NULL OR c.groupid = 0) ", nativeQuery = true)
	public List<Cloud_deviceEntity> searchProjectDevicesWithNoGroupByProjectid(@Param("projectid") Integer projectid);

	/*
	 * プロジェクトの全デバイス数
	 *
	 *
	 */
	@Query(value = "SELECT COUNT(c) FROM cloud_device c WHERE c.deleteflag = 0 AND c.projectid = :projectid", nativeQuery = true)
	public Integer getProjectDeviceCountsByProjectid(@Param("projectid") Integer projectid);

	/*
	 * グループの全デバイス一覧
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.deleteflag = 0 AND c.projectid = :projectid AND c.groupid = :groupid", nativeQuery = true)
	public List<Cloud_deviceEntity> searchDevicesByProjectidAndGroupid(@Param("projectid") Integer projectid, @Param("groupid") Integer groupid);

	/*
	 * グループの全デバイス一覧
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.deleteflag = 0 AND c.groupid = :groupid", nativeQuery = true)
	public List<Cloud_deviceEntity> searchDevicesByGroupid(@Param("groupid") Integer groupid);

	/*
	 * グループの全デバイス数
	 *
	 *
	 */
	@Query(value = "SELECT COUNT(c) FROM cloud_device c WHERE c.deleteflag = 0 AND c.projectid = :projectid AND c.groupid = :groupid", nativeQuery = true)
	public Integer getGroupDeviceCountsByProjectidAndGroupid(@Param("projectid") Integer projectid, @Param("groupid") Integer groupid);

	/*
	 * 配下各社デバイス一覧取得(ダッシュボード画面用)
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.deleteflag = 0 AND c.userid IN :userids ORDER BY c.productid,c.imei", nativeQuery = true)
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
			+ "WHERE c.deleteflag = 0 AND pt.productTypeName = :producttype "
			+ "AND d.userid IN :userids "
			+ "ORDER BY d.productid,d.imei", nativeQuery = true)
	public List<Cloud_deviceEntity> searchUnderCompanyDevicesByProducttypeAndUseridIn( @Param("producttype") String producttype, @Param("userids") List<Integer> userids);

	/*
	 * IMEI存在チェック
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.deleteflag = 0 AND c.imei IN :imei ", nativeQuery = true)
	public List<Cloud_deviceEntity> searchDevicesByImeiIn(@Param("imei") List<String> imei);

	/*
	 * SN存在チェック
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.deleteflag = 0 AND c.sn IN :sn ", nativeQuery = true)
	public List<Cloud_deviceEntity> searchDeviceBySnIn(@Param("sn") List<String> sn);

	/*
	 * SIM_IMSI存在チェック
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.deleteflag = 0 AND c.sim_imsi IN :sim_imsi ", nativeQuery = true)
	public List<Cloud_deviceEntity> searchDeviceBySim_imsiIn(@Param("sim_imsi") List<String> sim_imsi);

	/*
	 * SIM_ICCID存在チェック
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.deleteflag = 0 AND c.sim_iccid IN :sim_iccid ", nativeQuery = true)
	public List<Cloud_deviceEntity> searchDeviceBySim_iccidIn(@Param("sim_iccid") List<String> sim_iccid);

	/*
	 * SIM_TEL存在チェック
	 *
	 *
	 */
	@Query(value = "SELECT c.* FROM cloud_device c WHERE c.deleteflag = 0 AND c.sim_tel IN :sim_tel ", nativeQuery = true)
	public List<Cloud_deviceEntity> searchDeviceBySim_telIn(@Param("sim_tel") List<String> sim_tel);

}
