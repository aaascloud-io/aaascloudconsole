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

	/*
	 * 会社情報取得
	 *
	 */
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

	/*
	 * 会社登録
	 *
	 */
	public Cloud_companyModel registerCompany(Cloud_companyEntity entity) {
		Cloud_companyModel model = new Cloud_companyModel();
		Cloud_companyEntity insertedEntity = cloud_companyRepository.save(entity);
		if (insertedEntity != null ) {
			model.setCompanyid(insertedEntity.getCompanyid());
			model.setCorporatenumber(insertedEntity.getCorporatenumber());
			model.setCompanyname(insertedEntity.getCompanyname());
			model.setAddress(insertedEntity.getAddress());
			model.setIndustry(insertedEntity.getIndustry());
			model.setMail(insertedEntity.getMail());
			model.setTel(insertedEntity.getTel());
			model.setFax(insertedEntity.getFax());
			model.setLevel(insertedEntity.getLevel());
		}
		return model;

	}

	/*
	 * 会社更新
	 *
	 */
	public Cloud_companyModel updateCompany(Cloud_companyEntity entity) {
		Cloud_companyModel model = new Cloud_companyModel();
		Cloud_companyEntity updatedEntity = cloud_companyRepository.save(entity);
		if (updatedEntity != null ) {
			model.setCompanyid(updatedEntity.getCompanyid());
			model.setCorporatenumber(updatedEntity.getCorporatenumber());
			model.setCompanyname(updatedEntity.getCompanyname());
			model.setAddress(updatedEntity.getAddress());
			model.setIndustry(updatedEntity.getIndustry());
			model.setMail(updatedEntity.getMail());
			model.setTel(updatedEntity.getTel());
			model.setFax(updatedEntity.getFax());
			model.setLevel(updatedEntity.getLevel());
		}
		return model;

	}

	/*
	 * 会社削除
	 *
	 */
	public void deleteCompany(Cloud_companyEntity entity) {
		cloud_companyRepository.deleteById(entity.getCompanyid());
	}
}
