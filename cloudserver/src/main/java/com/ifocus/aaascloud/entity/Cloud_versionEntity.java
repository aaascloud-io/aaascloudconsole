package com.ifocus.aaascloud.entity;

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
@javax.persistence.Table(name="cloud_version")
public class Cloud_versionEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer rowid;
	private Integer productid ;
	private String versioncode;
	private String versionname;
	private String downloadurl;
	private String description;
	private Integer alive;
	private Integer deleteflag;
	@Column(updatable = false)
	private Integer i_uid;
	@Column(updatable = false)
	private Timestamp i_time;
	private Integer u_uid;
	private Timestamp u_time;

}