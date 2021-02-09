package com.ifocus.aaascloud.model;

import java.util.ArrayList;
import java.util.List;

import com.ifocus.aaascloud.constant.AliveConstant;

import lombok.Getter;
import lombok.Setter;

public class Cloud_projectDetailModel {

	@Getter
	@Setter
	private LoginInfo loginInfo;
	@Getter
	@Setter
	private TargetUserInfo targetUserInfo;
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
	private String productname;
	@Getter
	@Setter
	private String projectsummary;
	@Getter
	@Setter
	private Integer alive;
	@Getter
	@Setter
	private Integer groupCounts;
	@Getter
	@Setter
	private Integer deviceCounts;
	@Getter
	@Setter
	private List<Cloud_groupModel> groupList;
	@Getter
	@Setter
	private List<Cloud_deviceModel> deviceList;

	/**
	 *  新規グループリスト
	 */
	public List<Cloud_groupModel> getRegisterGroupList() {
		List<Cloud_groupModel> returnList = new ArrayList<Cloud_groupModel>();
		if (this.getGroupList() != null && !this.getGroupList().isEmpty() ) {
			this.getGroupList().forEach(model->{
				if (model.getGroupid() == null) {
					returnList.add(model);
				}
			});
		}
		return returnList;
	}

	/**
	 *  更新グループリスト
	 */
	public List<Cloud_groupModel> getUpdateGroupList() {
		List<Cloud_groupModel> returnList = new ArrayList<Cloud_groupModel>();
		if (this.getGroupList() != null && !this.getGroupList().isEmpty()) {
			this.getGroupList().forEach(model->{
				if (model.getGroupid() != null && model.getAlive() == AliveConstant.ALIVE) {
					returnList.add(model);
				}
			});
		}
		return returnList;
	}

	/**
	 *  削除グループリスト
	 */
	public List<Cloud_groupModel> getDeleteGroupList() {
		List<Cloud_groupModel> returnList = new ArrayList<Cloud_groupModel>();
		if (this.getGroupList() != null && !this.getGroupList().isEmpty()) {
			this.getGroupList().forEach(model->{
				if (model.getGroupid() != null && model.getAlive() == AliveConstant.NOT_ALIVE) {
					returnList.add(model);
				}
			});
		}
		return returnList;
	}

}
