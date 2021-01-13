package jp.co.ifocus.commons.service;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.Set;

import org.reflections.Reflections;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jp.co.ifocus.commons.annotation.AutoInitInstance;
import jp.co.ifocus.commons.log.MessageIdConstants;

/**
 * 主動インスタンス生成
 * @author tang.misi
 *
 */
public class InitService {
	
	private static final String INSTANCE_FIELD_NAME = "INSTANCE";
	private final static Logger LOG = LoggerFactory.getLogger(InitService.class);
	
	public static void init(String...packagesToScan) {
		for (String packageToScan : packagesToScan) {
			try {
				Reflections reflections = new Reflections(packageToScan);
				Set<Class<?>> targeClasses = reflections.getTypesAnnotatedWith(AutoInitInstance.class);
				for (Class<?> targetClass : targeClasses) {
					if (targetClass.isInterface() || Modifier.isAbstract(targetClass.getModifiers())) {
						continue; // IF&抽象的クラスは初期化しない
					}
					// INSTANCEありの場合、INSTANCE取得で済む
					try {
						Field instanceField = targetClass.getDeclaredField(INSTANCE_FIELD_NAME);
						instanceField.setAccessible(true);
						Object object = instanceField.get(null);
						instanceField.setAccessible(false);
						LOG.debug("Auto init instance of class: " + object.getClass().getCanonicalName());
						continue;
					} catch (NoSuchFieldException e) {
					}
					// NSTANCEなしの場合、newで生成
					try {
						Constructor<?> constructor = targetClass.getDeclaredConstructor();
						constructor.setAccessible(true);
						Object instance = constructor.newInstance();
						LOG.debug("Auto init instance of class: " + instance.getClass().getCanonicalName());
					} catch (InstantiationException e) {
						LOG.error(MessageIdConstants.E17041, targetClass.getTypeName(), e);
					}
				}
			} catch (Exception e) {
				LOG.error(MessageIdConstants.E17045, packageToScan, e);
			}
		}
	}

}
