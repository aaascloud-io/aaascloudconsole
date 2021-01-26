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
@javax.persistence.Table(name="cloud_errresume")
public class Cloud_errresumeEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer rowid;
	private Integer errlogid ;
	private Integer statusflagbefore ;
	private Integer statusflagafter ;
	private String contents;
	private Integer alive;
	@Column(updatable = false)
	private Integer i_uid;
	@Column(updatable = false)
	private Timestamp i_time;
	private Integer u_uid;
	private Timestamp u_time;

}