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
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@Transactional
public class Cloud_scCardInformationService {

    @Autowired
    private Cloud_scCardInformationRepository cloud_scCardInformationRepository;

    /**
     * 一覧情報取得
     *
     * @return 取得した結果
     */
    public List<Cloud_scCardInformationModel> findSimCardList() {
        Iterable<Cloud_scCardInformationEntity> list = cloud_scCardInformationRepository.findAll();
        List<Cloud_scCardInformationModel> models = this.toCardInformationModels(list);
        models = models.stream().filter(item -> Objects.equals(DeleteFlagConstant.NOT_DELETED, item.getDeleteflg())).collect(Collectors.toList());
        return models;
    }

    /**
     * SIMカード情報を追加／更新する
     *
     * @param model 指定したSIMカード情報
     * @return 追加／更新後のSIMカード情報
     */
    public Cloud_scCardInformationModel addSimCard(Cloud_scCardInformationModel model) {
        Cloud_scCardInformationEntity entity = CardInformationAppMapper.MAPPER.toCardInformationEntity(model);
        return this.saveSimCard(entity);
    }

    /**
     * SIMカード情報を削除する
     *
     * @param model 指定したSIMカード情報
     * @return 削除後のSIMカード情報
     */
    public Cloud_scCardInformationModel deleteSimCard(Cloud_scCardInformationModel model) {
        Cloud_scCardInformationEntity entity = CardInformationAppMapper.MAPPER.toCardInformationEntity(model);
        // プロダクト論理削除
        entity.setDeleteflg(DeleteFlagConstant.DELETED);
//        entity.setU_uid(loginInfo.getLoginuserid());
//        entity.setU_time(new Timestamp(System.currentTimeMillis()));
        // DB更新
        return this.saveSimCard(entity);
    }

    /**
     * SIMカードのNoによって、SIMカード情報を取得する
     *
     * @param id SIMカードNo
     * @return SIMカード情報
     */
    public Cloud_scCardInformationModel findSimCardById(Integer id) {
        Optional<Cloud_scCardInformationEntity> opt = cloud_scCardInformationRepository.findById(id);
        Cloud_scCardInformationEntity entity = opt.orElse(new Cloud_scCardInformationEntity());
        return CardInformationAppMapper.MAPPER.toCardInformationModel(entity);
    }

    /**
     * SIMカード情報リストを削除する
     *
     * @param models SIMカード情報リスト
     * @return 削除したSIMカード情報
     */
    public List<Cloud_scCardInformationModel> deleteAll(List<Cloud_scCardInformationModel> models) {
        List<Cloud_scCardInformationEntity> entities = CardInformationAppMapper.MAPPER.toCardInformationEntities(models);
        entities.stream().forEach(item -> item.setDeleteflg(DeleteFlagConstant.DELETED));
        return this.saveSimCardList(entities);
    }

    /**
     * SIMカード情報リストを追加する
     *
     * @param models SIMカード情報リスト
     * @return 追加したSIMカード情報
     */
    public List<Cloud_scCardInformationModel> addAll(List<Cloud_scCardInformationModel> models){
        List<Cloud_scCardInformationEntity> entities = CardInformationAppMapper.MAPPER.toCardInformationEntities(models);
        entities.stream().forEach(item -> item.setDeleteflg(DeleteFlagConstant.NOT_DELETED));
        return this.saveSimCardList(entities);
    }

    /**
     * 結果リスト（Iterable）からモデルリストに変換する
     *
     * @param list 結果リスト
     * @return 変換した結果
     */
    private List<Cloud_scCardInformationModel> toCardInformationModels(Iterable<Cloud_scCardInformationEntity> list) {
        List<Cloud_scCardInformationEntity> entities = StreamSupport.stream(list.spliterator(), false).collect(Collectors.toList());
        return CardInformationAppMapper.MAPPER.toCardInformationModels(entities);
//        return models.stream()
//                .map(item -> new TreeNode<>(item, null))
//                .collect(Collectors.toList());
    }

    /**
     * IMカード情報を追加／更新する
     *
     * @param entity 指定したSIMカード情報
     * @return 追加／更新後のSIMカード情報
     */
    private Cloud_scCardInformationModel saveSimCard(Cloud_scCardInformationEntity entity) {
        Cloud_scCardInformationEntity result = cloud_scCardInformationRepository.save(entity);
        return CardInformationAppMapper.MAPPER.toCardInformationModel(result);
    }

    /**
     * SIMカード情報リストを追加／削除する
     *
     * @param entities SIMカード情報リスト
     * @return 追加／削除のSIMカード情報
     */
    private List<Cloud_scCardInformationModel> saveSimCardList(List<Cloud_scCardInformationEntity> entities) {
        Iterable<Cloud_scCardInformationEntity> list = cloud_scCardInformationRepository.saveAll(entities);
        return this.toCardInformationModels(list);
    }

}
