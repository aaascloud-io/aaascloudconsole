package com.ifocus.aaascloud.entity;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@javax.persistence.Table(name="cloud_device")
public class Cloud_deviceEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer deviceid;
	private Integer projectid;
	private Integer groupid;
	private String devicename;
	private String imei;
	private String iccid;
	private String sn;
	private String sim_iccid;
	private String sim_imsi;
	private String sim_tel;
	private Integer encryptedcommunications;
	private String encryptedkey;
	private String connectserverurl;
	private String connectserverport;
	private Integer bindingflag;
	private String fmlastestversion;
	private Timestamp versioncomfirmtime;

	private Integer productid;
	private Integer companyid;
	private Integer userid;
	private Integer lastprojectId;
	private Integer lastgroupid;
	private Integer alive;
	@Column(updatable = false)
	private Integer i_uid;
	@Column(updatable = false)
	private Timestamp i_time;
	private Integer u_uid;
	private Timestamp u_time;
	@ManyToOne
	@JoinColumn(name = "product")
	private Cloud_productEntity product;
	@ManyToOne
	@JoinColumn(name = "project")
	private Cloud_projectEntity project;
	@ManyToOne
	@JoinColumn(name = "company")
	private Cloud_companyEntity company;
	@ManyToOne
	@JoinColumn(name = "groupentity")
	private Cloud_groupEntity groupentity;

}