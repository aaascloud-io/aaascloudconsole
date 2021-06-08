package com.ifocus.aaascloud.mapper;

import com.ifocus.aaascloud.config.AppMapperConfiguration;
import com.ifocus.aaascloud.entity.Cloud_scCardInformationEntity;
import com.ifocus.aaascloud.model.Cloud_scCardInformationModel;
import com.ifocus.aaascloud.util.StringUtil;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Mapper(config = AppMapperConfiguration.class, uses = {}, imports = {})
public interface CardInformationAppMapper {
    CardInformationAppMapper MAPPER = Mappers.getMapper(CardInformationAppMapper.class);

    @Mapping(source = "ukeirebi", target = "ukeirebi", dateFormat = "yyyy-MM-dd")
    @Mapping(source = "hakkobi", target = "hakkobi", dateFormat = "yyyy-MM-dd")
    @Mapping(source = "riyokaishibi", target = "riyokaishibi", dateFormat = "yyyy-MM-dd")
    Cloud_scCardInformationModel toCardInformationModel(Cloud_scCardInformationEntity entity);

    List<Cloud_scCardInformationModel> toCardInformationModels(List<Cloud_scCardInformationEntity> entities);

    Cloud_scCardInformationEntity toCardInformationEntity(Cloud_scCardInformationModel model);

    List<Cloud_scCardInformationEntity> toCardInformationEntities(List<Cloud_scCardInformationModel> models);

    default Timestamp map(String date) {
        if (StringUtil.isEmpty(date)) {
            return null;
        }
        LocalDate localDate = LocalDate.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        LocalDateTime localDateTime = localDate.atStartOfDay();
        return Timestamp.valueOf(localDateTime);
    }


}
