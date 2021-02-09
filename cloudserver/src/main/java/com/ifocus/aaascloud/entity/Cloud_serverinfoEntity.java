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
@javax.persistence.Table(name="cloud_serverinfo")
public class Cloud_serverinfoEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer serverInfoId;
	private Integer productTypeId;
	private String serverType;
	private Integer serverSeq;
	private String summary;
	private String ipAddress;
	private String port;
	private String dnsAddress;
	private Integer alive;
	@Column(updatable = false)
	private Integer i_uid;
	@Column(updatable = false)
	private Timestamp i_time;
	private Integer u_uid;
	private Timestamp u_time;

}