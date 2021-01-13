package jp.co.ifocus.commons.model;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import jp.co.ifocus.commons.model.parent.DeviceManagementObject;

public abstract class AbstractDeviceManagementObjectImpl implements DeviceManagementObject{
	
	@Override
	public void setUid(String uid) {
		// 使わない
	}

	@Override
	public String getUid() {
		return null; // 使わない
	}

	@Override
	public void setImei(String imei) {
		// 使わない
	}

	@Override
	public String getImei() {
		return null; // 使わない
	}

	@Override
	public Map<String, Object> toMap() {
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		JsonObject jsonObject = new Gson().toJsonTree(this).getAsJsonObject();
		Set<Entry<String,JsonElement>> entrySet = jsonObject.entrySet();
		for (Entry<String, JsonElement> entry : entrySet) {
			String fieldName = entry.getKey();
			JsonElement value = entry.getValue();
			if (value.isJsonPrimitive()) {
				map.put(fieldName, value.getAsString());
			}
		}
		return map;
	}

	@Override
	public Map<String, Object> toQueryFilters() {
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		JsonObject jsonObject = new Gson().toJsonTree(this).getAsJsonObject();
		Set<Entry<String,JsonElement>> entrySet = jsonObject.entrySet();
		for (Entry<String, JsonElement> entry : entrySet) {
			String fieldName = entry.getKey();
			JsonElement value = entry.getValue();
			if (value.isJsonPrimitive() && !value.isJsonNull()) {
				map.put(fieldName, value.getAsString());
			}
		}
		return map;
	}

	@Override
	public Map<String, Object> toSortFields() {
		return new HashMap<>();
	}

}
