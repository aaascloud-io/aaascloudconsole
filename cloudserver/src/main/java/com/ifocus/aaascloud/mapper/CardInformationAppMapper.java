package com.ifocus.aaascloud.mapper;

import com.ifocus.aaascloud.config.AppMapperConfiguration;
import com.ifocus.aaascloud.entity.Cloud_scCardInformationEntity;
import com.ifocus.aaascloud.model.Cloud_scCardInformationModel.CardInformation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(config = AppMapperConfiguration.class, uses = {}, imports = {})
public interface CardInformationAppMapper {
    CardInformationAppMapper MAPPER = Mappers.getMapper( CardInformationAppMapper.class );

    @Mapping(source = "ukeirebi", target = "ukeirebi", dateFormat = "yyyy-MM-dd")
    @Mapping(source = "hakkobi", target = "hakkobi", dateFormat = "yyyy-MM-dd")
    @Mapping(source = "riyokaishibi", target = "riyokaishibi", dateFormat = "yyyy-MM-dd")
    CardInformation toCardInformation (Cloud_scCardInformationEntity entity);
    List<CardInformation> toCardInformations(List<Cloud_scCardInformationEntity> entities);
}
