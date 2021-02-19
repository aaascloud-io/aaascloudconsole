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

@Entity
@javax.persistence.Table(name="cloud_device")
public class Cloud_deviceEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Getter
	@Setter
	private Integer deviceid;
	@Getter
	@Setter
	private Integer projectid;
	@Getter
	@Setter
	private Integer groupid;
	@Getter
	@Setter
	private String devicename;
	@Getter
	@Setter
	private String imei;
	@Getter
	@Setter
	private String iccid;
	@Getter
	@Setter
	private String sn;
	@Getter
	@Setter
	private String sim_iccid;
	@Getter
	@Setter
	private String sim_imsi;
	@Getter
	@Setter
	private String sim_tel;
	@Getter
	@Setter
	private Integer productid;
	@Getter
	@Setter
	private Integer companyid;
	@Getter
	@Setter
	private Integer userid;
	@Getter
	@Setter
	private Integer lastprojectId;
	@Getter
	@Setter
	private Integer lastgroupid;
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
	@Getter
	@Setter
	@ManyToOne
	@JoinColumn(name = "product")
	private Cloud_productEntity product;
	@Getter
	@Setter
	@ManyToOne
	@JoinColumn(name = "project")
	private Cloud_projectEntity project;
	@Getter
	@Setter
	@ManyToOne
	@JoinColumn(name = "company")
	private Cloud_companyEntity company;
	@Getter
	@Setter
	@ManyToOne
	@JoinColumn(name = "groupentity")
	private Cloud_groupEntity groupentity;

}