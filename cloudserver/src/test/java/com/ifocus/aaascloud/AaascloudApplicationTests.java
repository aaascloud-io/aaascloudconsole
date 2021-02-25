package com.ifocus.aaascloud;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.ifocus.aaascloud.api.common.BaseHttpResponse;
import com.ifocus.aaascloud.constant.CommonConstant;
import com.ifocus.aaascloud.constant.ErrorConstant;
import com.ifocus.aaascloud.constant.StatusFlagConstant;
import com.ifocus.aaascloud.controller.AccessController;
import com.ifocus.aaascloud.controller.Cloud_errlogController;
import com.ifocus.aaascloud.controller.Cloud_versionController;
import com.ifocus.aaascloud.controller.DashboardController;
import com.ifocus.aaascloud.controller.ProfileController;
import com.ifocus.aaascloud.entity.Cloud_deviceEntity;
import com.ifocus.aaascloud.entity.Cloud_deviceRepository;
import com.ifocus.aaascloud.entity.Cloud_groupRepository;
import com.ifocus.aaascloud.entity.Cloud_productEntity;
import com.ifocus.aaascloud.entity.Cloud_productRepository;
import com.ifocus.aaascloud.entity.Cloud_userEntity;
import com.ifocus.aaascloud.entity.Cloud_userRepository;
import com.ifocus.aaascloud.model.Cloud_companyModel;
import com.ifocus.aaascloud.model.Cloud_deviceModel;
import com.ifocus.aaascloud.model.Cloud_errlogModel;
import com.ifocus.aaascloud.model.Cloud_errresumeModel;
import com.ifocus.aaascloud.model.Cloud_productModel;
import com.ifocus.aaascloud.model.Cloud_projectModel;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.model.Cloud_versionModel;
import com.ifocus.aaascloud.model.LoginInfo;
import com.ifocus.aaascloud.model.TargetUserInfo;
import com.ifocus.aaascloud.service.AccessService;
import com.ifocus.aaascloud.service.Cloud_companyService;
import com.ifocus.aaascloud.service.Cloud_deviceService;
import com.ifocus.aaascloud.service.Cloud_errlogService;
import com.ifocus.aaascloud.service.Cloud_errresumeService;
import com.ifocus.aaascloud.service.Cloud_productService;
import com.ifocus.aaascloud.service.Cloud_projectService;

import junit.framework.TestCase;

@SpringBootTest
class AaascloudApplicationTests extends TestCase{

	@Autowired
	private Cloud_userRepository cloud_userRepository;

	@Autowired
	private Cloud_errresumeService cloud_errresumeService;
	@Autowired
	private AccessService accessService;
	@Autowired
	private Cloud_companyService cloud_companyService;
	@Autowired
	private Cloud_productService cloud_productService;
	@Autowired
	private Cloud_deviceService cloud_deviceService;
	@Autowired
	private Cloud_projectService cloud_projectService;

	@Autowired
	private Cloud_productRepository cloud_productRepository;
	@Autowired
	private Cloud_deviceRepository cloud_deviceRepository;

	@Autowired
	private AccessController accessController;
	@Autowired
	private Cloud_errlogService cloud_errlogService;
	@Autowired
	private Cloud_errlogController cloud_errlogController;
	@Autowired
	private Cloud_versionController cloud_versionController;
	@Autowired
	private ProfileController profileController;
	@Autowired
	private DashboardController dashboardController;
	@Autowired
	private Cloud_groupRepository cloud_groupRepository;

//	/*
//	 * Cloud_userService:login
//	 * 正常系
//	 *
//	 */
//	@Test
//	public void testLogin() throws Exception {
//
//		Cloud_userModel model = cloud_userService.login("admin", "zaq12wsx");
//		assertEquals( model.getUserid() >=0, true);
//	}


//	/*
//	 * searchByLoginIdAndPassword
//	 * 正常系
//	 *
//	 */
//	@Test
//	public void testsearchByLoginIdAndPasswordOK() throws Exception {
//
//		List<Cloud_userEntity> list = (List<Cloud_userEntity>) cloud_userRepository.searchByLoginidAndPassword("admin", "zaq12wsx");
//		assertEquals( list.size(), 1);
//	}


//	/*
//	 * searchByLoginIdAndPassword
//	 * 異常系
//	 *
//	 */
//	@Test
//	public void testsearchByLoginIdAndPassword() throws Exception {
//
//		List<Cloud_userEntity> list = (List<Cloud_userEntity>) cloud_userRepository.searchByLoginidAndPassword("admin", "123456");
//		assertEquals( list.size(), 0);
//	}

