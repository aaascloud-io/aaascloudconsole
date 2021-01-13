package jp.co.ifocus.commons.config;


import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jp.co.ifocus.commons.annotation.AutoInitInstance;
import jp.co.ifocus.commons.log.MessageIdConstants;

@AutoInitInstance
public class ServerConfig {

	private static final Logger LOGGER = LoggerFactory.getLogger(ServerConfig.class);

	/** The default name for the configuration. */
	public static final String DEFAULT_FILE_NAME = "Server.properties";

	/** The default header for a configuration file. */
	public static final String DEFAULT_HEADER = "Ifocus lwm2m pf server Properties file";

	/** The standard configuration that is used if none is defined. */
	private static ServerConfig defaultConfig;

	/** The properties. */
	private Properties properties;

	/**
	 * Server configuration key names
	 */
	public class Keys {
		public static final String MONGO_CONNECTION_URL = "MONGO_CONNECTION_URL";
		public static final String REDIS_ADDRESS_HOST = "REDIS_ADDRESS_HOST";
		public static final String REDIS_ADDRESS_PORT = "REDIS_ADDRESS_PORT";
		public static final String REDIS_CONNECTION_TIMEOUT_IN_MILISECOND = "REDIS_CONNECTION_TIMEOUT_IN_MILISECOND";
		public static final String REDIS_CONNECTION_PASSWORD = "REDIS_CONNECTION_PASSWORD";
		public static final String REDIS_CONNECTION_USERNAME = "REDIS_CONNECTION_USERNAME";
		public static final String WEB_PORT = "WEB_PORT";
		public static final String COAP_UNSECURE_PORT = "COAP_UNSECURE_PORT";
		public static final String COAP_SECURE_PORT = "COAP_SECURE_PORT";
		public static final String BSSERVER_WEB_PORT = "BSSERVER_WEB_PORT";
		public static final String BSSERVER_COAP_UNSECURE_PORT = "BSSERVER_COAP_UNSECURE_PORT";
		public static final String BSSERVER_COAP_SECURE_PORT = "BSSERVER_COAP_SECURE_PORT";
		public static final String AUTH_REALM_NAME = "AUTH_REALM_NAME";
		public static final String AUTH_CLIENT_NAME = "AUTH_CLIENT_NAME";
		public static final String AUTH_CLIENT_SECRET = "AUTH_CLIENT_SECRET";
		public static final String AUTH_ROLE_NAME = "AUTH_ROLE_NAME";
		public static final String AUTH_SERVER_URL = "AUTH_SERVER_URL";
		public static final String AUTH_CORS_ALLOWED_HEADERS = "AUTH_CORS_ALLOWED_HEADERS";
		public static final String AUTH_CORS_ALLOWED_METHODS = "AUTH_CORS_ALLOWED_METHODS";
		public static final String AUTH_CORS_MAX_AGE = "AUTH_CORS_MAX_AGE";
		public static final String AUTH_CORS_EXPOSED_HEADERS = "AUTH_CORS_EXPOSED_HEADERS";
		public static final String IDLE_BEFORE_OFFLINE_IN_MINUTES = "IDLE_BEFORE_OFFLINE_IN_MINUTES";
		public static final String AUTH_ADMIN_USER_USERNAME = "AUTH_ADMIN_USER_USERNAME";
		public static final String AUTH_ADMIN_USER_PASSWORD = "AUTH_ADMIN_USER_PASSWORD";
		public static final String AUTH_ADMIN_CLIENT_NAME = "AUTH_ADMIN_CLIENT_NAME";
		public static final String AUTH_SSL_REQUIRED = "AUTH_SSL_REQUIRED";
		public static final String MQTT_BROKER_URI = "MQTT_BROKER_URI";
		public static final String MQTT_CONNECTION_QOS = "MQTT_CONNECTION_QOS";
		public static final String MQTT_CLIENT_POOL_SIZE = "MQTT_CLIENT_POOL_SIZE";
		public static final String MQTT_BROKER_CONNECTIONS_USERNAME = "MQTT_BROKER_CONNECTIONS_USERNAME";
		public static final String MQTT_BROKER_CONNECTIONS_PASSWORD = "MQTT_BROKER_CONNECTIONS_PASSWORD";
		public static final String IIJ_API_ACCESS_KEY = "IIJ_API_ACCESS_KEY";
		public static final String IIJ_API_SECRECT_KEY = "IIJ_API_SECRECT_KEY";
		public static final String IIJ_API_MASTER_CODE = "IIJ_API_MASTER_CODE";
		public static final String IIJ_API_LINE_SERVICE_CODE = "IIJ_API_LINE_SERVICE_CODE";
		public static final String IIJ_API_LINE_API_TOKEN = "IIJ_API_LINE_API_TOKEN";
		public static final String IIJ_API_IOT_SERVICE_CODE = "IIJ_API_IOT_SERVICE_CODE";	
		public static final String FOTA_SERVER_USERNAME = "FOTA_SERVER_USERNAME";
		public static final String FOTA_SERVER_PASSWORD = "FOTA_SERVER_PASSWORD";
		public static final String FOTA_SERVER_PRODUCT_ID = "FOTA_SERVER_PRODUCT_ID";
		public static final String FOTA_SERVER_TOKEN_FETCH_URL = "FOTA_SERVER_TOKEN_FETCH_URL";
		public static final String FOTA_SERVER_VERSION_LIST_URL = "FOTA_SERVER_VERSION_LIST_URL";
		public static final String FOTA_SERVER_VERSION_DELTA_LIST_URL = "FOTA_SERVER_VERSION_DELTA_LIST_URL";
		public static final String FOTA_SERVER_VERSION_DELTA_DETAIL_URL = "FOTA_SERVER_VERSION_DELTA_DETAIL_URL";
		public static final String GOOGLE_MAP_API_KEY = "GOOGLE_MAP_API_KEY";
		public static final String GOOGLE_MAP_API_IN_USE = "GOOGLE_MAP_API_IN_USE";
	}

