package com.ifocus.aaascloud.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.ifocus.aaascloud.entity.Cloud_userEntity;
import com.ifocus.aaascloud.entity.Cloud_userRepository;
import com.ifocus.aaascloud.model.Cloud_userModel;

@SpringBootApplication
@RestController
@Service
@Transactional
public class Cloud_userService {

	@Autowired
	private Cloud_userRepository cloud_userRepository ;

	public Cloud_userModel login(String loginid, String pswd) {
		Cloud_userModel model = new Cloud_userModel();
		model.setUserid(-1);
		List<Cloud_userEntity> list = cloud_userRepository.searchByLoginidAndPassword(loginid, pswd);
		if (list != null && list.size() == 1) {
			list.forEach(elm -> {
				model.setUserid(elm.getUserid());
				model.setUsername(elm.getUsername());
				model.setCompanyid(elm.getCompanyid());
				model.setLoginid(elm.getLoginid());
				model.setRole(elm.getRole());
				model.setUpperuserid(elm.getUpperuserid());
			});
		}
		return model;

	}

}
