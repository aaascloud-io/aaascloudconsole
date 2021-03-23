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
@javax.persistence.Table(name="cloud_errlog")
public class Cloud_errlogEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Getter
	@Setter
	private Integer rowid;
	@Getter
	@Setter
	private Integer userid;
	@Getter
	@Setter
	private String device;
	@Getter
	@Setter
	private Integer statusflag;
	@Getter
	@Setter
	private Timestamp datatime;
	@Getter
	@Setter
	private String systemsort;
	@Getter
	@Setter
	private String systemid;
	@Getter
	@Setter
	private String componentid;
	@Getter
	@Setter
	private String messageid;
	@Getter
	@Setter
	private String messagesort;
	@Getter
	@Setter
	private String errcode;
	@Getter
	@Setter
	private String errMessage;
	@Getter
	@Setter
	private Integer alive;
	@Getter
	@Setter
	private Integer deleteflag;
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