	public ServerConfig() {
		this.properties = new Properties();
		this.setString(Keys.MONGO_CONNECTION_URL, "mongodb://root:Zaq12wsxcde3%23@dds-e9b60f24cbc0fae41.mongodb.japan.rds.aliyuncs.com:3717,dds-e9b60f24cbc0fae42.mongodb.japan.rds.aliyuncs.com:3717/iotPFdb?authSource=admin&replicaSet=mgset-350406625");
		this.setString(Keys.REDIS_ADDRESS_HOST, "trackerredis.redis.japan.rds.aliyuncs.com");
		this.setInt(Keys.REDIS_ADDRESS_PORT, 6379);
		this.setInt(Keys.REDIS_CONNECTION_TIMEOUT_IN_MILISECOND, 30 * 1000);
		this.setString(Keys.REDIS_CONNECTION_PASSWORD, "cde34rfvWZ%");
		this.setString(Keys.REDIS_CONNECTION_USERNAME, "");
		this.setInt(Keys.WEB_PORT, 8080);
		this.setInt(Keys.COAP_UNSECURE_PORT, 5683);
		this.setInt(Keys.COAP_SECURE_PORT, 5684);
		this.setInt(Keys.BSSERVER_WEB_PORT, 8081);
		this.setInt(Keys.BSSERVER_COAP_UNSECURE_PORT, 5685);
		this.setInt(Keys.BSSERVER_COAP_SECURE_PORT, 5686);
		this.setString(Keys.AUTH_REALM_NAME, "trackun");
		this.setString(Keys.AUTH_CLIENT_NAME, "trackun");
		this.setString(Keys.AUTH_CLIENT_SECRET, "");
		this.setString(Keys.AUTH_ROLE_NAME, "uma_authorization");
		this.setString(Keys.AUTH_SERVER_URL, "https://auth.aaascloud.io/auth");
		this.setString(Keys.AUTH_CORS_ALLOWED_HEADERS, "*");
		this.setString(Keys.AUTH_CORS_ALLOWED_METHODS, "*");
		this.setInt(Keys.AUTH_CORS_MAX_AGE, 86400);
		this.setString(Keys.AUTH_CORS_EXPOSED_HEADERS, "*");
		this.setString(Keys.AUTH_SSL_REQUIRED, "EXTERNAL");
		this.setInt(Keys.IDLE_BEFORE_OFFLINE_IN_MINUTES, 60);
		this.setString(Keys.AUTH_ADMIN_USER_USERNAME, "ifocus");
		this.setString(Keys.AUTH_ADMIN_USER_PASSWORD, "cde34rfvWZ%");
		this.setString(Keys.AUTH_ADMIN_CLIENT_NAME, "admin-cli");
		this.setString(Keys.MQTT_BROKER_URI, "tcp://47.91.10.28:1883");
		this.setInt(Keys.MQTT_CONNECTION_QOS, 2);
		this.setInt(Keys.MQTT_CLIENT_POOL_SIZE, 10);
		this.setString(Keys.MQTT_BROKER_CONNECTIONS_USERNAME, "mqttuser");
		this.setString(Keys.MQTT_BROKER_CONNECTIONS_PASSWORD, "cde34rfv");
		this.setString(Keys.IIJ_API_ACCESS_KEY, "JHVMWW8PUBOHEDYCRBZ4");
		this.setString(Keys.IIJ_API_SECRECT_KEY, "zU0ZApA+AlReSDVLSXC6rzVJdmLRJVOS43YM87Xf");
		this.setString(Keys.IIJ_API_MASTER_CODE, "SA9399176");
		this.setString(Keys.IIJ_API_LINE_SERVICE_CODE, "kiw89228588");
		this.setString(Keys.IIJ_API_LINE_API_TOKEN, "ffe992e9-56cc-42af-bcd6-23a11ea427ec");
		this.setString(Keys.IIJ_API_IOT_SERVICE_CODE, "iot89228595");
		this.setString(Keys.GOOGLE_MAP_API_KEY, "AIzaSyCAbdPbKHzmq3_0QzDF7lCB0epBhcz3aNE");
		this.setBoolean(Keys.GOOGLE_MAP_API_IN_USE, false);
	}

