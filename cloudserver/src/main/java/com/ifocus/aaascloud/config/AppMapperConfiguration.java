package com.ifocus.aaascloud.config;

import org.mapstruct.MapperConfig;
import org.mapstruct.MappingInheritanceStrategy;
import org.mapstruct.ReportingPolicy;

@MapperConfig(componentModel = "spring",
        mappingInheritanceStrategy = MappingInheritanceStrategy.AUTO_INHERIT_FROM_CONFIG,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {VocabularyResolvableStringMapper.class})
public interface AppMapperConfiguration {
}
