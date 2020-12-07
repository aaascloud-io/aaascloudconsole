package com.ifocus.aaascloud.model;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;

public class Cloud_productModel {

	@Getter
	@Setter
	private Integer productid;
	@Getter
	@Setter
	private String productcode;
	@Getter
	@Setter
	private String productname;
	@Getter
	@Setter
	private String model;
	@Getter
	@Setter
	private String version;
	@Getter
	@Setter
	private Integer simflag;
	@Getter
	@Setter
	private String summary;
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
