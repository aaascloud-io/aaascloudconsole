package com.ifocus.aaascloud.model;

import java.sql.Date;
import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Cloud_producttypeModel {

	private Integer productTypeId;
	private String productTypeName;
	private String summary;
	private Date releaseDate;
	private Integer alive;
	private Integer i_uid;
	private Timestamp i_time;
	private Integer u_uid;
	private Timestamp u_time;

}