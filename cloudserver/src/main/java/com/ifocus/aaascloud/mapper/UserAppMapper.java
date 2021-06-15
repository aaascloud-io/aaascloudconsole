package com.ifocus.aaascloud.mapper;

import com.ifocus.aaascloud.config.AppMapperConfiguration;
import com.ifocus.aaascloud.entity.Cloud_companyEntity;
import com.ifocus.aaascloud.entity.Cloud_userEntity;
import com.ifocus.aaascloud.model.Cloud_userModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(config = AppMapperConfiguration.class, uses = {}, imports = {})
public interface UserAppMapper {
    UserAppMapper MAPPER = Mappers.getMapper(UserAppMapper.class);

    Cloud_userModel toUserModel(Cloud_userEntity entity);

    List<Cloud_userModel> toUserModels(List<Cloud_userEntity> entities);

    @Mapping(source = "loginInfo.loginuserid", target = "i_uid")
    @Mapping(source = "loginInfo.loginuserid", target = "u_uid")
    Cloud_companyEntity toCompanyEntity(Cloud_userModel model);

    @Mapping(source = "loginInfo.loginuserid", target = "i_uid")
    @Mapping(source = "loginInfo.loginuserid", target = "u_uid")
    Cloud_userEntity toUserEntity(Cloud_userModel model);
}
