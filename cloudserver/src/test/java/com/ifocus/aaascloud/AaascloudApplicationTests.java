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
import com.ifocus.aaascloud.controller.AccessController;
import com.ifocus.aaascloud.entity.Cloud_productEntity;
import com.ifocus.aaascloud.entity.Cloud_productRepository;
import com.ifocus.aaascloud.entity.Cloud_userEntity;
import com.ifocus.aaascloud.entity.Cloud_userRepository;
import com.ifocus.aaascloud.model.Cloud_companyModel;
import com.ifocus.aaascloud.model.Cloud_deviceModel;
import com.ifocus.aaascloud.model.Cloud_projectModel;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.model.LoginInfo;
import com.ifocus.aaascloud.model.TargetUserInfo;
import com.ifocus.aaascloud.service.AccessService;
import com.ifocus.aaascloud.service.Cloud_companyService;
import com.ifocus.aaascloud.service.Cloud_deviceService;
import com.ifocus.aaascloud.service.Cloud_productService;
import com.ifocus.aaascloud.service.Cloud_projectService;
import com.ifocus.aaascloud.service.Cloud_userService;
import com.ifocus.aaascloud.util.HttpClient;

import junit.framework.TestCase;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

@SpringBootTest
class AaascloudApplicationTests extends TestCase{

	@Autowired
	private Cloud_userRepository cloud_userRepository;

	@Autowired
	private Cloud_userService cloud_userService;
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
	private AccessController accessController;


	/*
	 * Cloud_userService:login
	 * 正常系
	 *
	 */
	@Test
	public void testLogin() throws Exception {

		Cloud_userModel model = cloud_userService.login("admin", "zaq12wsx");
		assertEquals( model.getUserid() >=0, true);
	}


	/*
	 * searchByLoginIdAndPassword
	 * 正常系
	 *
	 */
	@Test
	public void testsearchByLoginIdAndPasswordOK() throws Exception {

		List<Cloud_userEntity> list = (List<Cloud_userEntity>) cloud_userRepository.searchByLoginidAndPassword("admin", "zaq12wsx");
		assertEquals( list.size(), 1);
	}


	/*
	 * searchByLoginIdAndPassword
	 * 異常系
	 *
	 */
	@Test
	public void testsearchByLoginIdAndPassword() throws Exception {

		List<Cloud_userEntity> list = (List<Cloud_userEntity>) cloud_userRepository.searchByLoginidAndPassword("admin", "123456");
		assertEquals( list.size(), 0);
	}

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
	/*
	 * findById
	 * 正常系
	 *
	 */
	@Test
	public void testfindById() throws Exception {

		Optional<Cloud_userEntity>  user =  cloud_userRepository.findById(1);

		assertEquals( user.isEmpty(), false);

	}


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

		assertEquals( entity.isEmpty(), true);
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

		List<Cloud_productEntity> list = cloud_productService.getMyUnderProducts(userList);

		assertEquals( list.size(), 3);
	}

	/*
	 * HttpClient
	 * 認証サーバ接続テスト
	 * 正常系
	 *
	 */
	@Test
	public void testgetToken() throws Exception {


		HttpClient httpClient = new HttpClient();
		String token = httpClient.getToken("ifocus","123456");

		JSONObject json = (JSONObject) JSONSerializer.toJSON(token);
		String accessToken = json.getString("access_token");

		assertEquals( token.isEmpty(), false);
		assertEquals( accessToken.isEmpty(), false);
	}

	/*
	 * HttpClient
	 * ユーザ情報取得テスト
	 * 正常系
	 *
	 */
	@Test
	public void testgetUserInfo() throws Exception {


		HttpClient httpClient = new HttpClient();
		String userInfo = httpClient.getUserInfo("ifocus","123456");

		JSONObject json = (JSONObject) JSONSerializer.toJSON(userInfo);
		String attributes = json.getString(CommonConstant.JSON_KEY_ATTRIBUTES);
		JSONObject attributesInfo = (JSONObject) JSONSerializer.toJSON(attributes);
		String uid = attributesInfo.getString(CommonConstant.JSON_KEY_ACCESS_UID);

		assertEquals( userInfo.isEmpty(), false);
		assertEquals( attributes.isEmpty(), false);
		assertEquals( uid.isEmpty(), false);
	}
}
