package com.ifocus.aaascloud.entity;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Getter;
import lombok.Setter;

@Entity
@javax.persistence.Table(name="cloud_user")
public class Cloud_userEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Getter
	@Setter
	private Integer userid;
	@Getter
	@Setter
	private Integer companyid;
	@Getter
	@Setter
	private String username;
	@Getter
	@Setter
	private Integer role;
	@Getter
	@Setter
	private Integer upperuserid;
	@Getter
	@Setter
	private Integer alive;
	@Getter
	@Setter
	private Integer i_uid;
	@Getter
	@Setter
	private Timestamp i_time;
	@Getter
	@Setter
	private Integer u_uid;
	@Getter
	@Setter
	private Timestamp u_time;

}