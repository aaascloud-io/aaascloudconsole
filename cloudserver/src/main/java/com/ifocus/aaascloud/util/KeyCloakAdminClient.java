package com.ifocus.aaascloud.util;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import javax.ws.rs.core.Response;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.AuthorizationResource;
import org.keycloak.admin.client.resource.PermissionsResource;
import org.keycloak.admin.client.resource.PoliciesResource;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.ResourcesResource;
import org.keycloak.admin.client.resource.RolesResource;
import org.keycloak.admin.client.resource.ScopePermissionResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.keycloak.representations.idm.UserSessionRepresentation;
import org.keycloak.representations.idm.authorization.DecisionStrategy;
import org.keycloak.representations.idm.authorization.ResourcePermissionRepresentation;
import org.keycloak.representations.idm.authorization.ResourceRepresentation;
import org.keycloak.representations.idm.authorization.ScopePermissionRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jp.co.ifocus.commons.config.ServerConfig;
import jp.co.ifocus.commons.config.ServerConfig.Keys;
import jp.co.ifocus.commons.log.MessageIdConstants;

/**
 * to avoid google-api-services http provider conflict,
 * use plain http instead of keycloakAdminClient library
 * @author misit
 *
 */
public class KeyCloakAdminClient {

	public static KeyCloakAdminClient INSTANCE = new KeyCloakAdminClient();

	private Logger LOG = LoggerFactory.getLogger(this.getClass());

	private static final String AUTH_ADMIN_REALM_NAME = "master";

	private Keycloak keyCloakInstance;
	private String clientId;

	private KeyCloakAdminClient() {
		newKeycloakInstance();
	}

	private void newKeycloakInstance() {
		this.keyCloakInstance =  Keycloak.getInstance(
				ServerConfig.getDefualt().getString(Keys.AUTH_SERVER_URL),
				AUTH_ADMIN_REALM_NAME,
				ServerConfig.getDefualt().getString(Keys.AUTH_ADMIN_USER_USERNAME),
				ServerConfig.getDefualt().getString(Keys.AUTH_ADMIN_USER_PASSWORD),
				ServerConfig.getDefualt().getString(Keys.AUTH_ADMIN_CLIENT_NAME));
		setClientId();
	}

	private void setClientId() {
		List<ClientRepresentation> clients = this.keyCloakInstance
				.realm(ServerConfig.getDefualt().getString(Keys.AUTH_REALM_NAME))
				.clients()
				.findByClientId(ServerConfig.getDefualt().getString(Keys.AUTH_CLIENT_NAME));
		if (clients == null || clients.size() == 0) {
			throw new RuntimeException("cannot find client id of Client: " + ServerConfig.getDefualt().getString(Keys.AUTH_CLIENT_NAME));
		}
		this.clientId = clients.get(0).getId();
	}

	public String handleResource(String resourceName) {
		String resourceId = getResourceByName(resourceName);
		if (resourceId != null) {
			return resourceId;
		}
		// new resource
		return createResource(resourceName);
	}

	public String handleRole(String roleName) {
		String roleId = getRoleByName(roleName);
		if (roleId != null) {
			return roleId;
		}
		// new role
		createRole(roleName);
		return getRoleByName(roleName);
	}

	public String getPermissionByName(String permissionName) {
		try {
			ResourcePermissionRepresentation permissionRepresentation = getAuthorizationResourceServiceProxy().permissions().resource().findByName(permissionName);
			if (permissionRepresentation != null) {
				return permissionRepresentation.getId();
			}else {
				ScopePermissionRepresentation scopePermissionRepresentation = getPermissionServiceProxy().scope().findByName(permissionName);
				if(scopePermissionRepresentation != null) {
					return scopePermissionRepresentation.getId();
				}
			}
		} catch (Exception e) {
			LOG.warn(MessageIdConstants.W12066, permissionName, e);
		}
		return null;
	}

	public String getResourceByName(String path) {
		try {
			List<ResourceRepresentation> list = getResourceServiceProxy().findByName(path);
			if (list.size() > 0) {
				return list.get(0).getId();
			}
		} catch (Exception e) {
			LOG.warn("exception when fetch resource: " + path + ", detail: " + e.getLocalizedMessage());
		}
		return null;
	}

	public String getRoleByName(String roleName) {
		try {
			List<RoleRepresentation> list = getClientRoleService().list();
			for (RoleRepresentation roleRepresentation : list) {
				if (StringUtils.equals(roleName, roleRepresentation.getName())) {
					return roleRepresentation.getId();
				}
			}
		} catch (Exception e) {
			LOG.warn(MessageIdConstants.W12067, roleName, e);
		}
		return null;
	}

	public void createRole(String roleName) {
		RoleRepresentation newRole = new RoleRepresentation();
		newRole.setName(roleName);
		getClientRoleService().create(newRole);
	}

