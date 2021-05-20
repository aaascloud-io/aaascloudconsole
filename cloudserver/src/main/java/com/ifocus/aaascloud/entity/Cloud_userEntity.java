package com.ifocus.aaascloud.entity;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Entity
@javax.persistence.Table(name="cloud_user")
public class Cloud_userEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer userid;
	private Integer companyid;
	private String username;
	private String firstname;
	private String lastname;
	private String email;
	private Integer role;
	private Integer upperuserid;
	private String token;
	private Integer alive;
	private String firebaseuid;
	private Integer deleteflag;
	private Integer i_uid;
	private Timestamp i_time;
	private Integer u_uid;
	private Timestamp u_time;

}