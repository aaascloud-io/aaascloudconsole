package com.ifocus.aaascloud.entity;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import lombok.Getter;
import lombok.Setter;

@Entity
@javax.persistence.Table(name="cloud_project")
public class Cloud_projectEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Getter
	@Setter
	private Integer projectid;
	@Getter
	@Setter
	private Integer userid;
	@Getter
	@Setter
	private String projectname;
	@Getter
	@Setter
	private Integer productid;
	@Getter
	@Setter
	private String projectsummary;
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
	@OneToMany(mappedBy = "project")
	private List<Cloud_deviceEntity> devicedetailList;
//	@Getter
//	@Setter
//	@ManyToOne
//	@JoinColumn(name = "projects")
//	private Cloud_productEntity projects;

}