	public static ServerConfig getDefualt() {
		synchronized (ServerConfig.class) {
			if (defaultConfig == null)
				createStandardWithFile(new File(DEFAULT_FILE_NAME));
		}
		return defaultConfig;
	}

	public static ServerConfig createStandardWithFile(final File file) {
		defaultConfig = createWithFile(file, DEFAULT_HEADER);
		return defaultConfig;
	}

	public static ServerConfig createWithFile(final File file, final String header) {
		ServerConfig defaultConfig = new ServerConfig();
		if (file.exists()) {
			defaultConfig.load(file);
		} else {
			defaultConfig.store(file, header);
		}
		return defaultConfig;
	}

	public void load(final File file) {
		if (file == null) {
			throw new NullPointerException("file must not be null");
		} else {
			LOGGER.info(MessageIdConstants.I01014, file.getAbsolutePath());
			try (InputStream inStream = new FileInputStream(file)) {
				load(inStream);
			} catch (IOException e) {
				LOGGER.warn(MessageIdConstants.W01026, file.getAbsolutePath(), e);
			}
		}
	}

	/**
	 * Loads properties from a input stream.
	 *
	 * @param inStream the input stream
	 * @throws NullPointerException if the inStream is {@code null}.
	 */
	public void load(final InputStream inStream) throws IOException {
		if (inStream == null) {
			throw new NullPointerException("input stream must not be null");
		}
		properties.load(inStream);
	}

	/**
	 * Stores the configuration to a file using a given header.
	 *
	 * @param file The file to write to.
	 * @param header The header to write to the top of the file.
	 * @throws NullPointerException if the file is {@code null}.
	 */
	public void store(File file, String header) {
		if (file == null) {
			throw new NullPointerException("file must not be null");
		} else {
			LOGGER.info(MessageIdConstants.I01015, file.getAbsolutePath());
			try (FileWriter writer = new FileWriter(file)) {
				properties.store(writer, header);
			} catch (IOException e) {
				LOGGER.error(MessageIdConstants.E01027, file.getAbsolutePath(), e);
			}
		}
	}

