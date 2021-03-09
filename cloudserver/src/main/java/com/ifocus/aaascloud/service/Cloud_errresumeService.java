package com.ifocus.aaascloud.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.ifocus.aaascloud.constant.AliveConstant;
import com.ifocus.aaascloud.constant.StatusFlagConstant;
import com.ifocus.aaascloud.entity.Cloud_errlogEntity;
import com.ifocus.aaascloud.entity.Cloud_errlogRepository;
import com.ifocus.aaascloud.entity.Cloud_errresumeEntity;
import com.ifocus.aaascloud.entity.Cloud_errresumeRepository;
import com.ifocus.aaascloud.model.Cloud_errresumeModel;

@SpringBootApplication
@RestController
@Service
@Transactional
public class Cloud_errresumeService {

	@Autowired
	private Cloud_errresumeRepository cloud_errresumeRepository ;
	@Autowired
	private Cloud_errlogRepository cloud_errlogRepository;

	/*
	 * エラー履歴情報一覧取得
	 *
	 */
	public List<Cloud_errresumeModel> getErrresumeList(Integer errlogid) throws Exception {
		List<Cloud_errresumeEntity> entityList = cloud_errresumeRepository.findListByErrlogid(errlogid);
		return getModelsByEntitys(entityList);

	}

	/*
	 * エラー履歴情報取得
	 *
	 */
	public Cloud_errresumeModel getErrresumeInfo(Integer rowid) throws Exception {
		Optional<Cloud_errresumeEntity> entity = cloud_errresumeRepository.findById(rowid);
		return getCloud_errresumeModel(entity.get());

	}

	/*
	 * エラー履歴登録
	 *
	 */
	public Cloud_errresumeModel registerErrresume(Cloud_errresumeModel inModel) throws Exception {

		Cloud_errresumeEntity entity = getEntitByModel(inModel);

		// 現在エラーログ情報取得
		Optional<Cloud_errlogEntity> cloud_errlog = cloud_errlogRepository.findById(inModel.getErrlogid());
		Cloud_errlogEntity cloud_errlogEntity = cloud_errlog.get();

		// 対応完了の場合
		if (inModel.getDoneFlag() != null && inModel.getDoneFlag() == 1) {
			// エラー履歴のステータス設定
			entity.setStatusflagbefore(cloud_errlogEntity.getStatusflag());
			entity.setStatusflagafter(StatusFlagConstant.FLAG_DONE);
			// エラーログのステータス設定
			cloud_errlogEntity.setStatusflag(StatusFlagConstant.FLAG_DONE);
		} else {
			// エラー履歴のステータス設定
			entity.setStatusflagbefore(cloud_errlogEntity.getStatusflag());
			entity.setStatusflagafter(StatusFlagConstant.FLAG_WIP);
			// エラーログのステータス設定
			cloud_errlogEntity.setStatusflag(StatusFlagConstant.FLAG_WIP);
		}
		////////////////////////////////////////////////////////
		// エラー履歴テーブル登録
		////////////////////////////////////////////////////////
		Cloud_errresumeEntity insertedEntity = cloud_errresumeRepository.save(entity);

		////////////////////////////////////////////////////////
		// エラーログテーブル更新
		////////////////////////////////////////////////////////
		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());

		// 情報設定
		cloud_errlogEntity.setU_uid(inModel.getLoginInfo().getLoginuserid());
		cloud_errlogEntity.setU_time(systemTime);
		cloud_errlogRepository.save(cloud_errlogEntity);

		return getCloud_errresumeModel(insertedEntity);

	}

	/*
	 * エラー履歴削除
	 * @param model Cloud_errresumeModel
	 */
	public void deleteErrresume(Cloud_errresumeModel model) throws Exception {

		if (cloud_errlogRepository.existsById(model.getRowid())) {
			cloud_errlogRepository.deleteById(model.getRowid());
		}

	}

	/*
	 * エラー履歴Entityリストからエラー履歴Modeリストl取得
	 * @param entityList List<Cloud_errresumeEntity> エラー履歴Entityリスト
	 * @return List<Cloud_errresumeModel> エラー履歴Modeリスト
	 *
	 */
	private List<Cloud_errresumeModel> getModelsByEntitys(List<Cloud_errresumeEntity> entityList) throws Exception {
		List<Cloud_errresumeModel> modelList = new ArrayList<Cloud_errresumeModel>();
		for (Cloud_errresumeEntity entity:entityList) {
			modelList.add(getCloud_errresumeModel(entity));
		}

		return modelList;

	}

	/*
	 * エラー履歴モデル取得
	 * @param entity Cloud_errresumeEntity エラー履歴エンティティ
	 * @return Cloud_errresumeModel エラー履歴モデル
	 *
	 */
	private Cloud_errresumeModel getCloud_errresumeModel(Cloud_errresumeEntity entity) throws Exception {
		Cloud_errresumeModel model = new Cloud_errresumeModel();
		model.setRowid(entity.getRowid());
		model.setErrlogid(entity.getErrlogid());
		model.setStatusflagbefore(entity.getStatusflagbefore());
		model.setStatusflagafter(entity.getStatusflagafter());
		model.setContents(entity.getContents());
		model.setI_uid(entity.getI_uid());
		model.setI_time(entity.getI_time());

		// 画面表示用項目設定
		model.setStatusInStr();

		return model;

	}

	/*
	 * ModelからEntity取得(登録用)
	 * @param model Cloud_errresumeModel
	 * @return Cloud_errresumeEntity
	 *
	 */
	private Cloud_errresumeEntity getEntitByModel(Cloud_errresumeModel model) throws Exception {

		Cloud_errresumeEntity entity = new Cloud_errresumeEntity();

		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());

		// 情報設定
		entity.setErrlogid(model.getErrlogid());
		entity.setContents(model.getContents());
		entity.setAlive(AliveConstant.ALIVE);
		entity.setI_uid(model.getLoginInfo().getLoginuserid());
		entity.setI_time(systemTime);
		entity.setU_uid(model.getLoginInfo().getLoginuserid());
		entity.setU_time(systemTime);

		return entity;

	}
}