	public String createPermission(String permissionName, String resourceId, String[] policyIds) {
		ResourcePermissionRepresentation newPermission = new ResourcePermissionRepresentation();
		newPermission.setDecisionStrategy(DecisionStrategy.AFFIRMATIVE);
		newPermission.setName(permissionName);
		HashSet<String> resources = new HashSet<String>();
		resources.add(resourceId);
		newPermission.setResources(resources);
		HashSet<String> policies = new HashSet<String>(Arrays.asList(policyIds));
		newPermission.setPolicies(policies);
		Response response = getPermissionServiceProxy().resource().create(newPermission);
		if (response.getStatus() > 299) {
			throw new RuntimeException("fail to create permission: " + permissionName);
		}
		return getPermissionByName(permissionName);
	}

	public void updatePermission(String permissionName, String resourceId, String[] policyIds) {
		String permissionId = getPermissionByName(permissionName);
		ScopePermissionResource permissionResource = getPermissionServiceProxy().scope().findById(permissionId);
		ScopePermissionRepresentation update = permissionResource.toRepresentation();
		HashSet<String> resources = new HashSet<String>();
		resources.add(resourceId);
		update.setResources(resources);
		update.setPolicies(new HashSet<String>(Arrays.asList(policyIds)));
		permissionResource.update(update);
	}

	public String createResource(String resourceName) {
		ResourceRepresentation bewResourceRep = new ResourceRepresentation();
		bewResourceRep.setName(resourceName);
		bewResourceRep.setType(resourceName);
		bewResourceRep.setOwnerManagedAccess(true);
		HashSet<String> uris = new HashSet<String>();
		uris.add(resourceName);
		bewResourceRep.setUris(uris);
		Response response = getResourceServiceProxy().create(bewResourceRep);
		if (response.getStatus() > 299) {
			throw new RuntimeException("fail to create resource: " + resourceName);
		}
		return getResourceByName(resourceName);
	}

	public AuthorizationResource getAuthorizationResourceServiceProxy() {
		return getAuthorizationTargetRealmProxy()
			.clients()
			.get(this.clientId)
			.authorization();
	}

	public ResourcesResource getResourceServiceProxy() {
		return getAuthorizationResourceServiceProxy().resources();
	}

	public PoliciesResource getPolicyServiceProxy() {
		return getAuthorizationResourceServiceProxy().policies();
	}

	public RolesResource getRealmRoleServiceProxy() {
		return getAuthorizationTargetRealmProxy().roles();
	}

	public RealmResource getAuthorizationTargetRealmProxy() {
		return this.keyCloakInstance.realms().realm(ServerConfig.getDefualt().getString(Keys.AUTH_REALM_NAME));
	}

	public PermissionsResource getPermissionServiceProxy() {
		return getAuthorizationResourceServiceProxy().permissions();
	}

	public UsersResource getUsersServiceProxy() {
		return getAuthorizationTargetRealmProxy().users();
	}

	public UserRepresentation getUser(String userId) {
		return getUsersServiceProxy().get(userId).toRepresentation();
	}

	public RolesResource getClientRoleService() {
		return getAuthorizationTargetRealmProxy()
				.clients()
				.get(this.clientId).roles();
	}

	public String[] getRoleByUserId(String userId) {
		String[] roleIds = new String[] {};
		List<RoleRepresentation> roles = getUsersServiceProxy().get(userId).roles().realmLevel().listEffective();
		if (roles.size() > 0) {
			for (RoleRepresentation role : roles) {
				roleIds = (String[]) ArrayUtils.add(roleIds, role.getId());
			}
		}
		return roleIds;
	}

	public String handleRealmRole(String roleName) {
		try {
			String roleId = getRealmRoleIdByName(roleName);
			if (roleId != null) {
				return roleId;
			}
		} catch (Exception e) {}
		LOG.info(MessageIdConstants.I12016, roleName);
		getRealmRoleServiceProxy().create(new RoleRepresentation(roleName, "", false));
		try {
			 return getRealmRoleIdByName(roleName);
		} catch (Exception e) {
			LOG.error(MessageIdConstants.E12015, roleName, e);
			throw e;
		}
	}

	public String getRealmRoleIdByName(String roleName) {
		List<RoleRepresentation> list = getRealmRoleServiceProxy().list();
		for (RoleRepresentation role : list) {
			if (StringUtils.equals(roleName, role.getName())) {
				return role.getId();
			}
		}
		return null;
	}

	public void deleteSession(String userId) {
		// delete session
		List<UserSessionRepresentation> userSessions = getUsersServiceProxy().get(userId).getUserSessions();
		for (UserSessionRepresentation userSessionRepresentation : userSessions) {
			Map<String, String> clients = userSessionRepresentation.getClients();
			if (clients != null && clients.containsKey(this.clientId)) {
				// delete this session
				getAuthorizationTargetRealmProxy().deleteSession(userSessionRepresentation.getId());
			}
		}
	}

	public void deleteSessions(String userId) {
		getUsersServiceProxy().get(userId).logout();
	}

	public List<UserRepresentation> getUserRepresentations() {
		return this.keyCloakInstance.realm(ServerConfig.getDefualt().getString(Keys.AUTH_REALM_NAME)).users().list();
	}

}
