package com.ifocus.aaascloud.mapper;

import com.ifocus.aaascloud.config.AppMapperConfiguration;
import com.ifocus.aaascloud.entity.Cloud_versionEntity;
import com.ifocus.aaascloud.model.Cloud_versionModel;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(config = AppMapperConfiguration.class, uses = {}, imports = {})
public interface VersionAppMapper {
    VersionAppMapper MAPPER = Mappers.getMapper(VersionAppMapper.class);

    Cloud_versionModel toVersionModel(Cloud_versionEntity entity);

    Cloud_versionEntity toVersionEntity(Cloud_versionModel model);
}
