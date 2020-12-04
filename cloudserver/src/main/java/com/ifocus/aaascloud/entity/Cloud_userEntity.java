package com.ifocus.aaascloud.entity;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@javax.persistence.Table(name="cloud_user")
public class Cloud_userEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
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
}