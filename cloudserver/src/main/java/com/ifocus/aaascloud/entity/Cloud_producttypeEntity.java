package com.ifocus.aaascloud.entity;

import java.sql.Date;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@javax.persistence.Table(name="cloud_producttype")
public class Cloud_producttypeEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer producttypeid;
	private String producttypename;
	private String summary;
	private Date releasedate;
	private Integer alive;
	@Column(updatable = false)
	private Integer i_uid;
	@Column(updatable = false)
	private Timestamp i_time;
	private Integer u_uid;
	private Timestamp u_time;

}