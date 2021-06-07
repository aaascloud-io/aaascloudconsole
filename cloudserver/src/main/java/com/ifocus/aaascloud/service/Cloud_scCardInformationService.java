package com.ifocus.aaascloud.service;

import com.ifocus.aaascloud.constant.DeleteFlagConstant;
import com.ifocus.aaascloud.entity.Cloud_scCardInformationEntity;
import com.ifocus.aaascloud.mapper.CardInformationAppMapper;
import com.ifocus.aaascloud.model.Cloud_scCardInformationModel;
import com.ifocus.aaascloud.repository.Cloud_scCardInformationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@Transactional
public class Cloud_scCardInformationService {
    @Autowired
    private Cloud_scCardInformationRepository cloud_scCardInformationRepository;

    public List<Cloud_scCardInformationModel> findSimCardList() {
        Iterable<Cloud_scCardInformationEntity> list = cloud_scCardInformationRepository.findAll();
        List<Cloud_scCardInformationEntity> entities = StreamSupport.stream(list.spliterator(), false).collect(Collectors.toList());
        entities = entities.stream().filter(item -> Objects.equals(DeleteFlagConstant.NOT_DELETED, item.getDeleteflg())).collect(Collectors.toList());
        List<Cloud_scCardInformationModel> models = CardInformationAppMapper.MAPPER.toCardInformationModels(entities);
        return models;
//        return models.stream()
//                .map(item -> new TreeNode<>(item, null))
//                .collect(Collectors.toList());
    }

    public Cloud_scCardInformationModel addSimCard(Cloud_scCardInformationModel model) {
        Cloud_scCardInformationEntity entity = CardInformationAppMapper.MAPPER.toCardInformationEntity(model);
        Cloud_scCardInformationEntity result = cloud_scCardInformationRepository.save(entity);
        Cloud_scCardInformationModel modelResult = CardInformationAppMapper.MAPPER.toCardInformationModel(result);
        return modelResult;
    }

    public Cloud_scCardInformationModel deleteSimCard(Cloud_scCardInformationModel model) {
        Cloud_scCardInformationEntity entity = CardInformationAppMapper.MAPPER.toCardInformationEntity(model);
        // プロダクト論理削除
        entity.setDeleteflg(DeleteFlagConstant.DELETED);
//        entity.setU_uid(loginInfo.getLoginuserid());
//        entity.setU_time(new Timestamp(System.currentTimeMillis()));
        // DB更新
        Cloud_scCardInformationEntity result = cloud_scCardInformationRepository.save(entity);
        Cloud_scCardInformationModel modelResult = CardInformationAppMapper.MAPPER.toCardInformationModel(result);
        return modelResult;
    }

}
