package com.ifocus.aaascloud.model;

import java.sql.Timestamp;

public class Cloud_userModel {
	// 管理者情報
	private Integer userid;
	private Integer companyid;
	private String username;
	private String loginid;
	private String password;
	private Integer role;
	private Integer upperuserid;
	private Integer alive;
	private Integer i_uid;
	private Timestamp i_time;
	private Integer u_uid;
	private Timestamp u_time;
	// 会社情報
	private String companyName;
	private String address;
	private String industry;
	private String mail;
	private String tel;
	private String fax;
	private Integer level;



	public Integer getUserid() {
		return userid;
	}
	public void setUserid(Integer userid) {
		this.userid = userid;
	}

	public Integer getCompanyid() {
		return companyid;
	}
	public void setCompanyid(Integer companyid) {
		this.companyid = companyid;
	}

	public String getLoginid() {
		return loginid;
	}
	public void setLoginid(String loginid) {
		this.loginid = loginid;
	}

	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}

	public Integer getRole() {
		return role;
	}
	public void setRole(Integer role) {
		this.role = role;
	}

	public Integer getUpperuserid() {
		return upperuserid;
	}
	public void setUpperuserid(Integer upperuserid) {
		this.upperuserid = upperuserid;
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
	public String getCompanyName() {
		return companyName;
	}
	public void setCompanyName(String companyName) {
		this.companyName = companyName;
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
}