	/*
	 * findAll
	 * 正常系
	 *
	 */
	@Test
	public void testfindAll() throws Exception {

		Iterable<Cloud_userEntity> findAll = cloud_userRepository.findAll();

		for (Cloud_userEntity cloud_user : findAll) {
			System.out.println(cloud_user.getUsername());
			assertEquals(cloud_user.getUsername(), "www");
		}
	}

//	/*
//	 * findById
//	 * 正常系
//	 *
//	 */
//	@Test
//	public void testfindById() throws Exception {
//
//		Optional<Cloud_userEntity>  user =  cloud_userRepository.findById(1);
//
//		assertEquals( user.isEmpty(), false);
//
//	}


	/*
	 * Cloud_companyService:getCompanyInfo
	 * 正常系
	 *
	 */
	@Test
	public void testgetCompanyInfo() throws Exception {

		Cloud_companyModel model = cloud_companyService.getCompanyInfo(1);
		assertEquals( model.getCompanyname(), "アイフォーカス");
	}

	/*
	 * Cloud_productService
	 * プロダクト一覧取得
	 * 正常系
	 *
	 */
	@Test
	public void testgetProductAll() throws Exception {

		List<Cloud_productEntity> list = cloud_productService.getProductAll();
		assertEquals( list.size(), 3);
	}

	/*
	 * Cloud_productService
	 * プロダクト登録
	 * 正常系
	 *
	 */
	@Test
	public void testregisterProduct() throws Exception {

		Cloud_productEntity entity = new Cloud_productEntity();
		entity.setProductcode("code004");
		entity.setProductname("テスト用プロダクト");
		entity.setModel("モデム");
		entity.setVersion("Ver0001");
		entity.setSimflag(1);
		entity.setSummary("テスト");
		entity.setAlive(0);
		entity.setI_uid(111);
		entity.setI_time(new Timestamp(System.currentTimeMillis()));
		entity.setU_uid(111);
		entity.setU_time(new Timestamp(System.currentTimeMillis()));


		Cloud_productEntity inserted = cloud_productService.registerProduct(entity);
		assertEquals( inserted.getProductcode(), entity.getProductcode());
		assertEquals( inserted.getProductname(), entity.getProductname());
		assertEquals( inserted.getModel(), entity.getModel());
		assertEquals( inserted.getVersion(), entity.getVersion());
	}

	/*
	 * Cloud_productService
	 * プロダクト更新
	 * 正常系
	 *
	 */
	@Test
	public void testregisterProductForUpdate() throws Exception {

		Cloud_productEntity entity = new Cloud_productEntity();
		entity.setProductid(4);
		entity.setProductcode("code006");
		entity.setProductname("テスト用プロダクト");
		entity.setModel("モデム");
		entity.setVersion("Ver0001");
		entity.setSimflag(1);
		entity.setSummary("テスト");
		entity.setAlive(0);
		entity.setI_uid(222);
		entity.setI_time(new Timestamp(System.currentTimeMillis()));
		entity.setU_uid(333);
		entity.setU_time(new Timestamp(System.currentTimeMillis()));

		/* 更新前のレコード */
		Optional<Cloud_productEntity> before = cloud_productRepository.findById(4);


		Cloud_productEntity updated = cloud_productService.registerProduct(entity);

		/* 更新後のレコード */
		Optional<Cloud_productEntity> after = cloud_productRepository.findById(4);

		assertEquals( after.get().getProductcode(), entity.getProductcode());
		assertEquals( after.get().getProductname(), entity.getProductname());
		assertEquals( after.get().getModel(), entity.getModel());
		assertEquals( after.get().getVersion(), entity.getVersion());
		assertEquals( after.get().getSimflag(), entity.getSimflag());
		assertEquals( after.get().getSummary(), entity.getSummary());
		assertEquals( after.get().getU_uid(), entity.getU_uid());
//		assertEquals( after.get().getU_time(), entity.getU_time());

		/* 更新前のレコードの登録者と登録日時が変わっていないこと */
		assertEquals( after.get().getI_uid(), before.get().getI_uid());
		assertEquals( after.get().getI_time(), before.get().getI_time());
	}

