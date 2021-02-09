package com.ifocus.aaascloud.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Component
public class KeycloakConfig {
	
	@Getter
	@Setter
	@Value("${keycloak.admin.auth-server-url}")
	private String authServerUrl;
	
	@Getter
	@Setter
	@Value("${keycloak.admin.realm}")
	private String adminRealmName;

	@Getter
	@Setter
	@Value("${keycloak.admin.client_id}")
	private String adminClientId;
	
	@Getter
	@Setter
	@Value("${keycloak.admin.username}")
	private String adminUsername;
	
	@Getter
	@Setter
	@Value("${keycloak.admin.password}")
	private String adminPassword;
	
	@Getter
	@Setter
	@Value("${keycloak.auth.realm}")
	private String authRealm;
	
	@Getter
	@Setter
	@Value("${keycloak.auth.client_id}")
	private String authClientId;

}
