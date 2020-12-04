package com.ifocus.aaascloud.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.ifocus.aaascloud.entity.Cloud_companyEntity;
import com.ifocus.aaascloud.entity.Cloud_companyRepository;
import com.ifocus.aaascloud.model.Cloud_companyModel;

@SpringBootApplication
@RestController
@Service
@Transactional
public class Cloud_companyService {

	@Autowired
	private Cloud_companyRepository cloud_companyRepository ;

	public Cloud_companyModel getCompanyInfo(Integer companyid) {
		Cloud_companyModel model = new Cloud_companyModel();
		Optional<Cloud_companyEntity> entity = cloud_companyRepository.findById(companyid);
		if (entity != null ) {
			model.setCompanyid(entity.get().getCompanyid());
			model.setCompanyname(entity.get().getCompanyname());
			model.setAddress(entity.get().getAddress());
			model.setIndustry(entity.get().getIndustry());
			model.setMail(entity.get().getMail());
			model.setTel(entity.get().getTel());
			model.setFax(entity.get().getFax());
			model.setLevel(entity.get().getLevel());
		}
		return model;

	}

}
