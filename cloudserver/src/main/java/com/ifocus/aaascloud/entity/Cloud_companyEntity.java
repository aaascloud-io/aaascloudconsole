package com.ifocus.aaascloud.entity;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@javax.persistence.Table(name="cloud_company")
public class Cloud_companyEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer companyid;
	private String companyname;
	private String address;
	private String industry;
	private String mail;
	private String tel;
	private String fax;
	private Integer level;
	private Integer alive;
	private Integer i_uid;
	private Timestamp i_time;
	private Integer u_uid;
	private Timestamp u_time;

	public Integer getCompanyid() {
		return companyid;
	}
	public void setCompanyid(Integer companyid) {
		this.companyid = companyid;
	}

	public String getCompanyname() {
		return companyname;
	}
	public void setCompanyname(String companyname) {
		this.companyname = companyname;
	}

	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getIndustry() {
		return industry;
	}
	public void setIndustry(String industry) {
		this.industry = industry;
	}
	public String getMail() {
		return mail;
	}
	public void setMail(String mail) {
		this.mail = mail;
	}
	public String getTel() {
		return tel;
	}
	public void setTel(String tel) {
		this.tel = tel;
	}
	public String getFax() {
		return fax;
	}
	public void setFax(String fax) {
		this.fax = fax;
	}
	public Integer getLevel() {
		return level;
	}
	public void setLevel(Integer level) {
		this.level = level;
	}
	public Integer getAlive() {
		return alive;
	}
	public void setAlive(Integer alive) {
		this.alive = alive;
	}

	public Integer getI_uid() {
		return i_uid;
	}
	public void setI_uid(Integer i_uid) {
		this.i_uid = i_uid;
	}

	public Timestamp getI_time() {
		return i_time;
	}
	public void setI_time(Timestamp i_time) {
		this.i_time = i_time;
	}

	public Integer getU_uid() {
		return u_uid;
	}
	public void setU_uid(Integer u_uid) {
		this.u_uid = u_uid;
	}

	public Timestamp getU_time() {
		return u_time;
	}
	public void setU_time(Timestamp u_time) {
		this.u_time = u_time;
	}
}