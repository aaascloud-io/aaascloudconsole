package jp.co.ifocus.commons.service;

import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jp.co.ifocus.commons.config.ServerConfig;
import jp.co.ifocus.commons.config.ServerConfig.Keys;
import jp.co.ifocus.commons.log.MessageIdConstants;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.Transaction;

public class RedisService {

	private final Logger LOG = LoggerFactory.getLogger(RedisService.class);

	public static RedisService INSTANCE = new RedisService();

	protected JedisPool jedisPool = null;

	protected RedisService() {
		try {
			ServerConfig serverConfig = ServerConfig.getDefualt();
			JedisPoolConfig jedisPoolConfig = new JedisPoolConfig();
			jedisPoolConfig.setTestOnBorrow(true);
			jedisPoolConfig.setBlockWhenExhausted(true);
			jedisPoolConfig.setMaxWaitMillis(30 * 1000);
			jedisPoolConfig.setMinEvictableIdleTimeMillis(30 * 60 * 1000);
			jedisPoolConfig.setTimeBetweenEvictionRunsMillis(30 * 60 * 1000);
			jedisPoolConfig.setEvictionPolicyClassName("org.apache.commons.pool2.impl.DefaultEvictionPolicy");
			String password = serverConfig.getString(Keys.REDIS_CONNECTION_PASSWORD);
			String username = serverConfig.getString(Keys.REDIS_CONNECTION_USERNAME);
			if (!StringUtils.isEmpty(password)) {
				if (!StringUtils.isEmpty(username)) {
					this.jedisPool = new JedisPool(jedisPoolConfig, 
							serverConfig.getString(Keys.REDIS_ADDRESS_HOST),
							serverConfig.getInt(Keys.REDIS_ADDRESS_PORT),
							serverConfig.getInt(Keys.REDIS_CONNECTION_TIMEOUT_IN_MILISECOND),
							username, password);
				}else {
					this.jedisPool = new JedisPool(jedisPoolConfig,
							serverConfig.getString(Keys.REDIS_ADDRESS_HOST),
							serverConfig.getInt(Keys.REDIS_ADDRESS_PORT),
							serverConfig.getInt(Keys.REDIS_CONNECTION_TIMEOUT_IN_MILISECOND),
							serverConfig.getString(Keys.REDIS_CONNECTION_PASSWORD));
				}
			}else {
				this.jedisPool = new JedisPool(jedisPoolConfig,
						serverConfig.getString(Keys.REDIS_ADDRESS_HOST),
						serverConfig.getInt(Keys.REDIS_ADDRESS_PORT),
						serverConfig.getInt(Keys.REDIS_CONNECTION_TIMEOUT_IN_MILISECOND));
			}
			// 接続テスト
			Jedis testResource = this.jedisPool.getResource();
			if(testResource.isConnected()) {
				testResource.close();
			}
		} catch (Exception e) {
			// 接続失敗
			redisIsNotConnected(e);
		}
	}
	
	private Jedis getClientFromPool() {
		if (isRedisConnected()) {
			try {
				return this.jedisPool.getResource();
			} catch (Exception e) {
				redisIsNotConnected(e);
			}
		}
		return null;
	}

	public String get(String redisKey) {
		Jedis client = getClientFromPool();
		if (client == null) {
			return null;
		}
		if (client.isConnected()) {
			try {
				String json = client.get(redisKey);
				LOG.debug("data of {key: " + redisKey + "} is fetched from redis.");
				return json;
			} catch (Exception e) {
				LOG.error(MessageIdConstants.E00042, redisKey, e);
				return null;
			} finally {
				client.close();
			}
		}else {
			redisIsNotConnected();
		}
		return null;
	}