	/*
	 * Cloud_productService
	 * プロダクト削除
	 * 正常系
	 *
	 */
	@Test
	public void testdeleteProduct() throws Exception {

		cloud_productService.deleteProduct(4);

		Optional<Cloud_productEntity> entity = cloud_productRepository.findById(4);

		assertEquals( entity.empty(), true);
	}

	/*
	 * Cloud_userService
	 * アクセス権限ユーザ一覧を取得する
	 * 正常系
	 *
	 */
	@Test
	public void testgetAccessUsers() throws Exception {

		List<Integer> list = accessService.getAccessUsers(1);
		assertEquals( list.size(), 7);
	}

	/*
	 * Cloud_userService
	 * アクセス権限ユーザ一覧を取得する
	 * 正常系2
	 *
	 */
	@Test
	public void testgetAccessUsers2() throws Exception {

		List<Integer> list = accessService.getAccessUsers(5);
		assertEquals( list.size(), 1);
		for (Integer userid:list) {
			assertEquals( userid, Integer.valueOf(5));
		}
	}

	/*
	 * Cloud_userService
	 * アクセス権限ユーザ一覧を取得する
	 * 正常系3
	 *
	 */
	@Test
	public void testgetAccessUsers3() throws Exception {

		List<Integer> list = accessService.getAccessUsers(2);
		assertEquals( list.size(), 3);
	}

	/*
	 * AccessController
	 * アクセス権限ユーザ一覧を取得する
	 * 異常系
	 *
	 */
	@Test
	public void testControllergetAccessUsers() throws Exception {

		Cloud_userModel cloud_userModel = new Cloud_userModel();
		BaseHttpResponse<String> list = accessController.getAccessUsers(cloud_userModel);
		assertEquals( list.getResultCode(), ErrorConstant.ERROR_CODE_0001);
	}

	/*
	 * AccessController
	 * アクセス権限ユーザ一覧を取得する
	 * 正常系
	 *
	 */
	@Test
	public void testControllergetAccessUsersOK() throws Exception {

		Cloud_userModel cloud_userModel = new Cloud_userModel();
		cloud_userModel.setUserid(1);
		BaseHttpResponse<String> list = accessController.getAccessUsers(cloud_userModel);
		assertEquals( list.getResultCode(), ErrorConstant.ERROR_CODE_0000);
	}

	/*
	 * Cloud_deviceService
	 * 配下各社のデバイス一覧取得
	 * 正常系
	 *
	 */
	@Test
	public void testgetUnderCompanyDevices() throws Exception {

		LoginInfo loginInfo = new LoginInfo();
		loginInfo.setLoginuserid(1);
		loginInfo.setLogincompanyid(1);
		TargetUserInfo targetUserInfo = new TargetUserInfo();
		targetUserInfo.setTargetuserid(1);
		targetUserInfo.setTargetuserCompanyid(1);

		Cloud_deviceModel model = new Cloud_deviceModel();

		model.setUserid(1);
		model.setCompanyid(1);
		model.setLoginInfo(loginInfo);
		model.setTargetUserInfo(targetUserInfo);

		List<Cloud_deviceModel> list = cloud_deviceService.getUnderCompanyDevices(model);
		assertEquals( list.isEmpty(), false);
		assertEquals( list.size(), 6);
	}

	/*
	 * Cloud_deviceService
	 * 配下各社のデバイス検索(グループ指定なし)
	 * 正常系
	 *
	 */
	@Test
	public void testgetUnderCompanyDevicesByConditions() throws Exception {

		LoginInfo loginInfo = new LoginInfo();
		loginInfo.setLoginuserid(1);
		loginInfo.setLogincompanyid(1);
		TargetUserInfo targetUserInfo = new TargetUserInfo();
		targetUserInfo.setTargetuserid(1);
		targetUserInfo.setTargetuserCompanyid(1);

		Cloud_deviceModel model = new Cloud_deviceModel();

		model.setUserid(1);
		model.setCompanyid(1);
		model.setLoginInfo(loginInfo);
		model.setTargetUserInfo(targetUserInfo);

		// 検索条件設定
		model.setImei("");
		model.setProductname("テスト");
		model.setProjectname("");
		model.setIndustry("");

		List<Cloud_deviceModel> list = cloud_deviceService.getUnderCompanyDevicesByConditions(model);
		assertEquals( list.isEmpty(), false);
		assertEquals( list.size(), 6);
	}