	/**
	 * Gets the string value for a key.
	 *
	 * @param key the key to look up.
	 * @return the value or {@code null} if this configuration does not contain
	 *         the given key.
	 */
	public String getString(final String key) {
		return properties.getProperty(key);
	}

	/**
	 * Gets the string value for a key.
	 *
	 * @param key the key the key to look up.
	 * @param defaultValue the default value.
	 * @return the value for the key if this configuration contains a value for
	 *         the key, otherwise the default value.
	 */
	public String getString(final String key, final String defaultValue) {
		String result = properties.getProperty(key);
		return result != null ? result : defaultValue;
	}

	/**
	 * Gets the Integer value for a key.
	 *
	 * @param key the key to look up.
	 * @return the value for the key, or {@code null}, if this configuration
	 *         does not contain a value for the given key or the value is not an
	 *         integer (e.g. {@code ""}.
	 */
	public Integer getOptInteger(final String key) {
		return getNumberValue(new PropertyParser<Integer>() {

			@Override
			public Integer parseValue(String value) {
				return Integer.parseInt(value);
			}
		}, key, null);
	}

	/**
	 * Gets the Long value for a key.
	 *
	 * @param key the key to look up.
	 * @return the value for the key, or {@code null}, if this configuration
	 *         does not contain a value for the given key or the value is not an
	 *         long (e.g. {@code ""}.
	 */
	public Long getOptLong(final String key) {
		return getNumberValue(new PropertyParser<Long>() {

			@Override
			public Long parseValue(String value) {
				return Long.parseLong(value);
			}
		}, key, null);
	}

	/**
	 * Gets the integer value for a key.
	 *
	 * @param key the key to look up.
	 * @return the value for the key or {@code 0} if this configuration does not
	 *         contain a value for the given key or the value is not an integer.
	 */
	public int getInt(final String key) {
		return getInt(key, 0);
	}

	/**
	 * Gets the integer value for a key.
	 *
	 * @param key the key to look up.
	 * @param defaultValue the default value to return if there is no value
	 *            registered for the key.
	 * @return the value for the key if this configuration contains a value for
	 *         the key and the value is an integer, otherwise the default value.
	 */
	public int getInt(final String key, final int defaultValue) {
		return getNumberValue(new PropertyParser<Integer>() {

			@Override
			public Integer parseValue(String value) {
				return Integer.parseInt(value);
			}
		}, key, defaultValue);
	}

	/**
	 * Gets the long value for a key.
	 *
	 * @param key the key to look up.
	 * @return the value for the key or {@code 0} if this configuration does not
	 *         contain a value for the given key or the value is not a long.
	 */
	public long getLong(final String key) {
		return getLong(key, 0L);
	}

	/**
	 * Gets the long value for a key.
	 *
	 * @param key the key to look up.
	 * @param defaultValue the default value to return if there is no value
	 *            registered for the key.
	 * @return the value for the key if this configuration contains a value for
	 *         the key and the value is a long, otherwise the default value.
	 */
	public long getLong(final String key, final long defaultValue) {
		return getNumberValue(new PropertyParser<Long>() {

			@Override
			public Long parseValue(String value) {
				return Long.parseLong(value);
			}
		}, key, defaultValue);
	}

	/**
	 * Gets the float value for a key.
	 *
	 * @param key the key to look up.
	 * @return the value for the key or {@code 0.0} if this configuration does
	 *         not contain a value for the given key or the value is not a
	 *         float.
	 */
	public float getFloat(final String key) {
		return getFloat(key, 0.0F);
	}

	/**
	 * Gets the float value for a key.
	 *
	 * @param key the key to look up.
	 * @param defaultValue the default value to return if there is no value
	 *            registered for the key.
	 * @return the value for the key if this configuration contains a value for
	 *         the key and the value is a float, otherwise the default value.
	 */
	public float getFloat(final String key, final float defaultValue) {
		return getNumberValue(new PropertyParser<Float>() {

			@Override
			public Float parseValue(String value) {
				return Float.parseFloat(value);
			}
		}, key, defaultValue);
	}

