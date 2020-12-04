package com.ifocus.aaascloud.api.common.constant;

/**
 * redisのキーを定義する
 *
 * @author jiang
 *
 */
public class RedisCommons {

	// redis中にtoken保存期間
    public final static int REDISTOKENTIME = 20;

	// redis中にtoken保存期間
    public final static String REDIS_LOGINCHECK_TOKENKEY ="tk";

	// redis中にuser関係情報key
    public final static String REDIS_KEY_USER_RELATION ="ur";

	// redis中にキー区分_devices
    public final static String REDIS_KEY_DEVICES ="ds";

	// redis中にキー区分_deviceINfo_timeFrom
    public final static String REDIS_KEY_DEVICEINFO_TIMEFORM ="dstf";

	// redis中にキー区分_deviceINfo_timeTo
    public final static String REDIS_KEY_DEVICEINFO_TIMETO ="dstt";

}