	/*
	 * Cloud_deviceService
	 * 配下各社のデバイス検索(グループ指定なし)  業界あり
	 * 正常系
	 *
	 */
	@Test
	public void testgetUnderCompanyDevicesByConditionsIndustryOK() throws Exception {

		LoginInfo loginInfo = new LoginInfo();
		loginInfo.setLoginuserid(1);
		loginInfo.setLogincompanyid(1);
		TargetUserInfo targetUserInfo = new TargetUserInfo();
		targetUserInfo.setTargetuserid(1);
		targetUserInfo.setTargetuserCompanyid(1);

		Cloud_deviceModel model = new Cloud_deviceModel();

		model.setUserid(1);
		model.setCompanyid(1);
		model.setLoginInfo(loginInfo);
		model.setTargetUserInfo(targetUserInfo);

		// 検索条件設定
		model.setImei("");
		model.setProductname("");
		model.setProjectname("");
		model.setIndustry("サービス");

		List<Cloud_deviceModel> list = cloud_deviceService.getUnderCompanyDevicesByConditions(model);
		assertEquals( list.isEmpty(), false);
		assertEquals( list.size(), 6);
	}

	/*
	 * Cloud_deviceService
	 * 配下各社のデバイス検索(グループ指定なし)  業界なし
	 * 正常系
	 *
	 */
	@Test
	public void testgetUnderCompanyDevicesByConditionsIndustryNone() throws Exception {

		LoginInfo loginInfo = new LoginInfo();
		loginInfo.setLoginuserid(1);
		loginInfo.setLogincompanyid(1);
		TargetUserInfo targetUserInfo = new TargetUserInfo();
		targetUserInfo.setTargetuserid(1);
		targetUserInfo.setTargetuserCompanyid(1);

		Cloud_deviceModel model = new Cloud_deviceModel();

		model.setUserid(1);
		model.setCompanyid(1);
		model.setLoginInfo(loginInfo);
		model.setTargetUserInfo(targetUserInfo);

		// 検索条件設定
		model.setImei("");
		model.setProductname("");
		model.setProjectname("");
		model.setIndustry("サービスXXX");

		List<Cloud_deviceModel> list = cloud_deviceService.getUnderCompanyDevicesByConditions(model);
		assertEquals( list.isEmpty(), true);
	}

	/*
	 * Cloud_deviceService
	 * 配下各社のデバイス検索(グループ指定あり)
	 * 正常系
	 *
	 */
	@Test
	public void testgetUnderCompanyDevicesByConditionsWithGroup() throws Exception {

		LoginInfo loginInfo = new LoginInfo();
		loginInfo.setLoginuserid(1);
		loginInfo.setLogincompanyid(1);
		TargetUserInfo targetUserInfo = new TargetUserInfo();
		targetUserInfo.setTargetuserid(1);
		targetUserInfo.setTargetuserCompanyid(1);

		Cloud_deviceModel model = new Cloud_deviceModel();

		model.setUserid(1);
		model.setCompanyid(1);
		model.setLoginInfo(loginInfo);
		model.setTargetUserInfo(targetUserInfo);

		// 検索条件設定
		model.setImei("");
		model.setProductname("");
		model.setProjectname("");
		model.setIndustry("");
		model.setGroupname("現場");

		List<Cloud_deviceModel> list = cloud_deviceService.getUnderCompanyDevicesByConditions(model);
		assertEquals( list.isEmpty(), false);
		assertEquals( list.size(), 3);
	}

	/*
	 * Cloud_projectService
	 * 一覧を取得する
	 * 正常系
	 *
	 */
	@Test
	public void testgetMyUnderProjects() throws Exception {

		List<Integer> userList = Arrays.asList(1);

		List<Cloud_projectModel> list = cloud_projectService.getMyUnderProjects(userList);

		assertEquals( list.size(), 1);
	}

	/*
	 * Cloud_projectService
	 * 一覧を取得する
	 * 正常系
	 *
	 */
	@Test
	public void testgetMyUnderProjects2() throws Exception {

		List<Integer> userList = Arrays.asList(1,2,3);

		List<Cloud_projectModel> list = cloud_projectService.getMyUnderProjects(userList);

		assertEquals( list.size(), 3);
	}

