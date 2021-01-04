package com.xiaour.spring.boot.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.xiaour.spring.boot.dto.SignupForm;
import com.xiaour.spring.boot.entity.UserInfo;
import com.xiaour.spring.boot.mapper.UserInfoMapper;
import com.xiaour.spring.boot.utils.Md5Util;

/**
 * Created by fengwei.jiang
 */
@Controller
public class LoninController extends BaseController {

	@Autowired
	private UserInfoMapper userInfoMapper;

	@RequestMapping(value = "/index")
	public String index(SignupForm signupForm) {
		return "/login";
	}

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public String login(Map<String, Object> map, SignupForm signupForm) throws Exception {

		String loginId = signupForm.getUsername();
		String password = Md5Util.getMd5(signupForm.getPassword()).toUpperCase();

		Map<String, String> mapParam = new HashMap<String, String>();
		mapParam.put("loginid", loginId);
		mapParam.put("password", password);
		UserInfo userInfo = userInfoMapper.selectByPassWord(mapParam);
		if (userInfo == null) {
			map.put("msg", "ユーザー名パスワードが間違っている");
			return "/login";

		} else {
			return "/tables";
		}
	}

}
