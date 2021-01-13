package jp.co.ifocus.commons.model.parent;

import java.util.Map;

public abstract class DeviceResourceObject {

	public abstract void setImei(String imei);

	public abstract String getImei();

	public abstract Map<String, Object> toMap();

	public abstract Map<String, Object> toQueryFilters();
}