	/*
	 * Cloud_productService
	 * プロダクト一覧を取得する
	 * 正常系
	 *
	 */
	@Test
	public void testgetMyUnderProducts() throws Exception {

		List<Integer> userList = Arrays.asList(1,2,3);

		List<Cloud_productModel> list = cloud_productService.getMyUnderProducts(userList);

		assertEquals( list.size(), 3);
	}

//	/*
//	 * HttpClient
//	 * 認証サーバ接続テスト
//	 * 正常系
//	 *
//	 */
//	@Test
//	public void testgetToken() throws Exception {
//
//
//		HttpClient httpClient = new HttpClient();
//		String token = httpClient.getToken("ifocus","123456");
//
//		JSONObject json = (JSONObject) JSONSerializer.toJSON(token);
//		String accessToken = json.getString("access_token");
//
//		assertEquals( token.isEmpty(), false);
//		assertEquals( accessToken.isEmpty(), false);
//	}

//	/*
//	 * HttpClient
//	 * ユーザ情報取得テスト
//	 * 正常系
//	 *
//	 */
//	@Test
//	public void testgetUserInfo() throws Exception {
//
//
//		HttpClient httpClient = new HttpClient();
//		String userInfo = httpClient.getUserInfo("ifocus","123456");
//
//		JSONObject json = (JSONObject) JSONSerializer.toJSON(userInfo);
//		String attributes = json.getString(CommonConstant.JSON_KEY_ATTRIBUTES);
//		JSONObject attributesInfo = (JSONObject) JSONSerializer.toJSON(attributes);
//		String uid = attributesInfo.getString(CommonConstant.JSON_KEY_ACCESS_UID);
//
//		assertEquals( userInfo.isEmpty(), false);
//		assertEquals( attributes.isEmpty(), false);
//		assertEquals( uid.isEmpty(), false);
//	}

	/*
	 * AccessController
	 * ユーザ情報取得テスト
	 * 正常系
	 *
	 */
	@Test
	public void testgetAccessUsersForTrackun() throws Exception {


		Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername("wang");
//		Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername("user32");

		Cloud_userModel model = new Cloud_userModel();
		model.setUsername(loginUserEntity.getUsername());
		model.setUserid(loginUserEntity.getUserid());

		BaseHttpResponse<String> response = accessController.getAccessUsersForTrackun(model);

//		JSONObject json = (JSONObject) JSONSerializer.toJSON(uIDJsonList);

		assertEquals( response.getResultCode(), ErrorConstant.ERROR_CODE_0000);
	}

	/*
	 * Cloud_productRepository
	 * プロダクトID一覧（プロダクト数取得用）searchProductIdsByProjects_UseridIn
	 * 正常系
	 *
	 */
	@Test
	public void testsearchProductIdsByProjects_UseridIn() throws Exception {

		List<Integer> userList = Arrays.asList(1,2,3);

		List<Cloud_productEntity> list = cloud_productRepository.searchProductIdsByProjectsUseridIn(userList);

		assertEquals( list.size(), 1);
	}

	/*
	 * Cloud_errlogService
	 * 一覧取得
	 * 正常系
	 *
	 */
	@Test
	public void testServicegetErrlogList() throws Exception {

		List<Integer> userList = Arrays.asList(1,2,3);
		List<String> imeiList = Arrays.asList("123456");
		List<String> iccidList = Arrays.asList("234567");
		List<String> snList = Arrays.asList("56789");

		List<Cloud_errlogModel> list = cloud_errlogService.getErrlogList(userList,imeiList,iccidList,snList);

		assertEquals( list.size(), 4);
	}

	/*
	 * Cloud_deviceRepository
	 * 一覧取得searchUnderCompanyDevicesByCompanyidIn
	 * 正常系
	 *
	 */
	@Test
	public void testsearchUnderCompanyDevicesByCompanyidIn() throws Exception {

		List<Integer> companyidList = Arrays.asList(1);

		List<Cloud_deviceEntity> list = cloud_deviceRepository.searchUnderCompanyDevicesByCompanyidIn(companyidList);

		assertEquals( list.size(), 5);
	}

