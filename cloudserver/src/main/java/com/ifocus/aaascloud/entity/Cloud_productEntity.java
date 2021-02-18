package com.ifocus.aaascloud.entity;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@javax.persistence.Table(name="cloud_product")
public class Cloud_productEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer productid;
	private Integer producttypeid;
	private String productcode;
	private String productname;
	private String model;
	private String version;
	private Integer simflag;
	private String summary;
	private Integer alive;
	@Column(updatable = false)
	private Integer i_uid;
	@Column(updatable = false)
	private Timestamp i_time;
	private Integer u_uid;
	private Timestamp u_time;
	@OneToMany(mappedBy = "product")
	private List<Cloud_deviceEntity> devicedetailList;
	@OneToMany(mappedBy = "projects")
	private List<Cloud_projectEntity> projects;

}