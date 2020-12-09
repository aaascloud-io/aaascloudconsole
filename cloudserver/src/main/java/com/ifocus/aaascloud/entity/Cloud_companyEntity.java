package com.ifocus.aaascloud.entity;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Getter;
import lombok.Setter;

@Entity
@javax.persistence.Table(name="cloud_company")
public class Cloud_companyEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Getter
	@Setter
	private Integer companyid;
	@Getter
	@Setter
	private String corporatenumber;
	@Getter
	@Setter
	private String companyname;
	@Getter
	@Setter
	private String address;
	@Getter
	@Setter
	private String industry;
	@Getter
	@Setter
	private String mail;
	@Getter
	@Setter
	private String tel;
	@Getter
	@Setter
	private String fax;
	@Getter
	@Setter
	private Integer level;
	@Getter
	@Setter
	private Integer alive;
	@Getter
	@Setter
	@Column(updatable = false)
	private Integer i_uid;
	@Getter
	@Setter
	@Column(updatable = false)
	private Timestamp i_time;
	@Getter
	@Setter
	private Integer u_uid;
	@Getter
	@Setter
	private Timestamp u_time;

}