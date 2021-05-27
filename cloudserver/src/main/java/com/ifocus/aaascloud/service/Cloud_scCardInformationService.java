package com.ifocus.aaascloud.service;

import com.ifocus.aaascloud.entity.Cloud_scCardInformationEntity;
import com.ifocus.aaascloud.mapper.CardInformationAppMapper;
import com.ifocus.aaascloud.model.Cloud_scCardInformationModel.CardInformation;
import com.ifocus.aaascloud.repository.Cloud_scCardInformationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@Transactional
public class Cloud_scCardInformationService {
    @Autowired
    private Cloud_scCardInformationRepository cloud_scCardInformationRepository;

    public List<CardInformation> findCardList() {
        Iterable<Cloud_scCardInformationEntity> list = cloud_scCardInformationRepository.findAll();
        List<Cloud_scCardInformationEntity> entities = StreamSupport.stream(list.spliterator(), false).collect(Collectors.toList());
        List<CardInformation> models = CardInformationAppMapper.MAPPER.toCardInformations(entities);
        return models;
//        return models.stream()
//                .map(item -> new TreeNode<>(item, null))
//                .collect(Collectors.toList());
    }
    

}
