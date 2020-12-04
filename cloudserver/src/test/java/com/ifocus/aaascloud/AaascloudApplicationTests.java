package com.ifocus.aaascloud;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.ifocus.aaascloud.entity.Cloud_userEntity;
import com.ifocus.aaascloud.entity.Cloud_userRepository;
import com.ifocus.aaascloud.model.Cloud_companyModel;
import com.ifocus.aaascloud.model.Cloud_userModel;
import com.ifocus.aaascloud.service.Cloud_companyService;
import com.ifocus.aaascloud.service.Cloud_userService;

import junit.framework.TestCase;

@SpringBootTest
class AaascloudApplicationTests extends TestCase{

	//public AaascloudApplicationTests(String arg0) {
	//	super(arg0);
	//}
	//@Autowired
	private Cloud_userService cloud_userService;
	@Autowired
	private Cloud_userRepository cloud_userRepository;

	@Autowired
	private Cloud_companyService cloud_companyService;


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

}
