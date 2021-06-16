package com.ifocus.aaascloud.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import com.ifocus.aaascloud.entity.Cloud_scCardInformationEntity;
import com.ifocus.aaascloud.mapper.VersionAppMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RestController;

import com.ifocus.aaascloud.constant.AliveConstant;
import com.ifocus.aaascloud.constant.DeleteFlagConstant;
import com.ifocus.aaascloud.entity.Cloud_productEntity;
import com.ifocus.aaascloud.repository.Cloud_productRepository;
import com.ifocus.aaascloud.entity.Cloud_versionEntity;
import com.ifocus.aaascloud.repository.Cloud_versionRepository;
import com.ifocus.aaascloud.model.Cloud_versionModel;
import com.ifocus.aaascloud.model.LoginInfo;

@SpringBootApplication
@RestController
@Service
@Transactional
public class Cloud_versionService {

    @Autowired
    private Cloud_versionRepository cloud_versionRepository;
    @Autowired
    private Cloud_productRepository cloud_productRepository;


    /**
     * バージョン一覧を取得する
     *
     * @return List<Cloud_versionModel> バージョン一覧
     */
    public List<Cloud_versionModel> getAllVersions(Cloud_versionModel model) throws Exception {
        List<Cloud_versionEntity> list = cloud_versionRepository.findAllVersions();
        return getModelsByEntitys(list);
    }

    /**
     * バージョンを検索する
     *
     * @param model バージョンモデル
     * @return List<Cloud_versionModel> バージョン一覧
     */
    public List<Cloud_versionModel> searchVersions(Cloud_versionModel model) {
        List<Cloud_versionEntity> list = cloud_versionRepository.searchVersionsByProductnameAndVersionname(model.getProductnameForSearch(),
                model.getVersionnameForSearch());
        return getModelsByEntitys(list);
    }

    /**
     * バージョン詳細を取得する
     *
     * @param model バージョンモデル
     * @return List<Cloud_versionModel> バージョン一覧
     */
    public Cloud_versionModel getVersioninInfo(Cloud_versionModel model) throws Exception {
        Optional<Cloud_versionEntity> version = cloud_versionRepository.findById(model.getRowid());
        return getCloud_versionModel(version.get());
    }

    /**
     * バージョン登録
     *
     * @param model バージョンモデル
     * @return Cloud_versionModel 登録済みバージョン
     */
    public Cloud_versionModel registerVersion(Cloud_versionModel model) {
        // 削除済行を物理削除する
        cloud_versionRepository.deleteVersionMarked(model.getProductid(), model.getVersioncode(), model.getVersionname());
        Cloud_versionEntity insertedEntity = cloud_versionRepository.save(getEntitByModel(model));
        return getCloud_versionModel(insertedEntity);

    }

    /**
     * バージョン更新
     *
     * @param model バージョンモデル
     * @return Cloud_versionModel 更新済みバージョン
     */
    public Cloud_versionModel updateVersion(Cloud_versionModel model) {
        Cloud_versionEntity updatedEntity = cloud_versionRepository.save(getEntitByModelForUpdate(model));
        return getCloud_versionModel(updatedEntity);
    }

    /**
     * バージョン削除
     *
     * @param loginInfo バージョンモデル
     * @param versionId バージョンID
     */
    public void deleteVersion(LoginInfo loginInfo, Integer versionId) {
        Optional<Cloud_versionEntity> value = cloud_versionRepository.findById(versionId);
        Cloud_versionEntity getEntity = value.get();
        getEntity.setDeleteflag(DeleteFlagConstant.DELETED);
        getEntity.setU_uid(loginInfo.getLoginuserid());
        getEntity.setU_time(new Timestamp(System.currentTimeMillis()));
        cloud_versionRepository.save(getEntity);
    }

    /**
     * 一括バージョン削除
     *
     * @param loginInfo     バージョンモデル
     * @param versionIdList バージョンIDリスト
     */
    public void deleteVersions(LoginInfo loginInfo, List<Integer> versionIdList) {
        if (CollectionUtils.isEmpty(versionIdList)) {
            return;
        }

        Timestamp systemDateTime = new Timestamp(System.currentTimeMillis());
        Iterable<Cloud_versionEntity> finds = cloud_versionRepository.findAllById(versionIdList);
        finds.forEach(item -> {
            item.setDeleteflag(DeleteFlagConstant.DELETED);
            item.setU_uid(loginInfo.getLoginuserid());
            item.setU_time(systemDateTime);
        });
        cloud_versionRepository.saveAll(finds);
    }

    /**
     * バージョンEntityリストからバージョンModeリストl取得
     *
     * @param entityList List<Cloud_versionEntity> バージョンEntityリスト
     * @return List<Cloud_versionModel> バージョンModeリスト
     */
    private List<Cloud_versionModel> getModelsByEntitys(List<Cloud_versionEntity> entityList) {
        List<Cloud_versionModel> modelList = new ArrayList<Cloud_versionModel>();
        for (Cloud_versionEntity entity : entityList) {
            modelList.add(getCloud_versionModel(entity));
        }
        return modelList;
    }

    /**
     * バージョンモデル取得
     *
     * @param entity Cloud_companyEntity バージョンエンティティ
     * @return Cloud_versionModel バージョンモデル
     */
    private Cloud_versionModel getCloud_versionModel(Cloud_versionEntity entity) {
        Cloud_versionModel model = VersionAppMapper.MAPPER.toVersionModel(entity);
        // プロダクト取得＆設定
        Optional<Cloud_productEntity> product = cloud_productRepository.findById(entity.getProductid());
        model.setProductname(product.get().getProductname());

        return model;
    }

    /**
     * ModelからEntity取得(登録用)
     *
     * @param model Cloud_versionModel
     * @return Cloud_versionEntity
     */
    private Cloud_versionEntity getEntitByModel(Cloud_versionModel model) {
        /* システム日時 */
        Timestamp systemTime = new Timestamp(System.currentTimeMillis());

        // 情報設定
        Cloud_versionEntity entity = VersionAppMapper.MAPPER.toVersionEntity(model);
        entity.setRowid(null);
        entity.setAlive(AliveConstant.ALIVE);
        entity.setDeleteflag(DeleteFlagConstant.NOT_DELETED);
        entity.setI_uid(model.getLoginInfo().getLoginuserid());
        entity.setI_time(systemTime);
        entity.setU_uid(model.getLoginInfo().getLoginuserid());
        entity.setU_time(systemTime);

        return entity;
    }

    /**
     * ModelからEntity取得(更新用)
     *
     * @param model Cloud_versionModel
     * @return Cloud_versionEntity
     */
    private Cloud_versionEntity getEntitByModelForUpdate(Cloud_versionModel model) {
        Optional<Cloud_versionEntity> version = cloud_versionRepository.findById(model.getRowid());
        Cloud_versionEntity entity = version.get();

        /* システム日時 */
        Timestamp systemTime = new Timestamp(System.currentTimeMillis());

        // 情報設定
        entity.setProductid(model.getProductid());
        entity.setVersioncode(model.getVersioncode());
        entity.setVersionname(model.getVersionname());
        entity.setDownloadurl(model.getDownloadurl());
        entity.setDescription(model.getDescription());
        entity.setDeleteflag(DeleteFlagConstant.NOT_DELETED);
        entity.setU_uid(model.getLoginInfo().getLoginuserid());
        entity.setU_time(systemTime);

        return entity;
    }

}
