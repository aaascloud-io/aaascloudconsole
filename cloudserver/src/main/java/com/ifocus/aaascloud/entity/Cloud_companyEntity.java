package com.ifocus.aaascloud.entity;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Data
@javax.persistence.Table(name="cloud_company")
public class Cloud_companyEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer companyid;
	private String corporatenumber;
	private String companyname;
	private String address;
	private String industry;
	private String mail;
	private String tel;
	private String fax;
	private Integer level;
	private Integer alive;
	private Integer deleteflag;
	@Column(updatable = false)
	private Integer i_uid;
	@Column(updatable = false)
	private Timestamp i_time;
	private Integer u_uid;
	private Timestamp u_time;
}