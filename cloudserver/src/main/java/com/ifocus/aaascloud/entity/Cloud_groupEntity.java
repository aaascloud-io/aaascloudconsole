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
@javax.persistence.Table(name="cloud_group")
public class Cloud_groupEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Getter
	@Setter
	private Integer groupid;
	@Getter
	@Setter
	private Integer projectid;
	@Getter
	@Setter
	private String groupname;
	@Getter
	@Setter
	private String summary;
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
	@Getter
	@Setter
	@OneToMany(mappedBy = "groupentity")
	private List<Cloud_deviceEntity> devicedetailList;

}