	/*
	 * Cloud_deviceRepository
	 * 一覧取得findByCompanyidInAndImeiLikeOrIccidLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLike
	 * 正常系
	 *
	 */
	@Test
	public void testfindByCompanyidInAndImeiLikeOrIccidLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLike() throws Exception {

		List<Integer> companyidList = Arrays.asList(1);
		String imei1 = CommonConstant.DEFAULT_MATCH_ALL;
		String iccid1 = CommonConstant.DEFAULT_MATCH_ALL;
		String sn1 = CommonConstant.DEFAULT_MATCH_ALL;
		String projectName1 = CommonConstant.DEFAULT_MATCH_ALL;
		String productName1 = CommonConstant.DEFAULT_MATCH_ALL;
		String industry1 = CommonConstant.DEFAULT_MATCH_ALL;

		List<Cloud_deviceEntity> list1 = cloud_deviceRepository.findByCompanyidInAndImeiLikeOrIccidLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLike(companyidList,imei1,iccid1,sn1,productName1,projectName1,industry1);

		assertEquals( list1.size(), 5);
	}

//	/*
//	 * Cloud_deviceRepository
//	 * 一覧取得findByCompanyidInProject_ProjectnameLike
//	 * 正常系2
//	 *
//	 */
//	@Test
//	public void testFindByCompanyidInProject_ProjectnameLike() throws Exception {
//
//		List<Integer> companyidList = Arrays.asList(1);
//		String projectName = "%販売分%";
//
//		List<Cloud_deviceEntity> list = cloud_deviceRepository.findByCompanyidInProject_ProjectnameLike(companyidList,projectName);
//
//		assertEquals( 2, list.size() );
//	}
//
//	/*
//	 * Cloud_deviceRepository
//	 * 一覧取得findByCompanyidInAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLike
//	 * 正常系2
//	 *
//	 */
//	@Test
//	public void testFindByCompanyidInAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLike() throws Exception {
//
//		List<Integer> companyidList = Arrays.asList(1,2);
//		String productName = "%FACE%";
//		String projectName = "%販売分%";
//		String industry = "%サービス%";
//
//		List<Cloud_deviceEntity> list = cloud_deviceRepository.findByCompanyidInAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLike(companyidList, productName, projectName, industry);
//
//		assertEquals( 3, list.size() );
//	}
//
//	/*
//	 * Cloud_deviceRepository
//	 * 一覧取得findByCompanyidInAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLike
//	 * 正常系2
//	 *
//	 */
//	@Test
//	public void test2FindByCompanyidInAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLike() throws Exception {
//
//		List<Integer> companyidList = Arrays.asList(1,2);
//		String productName = "%FACE%";
//		String projectName = "%販売分%";
//		String industry = "%サービス%";
//		String imei = "%104%";
//		String iccid = "%104%";
//		String sn = "%104%";
//
//		List<Cloud_deviceEntity> list = cloud_deviceRepository.findByCompanyidInAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLike(companyidList, imei, iccid, sn, productName, projectName, industry);
//
//		assertEquals( 1, list.size() );
//	}

	/*
	 * Cloud_deviceRepository
	 * 一覧取得findByCompanyidInAndImeiLikeOrIccidLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLike
	 * 正常系(グループなし)
	 *
	 */
	@Test
	public void testFindByCompanyidInAndImeiLikeOrIccidLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLike() throws Exception {

		List<Integer> companyidList = Arrays.asList(1,2);
		String productName = "%FACE%";
		String projectName = "%販売分%";
		String industry = "%サービス%";
		String imei = "%104%";
		String iccid = "%104%";
		String sn = "%104%";

		List<Cloud_deviceEntity> list = cloud_deviceRepository.findByCompanyidInAndImeiLikeOrIccidLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLike(companyidList, imei, iccid, sn, productName, projectName, industry);

		assertEquals( 1, list.size() );
	}

	/*
	 * Cloud_deviceRepository
	 * 一覧取得findByCompanyidInAndImeiLikeOrIccidLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLikeAndGroupentity_GroupnameLike
	 * 正常系(グループあり)
	 *
	 */
	@Test
	public void testFindByCompanyidInAndImeiLikeOrIccidLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLikeAndGroupentity_GroupnameLike() throws Exception {

		List<Integer> companyidList = Arrays.asList(1,2);
		String productName = "%FACE%";
		String projectName = "%入庫%";
		String industry = "%サービス%";
		String imei = "%0%";
		String iccid = "%0%";
		String sn = "%0%";
		String groupName = "%A%";

		List<Cloud_deviceEntity> list = cloud_deviceRepository.findByCompanyidInAndImeiLikeOrIccidLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLikeAndGroupentity_GroupnameLike(companyidList, imei, iccid, sn, productName, projectName, industry, groupName);

		assertEquals( 2, list.size() );
	}

