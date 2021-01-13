package jp.co.ifocus.commons.log;

import java.lang.reflect.Field;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class MessageIdConstants {
	
	public static final Map<String, String> meesageIdsMap = Collections.synchronizedMap(new HashMap<>());
	
	static {
		Field[] declaredFields = MessageIdConstants.class.getDeclaredFields();
		for (Field field : declaredFields) {
			String name = field.getName();
			try {
				Object object = field.get(null);
				if (object instanceof String) {
					String value = (String) object;
					meesageIdsMap.put(value, name);
				}
			} catch (IllegalArgumentException | IllegalAccessException e) {
				throw new RuntimeException(e);
			}
		}
	}
	
	public static final String E00003 = "User not match for device(imei={}). Expect uid={} but is uid={}.";
	
	public static final String E00022 = "Fail to process exchange, because executor is null.";
	
	public static final String E00037 = "Exception while json parsing to pojo, json={}, type={}.";

	public static final String E00038 = "Exception while writing pojo to json, pojo={}.";

	public static final String E00042 = "Exception occur when reading key={} from redis.";

	public static final String E00043 = "Exception occur when writing key={}, value={} to redis.";

	public static final String E00044 = "Redis connection fail.";

	public static final String E00051 = "Exception while writing document={} to mongoDB.";

	public static final String E00052 = "Exception while removing document={} to mongoDB, collection={}";
	
	public static final String E00068 = "Device config queue service for class={} is not found.";
	
	public static final String E00080 = "Exception occurs while finding query={}, sort={} from mongoDB.";
	
	public static final String E01027 = "Cannot write properties to file={}.";
	
	public static final String E17041 = "Fail to create instance of class={} while executing auto initialization.";
	
	public static final String E17045 = "Fail to do class active load on path={}";
	
	public static final String E01050 = "Fail to build dtls config.";
	
	public static final String E01059 = "Bootstrap server shutdown because unexpected exception occurs.";

	public static final String E01063 = "LwM2M server shutdown because unexpected exception occurs.";

	public static final String E01074 = "Web server shutdown because unexpected exception occurs.";

	public static final String E02038 = "Device(imei={}) bootstrap fail, since bootstrap response error. Response content: {}.";

	public static final String E05020 = "IIJ udp send fail for device(imei={}). Findme fail.";

	public static final String E05054 = "Connection to IIJ API fail.";

	public static final String E05071 = "Device find operation fail, since device(imei={}) is not found on user(uid={})'s iij intranet.";
	
	public static final String E05075 = "IIJ sim control flag set fail for device(imei={}, deviceid={}).";

	public static final String E07060 = "Fail to handle alarm report for device(imei={}), because of device status data time parse error.";

	public static final String E08045 = "Exception occur when data tranfering, data transferer={}, content={}.";

	public static final String E08046 = "Exception occur while mqtt client connecting. ";

	public static final String E08047 = "Executor={} reject a runnable, currentPoolSize={}, runningSize={}, This runnable will be run by the caller.";

	public static final String E08048 = "Exception occur while mqtt client publishing, Retry for once and error again.";
	
	public static final String E08076 = "Fail to close mqttClient={}.";
	
	public static final String E08089 = "DataTransferer: {} execution timeout. Return: {}";
	
	public static final String E08090 = "DataTransferer: {} execution fail. Return: {}";

	public static final String E09014 = "LwM2M observation for device(imei={}) fail.";

	public static final String E10039 = "Exception occur while LwM2m notification data parsing.";

	public static final String E10045 = "Exception occur while LwM2m notification data handling.";

	public static final String E12015 = "Role={} creation fail.";

	public static final String E12016 = "Realm role: access_{} failed to initialize, may not be exists.";

	public static final String E12072 = "Servlet={} read fail. Uri={} is unavalible.";

	public static final String E13017 = "Exception while assigning server for device(imei={}).";

	public static final String E13034 = "Fail to get fota update target for currentVersion={}.";

	public static final String E13035 = "Fail to get fota latest version on timestamp={}.";

	public static final String E13041 = "Fail to initiate instance of class={}.";

	public static final String E13053 = "Fail to generate Psk for device(imei={}).";

	public static final String E13056 = "Exception occur while executing fota http request.";

	public static final String E14039 = "Exception occur while CoAP report data parsing.";
	
	public static final String E14045 = "Unexpect exception occur while handling CoAP request({}) on the {} resource.";

	public static final String E18001 = "Sim line operation fail, since device(imei={}, iccid={}) is not found on user(uid={})'s iij intranet.";
	
	public static final String E18045 = "Sim line operation fail, since unexpected error occurs on uid={}, imei={}.";
	
	public static final String E18078 = "Sim line operation fail, since no iij api key is found on user(uid={}).";
	
	public static final String E18079 = "Sim line operation fail, since IIJ API return error(code={}) on uid={}, imei={}, iccid={}.";
	
	public static final String E19078 = "Device find operation fail, since no iij api key is found on user(uid={}).";
	
	public static final String E19079 = "Device find operation fail, since IIJ API return error(code={}) on uid={}, imei={}.";
	
	public static final String E20045 = "Synchronize versions from fota server fail.";
	
	public static final String I00020 = "Receive GPS data, imei;iccid={}.";
	
	public static final String I00021 = "Gps data process finished({}ms), imei={}.";
	
	public static final String I01005 = "Bootstrap server started at {} {}.";
	
	public static final String I01006 = "Bootstrap server stopped.";

	public static final String I01012 = "LwM2M server started at {} {}.";
	
	public static final String I01013 = "LwM2M server stop.";

	public static final String I01014 = "Loading properties from file={}.";

	public static final String I01015 = "Writing properties to file={}.";

	public static final String I01017 = "Web server started at {}.";

	public static final String I02002 = "Device(imei={}) bootstrap request received. ";

	public static final String I02003 = "Device(imei={}) bootstrap success. ";

	public static final String I03001 = "Device(imei={}) registry success.";
	
	public static final String I04004 = "Device(imei={}) unregistry success.";
	
	public static final String I04022 = "Device(imei={}) config sent, payload: {}.";
	
	public static final String I04023 = "Device(imei={}) config is acknowledged, code={}, payload: {}.";
	
	public static final String I05032 = "Find for device(imei={}) start.";
	
	public static final String I05033 = "Find for device(imei={}) end, result={}.";
	
	public static final String I05034 = "Find for device(imei={}) send ping.";
	
	public static final String I05035 = "Find for device(imei={}) send udp.";
	
	public static final String I08019 = "Thread: {} created.";
	
	public static final String I08038 = "Mqtt client(publisher={}) close and remove from thread(name={}).";
	
	public static final String I08039 = "MQTT client(publishId={}) created.";

	public static final String I09001 = "LwM2M observation for device(imei={}) success.";
	
	public static final String I12011 = "Web Api authority initialization complete.";

	public static final String I12016 = "Role={} is not found, to be created.";
	
	public static final String I12024 = "Authentication init start.";
	
	public static final String I12025 = "Authentication init end.";
	
	public static final String I12026 = "Servlet read start.";
	
	public static final String I12027 = "Servlet read end.";
	
	public static final String I12028 = "Web Api authority initialization start.";
	
	public static final String I12029 = "Administrator authorities saved.";
	
	public static final String I12030 = "Default user authorities saved.";
	
	public static final String I13002 = "Received httpMethod={} request on url={}, uid={}.";
	
	public static final String I13003 = "Response finished for httpMethod={} request on url={}, uid={}, request paramters={}.";
	
	public static final String I13031 = "Parsed paramters for httpMethod={} request on url={}, uid={}, request paramters={}.";
	
	public static final String I14002 = "Receive coap post request on /{}, payload: {}.";
	
	public static final String I14003 = "Response coap post request on /{}, responseCode={}, responsePayload={}.";
	
	public static final String I18002 = "IIJ Line Operation Url: {} {} request success, return status code: {}.";
	
	public static final String I20032 = "Scheduled version diff synchronization start.";
	
	public static final String I20033 = "Scheduled version diff synchronization end.";
	
	public static final String I20036 = "Scheduled version diff synchronize executor created, thread_id={}.";
	
	public static final String I20037 = "Scheduled version diff synchronization already ongoing, wait for result.";
	
	public static final String W00016 = "Document={} exists, do nothing.";
	
	public static final String W00077 = "Add operation fail becuase paramater validation check fail. Model object content={}.";

	public static final String W01026 = "Cannot load properties from file={}.";

	public static final String W01028 = "Default implemented psk store by leshan framework is not found. ";

	public static final String W02001 = "Device bootstrap fail, since device(imei={}) is undefined. ";

	public static final String W02002 = "Device bootstrap fail, since device(imei={}) expect iccid={} but receive iccid={}.";

	public static final String W02006 = "Device bootstrap fail, since request parameter({}) of device(imei={}) not found. ";

	public static final String W02009 = "Device bootstrap fail, since device(imei={}) is not binded. ";

	public static final String W03002 = "Device registry fail, since device(imei={}) expect iccid={} but receive iccid={}.";

	public static final String W03009 = "Device registry fail, since device(imei={}) is not binded.";

	public static final String W04013 = "Device(imei={}) unregistry fail.";
	
	public static final String W04016 = "Ongoing config for imei={}, config={} exists, add operation fail.";

	public static final String W04023 = "Config CoAP request for device(imei={}) timeout.";

	public static final String W05069 = "Waiting for wakeup ack of device(imei={}) is interrupt.";

	public static final String W05070 = "No exists wakeup request for device(imei={}), do nothing.";

	public static final String W06018 = "Device status for device(imei={}) is not found.";

	public static final String W08048 = "Exception on publishing message, mqtt client will be reconnected.";
	
	public static final String W08061 = "Exception occur while mqtt client republishing. ";

	public static final String W11064 = "Fail to transform lat={}, lng={} to address.";

	public static final String W11065 = "Fail to transform cellid={}, lac={}, mcc={}, mnc={} to latlng.";

	public static final String W12029 = "No web resources has been found.";

	public static final String W12030 = "Default permission of web apis is empty.";

	public static final String W12031 = "Administrator permission of web apis is empty.";

	public static final String W12066 = "Exception occur when fetching permission by name={} from authority server.";

	public static final String W12067 = "Exception occur when fetching role by name={} from authority server.";

	public static final String W12073 = "Servlet={} has not extended BaseServlet, not load to jetty. ";

	public static final String W13007 = "Exception occur while parsing Http request paramter on uri={}.";

	public static final String W13032 = "No authenticator found for web server.";

	public static final String W13033 = "No error page found for web server.";

	public static final String W13045 = "Exception occur while handling Http request on uri={}.";

	public static final String W14011 = "Too many request is processing for device(imei={}).";

	public static final String W14012 = "CoAP report for device(imei={}) fail, because of no registry.";

	public static final String W15062 = "Dtls has failure, since PSK key not found for device(imei={}).";

	public static final String W16018 = "Properties value for key={} is empty, returning default value.";

	public static final String W16040 = "Properties value for key={} is not a {}, returning default value.";
	
	public static final String W20081 = "Fota server http connection fail(timeout/reset).";
	
	public static final String W22001 = "Device(imei={}) definition not found, add fail.";
	
	public static final String W22016 = "Device(imei={}) bind info exists, add fail.";
	
	public static final String W22088 = "Device(imei={}) definition info not match, add fail.";
	
}
