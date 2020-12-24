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

@Entity
@javax.persistence.Table(name="cloud_product")
public class Cloud_productEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Getter
	@Setter
	private Integer productid;
	@Getter
	@Setter
	private String productcode;
	@Getter
	@Setter
	private String productname;
	@Getter
	@Setter
	private String model;
	@Getter
	@Setter
	private String version;
	@Getter
	@Setter
	private Integer simflag;
	@Getter
	@Setter
	private String summary;
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
	@OneToMany(mappedBy = "product")
	private List<Cloud_deviceEntity> devicedetailList;

}