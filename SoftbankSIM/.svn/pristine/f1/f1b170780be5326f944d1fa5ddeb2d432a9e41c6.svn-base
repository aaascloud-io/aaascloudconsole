package com.xiaour.spring.boot;

import org.mybatis.spring.annotation.MapperScan;
import org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.boot.web.support.SpringBootServletInitializer;

/**
 *
 * @ClassName Application
 * @author Fengwei.jiang
 * @Date   2019年03月18日
 * @version V1.0.0
 */

@SpringBootApplication(exclude = MybatisAutoConfiguration.class)
@ServletComponentScan
@EnableAutoConfiguration
@MapperScan("com.xiaour.spring.boot.mapper")
//@ComponentScan("com.xiaour.spring.boot.dto")
//@ComponentScan("com.xiaour.spring.boot.controller")
//@ComponentScan("com.xiaour.spring.boot.service")
//@ComponentScan({"com.xiaour.spring.boot.controller","com.xiaour.spring.boot.dto","com.xiaour.spring.boot.service"})
public class Application  extends SpringBootServletInitializer implements EmbeddedServletContainerCustomizer {

	@Value("${server.port}")
	private int port;
	/**
	 * Start entrance
	 * @param args
	 */
    public static void main(String ... args){
        SpringApplication.run(Application.class, args);
    }

    /**
     * Custom port
     */
	@Override
	public void customize(ConfigurableEmbeddedServletContainer container) {
		container.setPort(port);
	}

}