	public List<String> getList(String redisKey) {
		Jedis client = getClientFromPool();
		if (client == null) {
			return null;
		}
		if (client.isConnected()) {
			try {
				Long length = client.llen(redisKey);
				List<String> list = client.lrange(redisKey, 0, length);
				LOG.debug("data of {key: " + redisKey + "} is fetched from redis.");
				return list;
			} catch (Exception e) {
				LOG.error(MessageIdConstants.E00042, redisKey, e);
				return null;
			} finally {
				client.close();
			}
		}else {
			redisIsNotConnected();
		}
		return null;
	}

	public long listLenth(String redisKey) {
		Jedis client = getClientFromPool();
		if (client == null) {
			return 0;
		}
		if (client.isConnected()) {
			try {
				return client.llen(redisKey);
			} catch (Exception e) {
				LOG.error(MessageIdConstants.E00042, redisKey, e);
				return 0;
			} finally {
				client.close();
			}
		}else {
			redisIsNotConnected();
		}
		return 0;
	}

	public boolean save(String redisKey, String json) {
		synchronized (this) {
			Jedis client = getClientFromPool();
			if (client == null) {
				return false;
			}
			if (client.isConnected()) {
				try {
					client.set(redisKey, json);
					LOG.debug("data of {key: " + redisKey + "} save to redis successfully.");
					return true;
				} catch (Exception e) {
					LOG.error(MessageIdConstants.E00043, redisKey, json, e);
					return false;
				} finally {
					client.close();
				}
			}else {
				redisIsNotConnected();
			}
		}
		return false;
	}

	public boolean save(String redisKey, List<String> jsons) {
		synchronized (this) {

			Jedis client = getClientFromPool();
			if (client == null) {
				return false;
			}
			if (client.isConnected()) {
				try {
					client.watch(redisKey);
					Transaction transaction = client.multi();
					transaction.del(redisKey);
					transaction.rpush(redisKey, jsons.toArray(new String[jsons.size()]));
					List<Object> responses = transaction.exec();
					if (responses != null && responses.size() == 2) {
						LOG.debug("data list of {key: " + redisKey + "} save to redis successfully.");
						return true;
					}else {
						LOG.error(MessageIdConstants.E00043, redisKey, jsons);
						return false;
					}
				} catch (Exception e) {
					LOG.error(MessageIdConstants.E00043, redisKey, jsons, e);
					return false;
				} finally {
					client.close();
				}
			}else {
				redisIsNotConnected();
			}
		}
		return false;
	}

	public boolean pushToList(String redisKey, String json) {
		synchronized (this) {

			Jedis client = getClientFromPool();
			if (client == null) {
				return false;
			}
			if (client.isConnected()) {
				try {
					client.rpush(redisKey, json);
					client.set(redisKey, json);
					LOG.debug("data of {key: " + redisKey + "} save to redis successfully.");
					return true;
				} catch (Exception e) {
					LOG.error(MessageIdConstants.E00043, redisKey, json, e);
					return false;
				} finally {
					client.close();
				}
			}else {
				redisIsNotConnected();
			}
		}
		return false;
	}

	public boolean remove(String redisKey) {
		synchronized (this) {
			Jedis client = getClientFromPool();
			if (client == null) {
				return false;
			}
			if (client.isConnected()) {
				client.del(redisKey);
				LOG.debug("data of {key: " + redisKey + "} remove to redis successfully.");
				client.close();
				return true;
			}else {
				redisIsNotConnected();
			}
		}
		return false;
	}

	public Set<String> getKeys(String pattern){
		Jedis client = getClientFromPool();
		if (client == null) {
			return null;
		}
		Set<String> keys = client.keys(pattern);
		client.close();
		return keys;
	}
	
	private void redisIsNotConnected(Exception e) {
		jedisPool = null;
		if (e == null) {
			LOG.error(MessageIdConstants.E00044);
		}else {
			LOG.error(MessageIdConstants.E00044, e);
		}
	}
	
	private void redisIsNotConnected() {
		redisIsNotConnected(null);
	}
	
	public boolean isRedisConnected() {
		return this.jedisPool != null;
	}

}
