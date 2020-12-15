package com.ifocus.aaascloud;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.ifocus.aaascloud.api.common.BaseHttpResponse;
import com.ifocus.aaascloud.constant.ErrorConstant;
import com.ifocus.aaascloud.controller.AccessController;
import com.ifocus.aaascloud.entity.Cloud_productEntity;
import com.ifocus.aaascloud.entity.Cloud_productRepository;
import com.ifocus.aaascloud.entity.Cloud_userEntity;
import com.ifocus.aaascloud.entity.Cloud_userRepository;
import com.ifocus.aaascloud.model.Cloud_companyModel;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.service.Cloud_companyService;
import com.ifocus.aaascloud.service.Cloud_productService;
import com.ifocus.aaascloud.service.Cloud_userService;

import junit.framework.TestCase;

@SpringBootTest
class AaascloudApplicationTests extends TestCase{

	@Autowired
	private Cloud_userService cloud_userService;
	@Autowired
	private Cloud_userRepository cloud_userRepository;

	@Autowired
	private Cloud_companyService cloud_companyService;
	@Autowired
	private Cloud_productService cloud_productService;

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

		List<Integer> list = cloud_userService.getAccessUsers(1);
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

		List<Integer> list = cloud_userService.getAccessUsers(5);
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

		List<Integer> list = cloud_userService.getAccessUsers(2);
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

}