	//	/*
//	 * AccessController
//	 * 代理店取得getAgencyCompanyForTrackun
//	 * 正常系
//	 *
//	 */
//	@Test
//	public void testgetAgencyCompanyForTrackun() throws Exception {
//
//		Cloud_userModel model = new Cloud_userModel();
//		model.setUsername("user3");
//
//		BaseHttpResponse<String> response = accessController.getAgencyCompanyForTrackun(model);
//
//		assertEquals( response.getResultCode(), ErrorConstant.ERROR_CODE_0000);
//	}

	/*
	 * Cloud_errlogController
	 * エラーログ一覧情報を取得するテストgetErrlogList
	 * 正常系
	 *
	 */
	@Test
	public void testgetErrlogList() throws Exception {


		Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername("wang");

		Cloud_userModel model = new Cloud_userModel();
		model.setUsername(loginUserEntity.getUsername());
		model.setUserid(loginUserEntity.getUserid());

		BaseHttpResponse<String> response = cloud_errlogController.getErrlogList(model);

		assertEquals( response.getResultCode(), ErrorConstant.ERROR_CODE_0000);
		assertEquals( response.getCount(), 5);
	}

	/*
	 * Cloud_versionController
	 * 登録テストregisterVersion
	 * 正常系（権限なし）
	 *
	 */
	@Test
	public void testRegisterVersionNoAccess() throws Exception {

		Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername("wang");
		LoginInfo loginInfo = new LoginInfo();
		loginInfo.setLoginusername(loginUserEntity.getUsername());
		loginInfo.setLogincompanyid(loginUserEntity.getCompanyid());
		loginInfo.setLoginuserid(loginUserEntity.getUserid());

		Cloud_versionModel model = new Cloud_versionModel();
		model.setLoginInfo(loginInfo);
		model.setProductid(1);
		model.setVersioncode("2.0");
		model.setVersionname("8.0.23.1234567");
		model.setDownloadurl("http://X.X.X.X.xxx/XXXXXX.apk");
		model.setDescription("新バージョン");

		BaseHttpResponse<String> response = cloud_versionController.registerVersion(model);

		assertEquals( response.getResultCode(), ErrorConstant.ERROR_CODE_0002);
	}

	/*
	 * Cloud_versionController
	 * 登録テストregisterVersion
	 * 正常系（権限あり）
	 *
	 */
	@Test
	public void testRegisterVersion() throws Exception {

		Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername("ifocus");
		LoginInfo loginInfo = new LoginInfo();
		loginInfo.setLoginusername(loginUserEntity.getUsername());
		loginInfo.setLogincompanyid(loginUserEntity.getCompanyid());
		loginInfo.setLoginuserid(loginUserEntity.getUserid());

		Cloud_versionModel model = new Cloud_versionModel();
		model.setLoginInfo(loginInfo);
		model.setProductid(1);
		model.setVersioncode("2.0");
		model.setVersionname("8.0.23.1234567");
		model.setDownloadurl("http://X.X.X.X.xxx/XXXXXX.apk");
		model.setDescription("新バージョン");

		BaseHttpResponse<String> response = cloud_versionController.registerVersion(model);

		assertEquals( response.getResultCode(), ErrorConstant.ERROR_CODE_0000);
	}

	/*
	 * Cloud_versionController
	 * 削除テストdeleteVersion
	 * 正常系（権限あり）
	 *
	 */
	@Test
	public void testDeleteVersion() throws Exception {

		Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername("ifocus");
		LoginInfo loginInfo = new LoginInfo();
		loginInfo.setLoginusername(loginUserEntity.getUsername());
		loginInfo.setLogincompanyid(loginUserEntity.getCompanyid());

		Cloud_versionModel model = new Cloud_versionModel();
		model.setLoginInfo(loginInfo);
		model.setRowid(21);

		BaseHttpResponse<String> response = cloud_versionController.deleteVersion(model);

		assertEquals( response.getResultCode(), ErrorConstant.ERROR_CODE_0000);
	}