	/**
	 * Gets the double value for a key.
	 *
	 * @param key the key to look up.
	 * @return the value for the key or {@code 0.0} if this configuration does
	 *         not contain a value for the given key or the value is not a
	 *         double.
	 */
	public double getDouble(final String key) {
		return getDouble(key, 0.0D);
	}

	/**
	 * Gets the double value for a key.
	 *
	 * @param key the key to look up.
	 * @param defaultValue the default value to return if there is no value
	 *            registered for the key.
	 * @return the value for the key if this configuration contains the key and
	 *         the value is an double, otherwise the default value.
	 */
	public double getDouble(final String key, final double defaultValue) {
		return getNumberValue(new PropertyParser<Double>() {

			@Override
			public Double parseValue(String value) {
				return Double.parseDouble(value);
			}
		}, key, defaultValue);
	}

	private <T> T getNumberValue(final PropertyParser<T> parser, final String key, final T defaultValue) {
		T result = defaultValue;
		String value = properties.getProperty(key);
		if (value != null && !value.isEmpty()) {
			try {
				result = parser.parseValue(value);
			} catch (NumberFormatException e) {
				LOGGER.warn(MessageIdConstants.W16040, key, defaultValue.getClass());
			}
		}else {
			LOGGER.warn(MessageIdConstants.W16018, key);
		}
		return result;
	}

	/**
	 * Gets the value for the specified key as boolean or the provided default value if not found.
	 *
	 * @param key the key
	 * @param defaultValue the default value to return if there is no value
	 *            registered for the key.
	 * @return the boolean
	 */
	public boolean getBoolean(final String key, final boolean defaultValue) {
		String value = properties.getProperty(key);
		if (value != null) {
			return Boolean.parseBoolean(value);
		} else {
			LOGGER.warn(MessageIdConstants.W16018, key);
			return defaultValue;
		}
	}

	/**
	 * Gets the value for the specified key as boolean or false if not found.
	 *
	 * @param key the key
	 * @return the boolean
	 */
	public boolean getBoolean(String key) {
		String value = properties.getProperty(key);
		if (value != null) {
			return Boolean.parseBoolean(value);
		} else {
			LOGGER.warn(MessageIdConstants.W16018, key);
			return false;
		}
	}

	private interface PropertyParser<T> {

		T parseValue(String value);
	}

	/**
	 * Associates the specified value with the specified key.
	 *
	 * @param key the key
	 * @param value the value
	 * @return the network configuration
	 */
	public ServerConfig set(String key, Object value) {
		if (key == null) {
			throw new NullPointerException("key must not be null");
		} else if (value == null) {
			throw new NullPointerException("value must not be null");
		} else {
			properties.put(key, String.valueOf(value));
			return this;
		}
	}

	/**
	 * Associates the specified value with the specified key.
	 *
	 * @param key the key
	 * @param value the value
	 * @return the network configuration
	 */
	public ServerConfig setString(String key, String value) {
		return set(key, value);
	}

	/**
	 * Associates the specified value with the specified key.
	 *
	 * @param key the key
	 * @param value the value
	 * @return the network configuration
	 */
	public ServerConfig setInt(String key, int value) {
		return set(key, String.valueOf(value));
	}

	/**
	 * Associates the specified value with the specified key.
	 *
	 * @param key the key
	 * @param value the value
	 * @return the network configuration
	 */
	public ServerConfig setLong(String key, long value) {
		return set(key, String.valueOf(value));
	}

	/**
	 * Associates the specified value with the specified key.
	 *
	 * @param key the key
	 * @param value the value
	 * @return the network configuration
	 */
	public ServerConfig setFloat(String key, float value) {
		return set(key, String.valueOf(value));
	}

	/**
	 * Associates the specified value with the specified key.
	 *
	 * @param key the key
	 * @param value the value
	 * @return the network configuration
	 */
	public ServerConfig setDouble(String key, double value) {
		return set(key, String.valueOf(value));
	}

	/**
	 * Associates the specified value with the specified key.
	 *
	 * @param key the key
	 * @param value the value
	 * @return the network configuration
	 */
	public ServerConfig setBoolean(String key, boolean value) {
		return set(key, String.valueOf(value));
	}
}
