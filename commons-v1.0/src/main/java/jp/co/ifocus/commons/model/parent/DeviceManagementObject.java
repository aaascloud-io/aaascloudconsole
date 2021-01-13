package jp.co.ifocus.commons.model.parent;

import java.util.Map;

public interface DeviceManagementObject {

	public void setUid(String uid);

	public String getUid();

	public void setImei(String imei);

	public String getImei();

	public Map<String, Object> toMap();

	public Map<String, Object> toQueryFilters();

	public Map<String, Object> toSortFields();
}