	/*
	 * Cloud_versionController
	 * 一覧テストgetVersionList
	 * 正常系（権限なし）
	 *
	 */
	@Test
	public void testGetVersionListNoAccess() throws Exception {

		Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername("wang");
		LoginInfo loginInfo = new LoginInfo();
		loginInfo.setLoginusername(loginUserEntity.getUsername());
		loginInfo.setLogincompanyid(loginUserEntity.getCompanyid());
		loginInfo.setLoginuserid(loginUserEntity.getUserid());

		Cloud_userModel model = new Cloud_userModel();
		model.setUsername(loginUserEntity.getUsername());
		model.setUserid(loginUserEntity.getUserid());

		BaseHttpResponse<String> response = cloud_versionController.getVersionList(model);

		assertEquals( ErrorConstant.ERROR_CODE_0000, response.getResultCode());
		assertEquals( 2, response.getCount());

	}

	/*
	 * ProfileController
	 * プロファイルを取得するテストgetUserProfile
	 * 正常系（権限なし）
	 *
	 */
	@Test
	public void testGetUserProfile() throws Exception {

		Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername("wang");
//		LoginInfo loginInfo = new LoginInfo();
//		loginInfo.setLoginusername(loginUserEntity.getUsername());
//		loginInfo.setLogincompanyid(loginUserEntity.getCompanyid());
//		loginInfo.setLoginuserid(loginUserEntity.getUserid());

		Cloud_userModel model = new Cloud_userModel();
		model.setUsername(loginUserEntity.getUsername());
		model.setUserid(loginUserEntity.getUserid());

		BaseHttpResponse<String> response = profileController.getUserProfile(model);

		assertEquals( ErrorConstant.ERROR_CODE_0000, response.getResultCode());
		assertEquals( 1, response.getCount());

	}

	/*
	 * Cloud_errresumeService
	 * 登録テストregisterErrresume
	 * 正常系
	 *
	 */
	@Test
	public void testRegisterErrresume() throws Exception {

		Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername("wang");
		LoginInfo loginInfo = new LoginInfo();
		loginInfo.setLoginusername(loginUserEntity.getUsername());
		loginInfo.setLogincompanyid(loginUserEntity.getCompanyid());
		loginInfo.setLoginuserid(loginUserEntity.getUserid());

		Cloud_errresumeModel model = new Cloud_errresumeModel();
		model.setLoginInfo(loginInfo);
		model.setErrlogid(1);
		model.setDoneFlag(1);
		model.setContents("対応完了。");

		Cloud_errresumeModel response = cloud_errresumeService.registerErrresume(model);

		assertEquals(StatusFlagConstant.FLAG_WIP, response.getStatusflagbefore());
		assertEquals(StatusFlagConstant.FLAG_DONE, response.getStatusflagafter());

	}

	/*
	 * Cloud_errresumeService
	 * 一覧テストgetErrresumeList
	 * 正常系
	 *
	 */
	@Test
	public void testGetErrresumeList() throws Exception {

		List<Cloud_errresumeModel> response = cloud_errresumeService.getErrresumeList(1);

		assertEquals(3, response.size());

	}

	/*
	 * DashboardController
	 * ダッシュボードテストgetDashboardInfo
	 * 正常系
	 *
	 */
	@Test
	public void testGetDashboardInfo() throws Exception {

//		Cloud_userModel model = new Cloud_userModel();
//		model.setUsername("wang");

		Cloud_userEntity loginUserEntity = cloud_userRepository.findByUsername("ifocus");

		Cloud_userModel model = new Cloud_userModel();
		model.setUsername(loginUserEntity.getUsername());
		model.setUserid(loginUserEntity.getUserid());

		BaseHttpResponse<String> response = dashboardController.getDashboardInfo(model);

		assertEquals(200, response.getStatus());

	}


	/*
	 * cloud_groupRepository
	 * グループ数テストgetProjectGroupCountsByProjectid
	 * 正常系
	 *
	 */
	@Test
	public void testGetProjectGroupCountsByProjectid() throws Exception {

		Integer count = cloud_groupRepository.getProjectGroupCountsByProjectid(1);

		assertEquals(new Integer(2), count);

	}
}
