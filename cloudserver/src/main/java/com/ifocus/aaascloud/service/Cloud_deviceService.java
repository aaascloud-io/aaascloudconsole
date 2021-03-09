package com.ifocus.aaascloud.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.ifocus.aaascloud.constant.AliveConstant;
import com.ifocus.aaascloud.constant.CommonConstant;
import com.ifocus.aaascloud.entity.Cloud_companyEntity;
import com.ifocus.aaascloud.entity.Cloud_companyRepository;
import com.ifocus.aaascloud.entity.Cloud_deviceEntity;
import com.ifocus.aaascloud.entity.Cloud_deviceRepository;
import com.ifocus.aaascloud.entity.Cloud_groupEntity;
import com.ifocus.aaascloud.entity.Cloud_groupRepository;
import com.ifocus.aaascloud.entity.Cloud_productEntity;
import com.ifocus.aaascloud.entity.Cloud_productRepository;
import com.ifocus.aaascloud.entity.Cloud_projectEntity;
import com.ifocus.aaascloud.entity.Cloud_projectRepository;
import com.ifocus.aaascloud.entity.Cloud_userEntity;
import com.ifocus.aaascloud.entity.Cloud_userRepository;
import com.ifocus.aaascloud.model.Cloud_deviceDetailModel;
import com.ifocus.aaascloud.model.Cloud_deviceModel;
import com.ifocus.aaascloud.model.Cloud_groupModel;
import com.ifocus.aaascloud.model.Cloud_projectDetailModel;
import com.ifocus.aaascloud.model.Cloud_projectModel;
import com.ifocus.aaascloud.model.LoginInfo;
import com.ifocus.aaascloud.util.Util;

@SpringBootApplication
@RestController
@Service
@Transactional
public class Cloud_deviceService {

	@Autowired
	private Cloud_deviceRepository cloud_deviceRepository ;
	@Autowired
	private Cloud_userRepository cloud_userRepository ;
	@Autowired
	private Cloud_companyRepository cloud_companyRepository ;
	@Autowired
	private Cloud_productRepository cloud_productRepository ;
	@Autowired
	private Cloud_projectRepository cloud_projectRepository ;
	@Autowired
	private Cloud_groupRepository cloud_groupRepository ;

	@Autowired
	private Cloud_userService cloud_userService;

	/*
	 * 配下各社のデバイス一覧取得
	 * @param model Cloud_deviceModel デバイス情報
	 * @return List<Cloud_deviceModel> デバイス一覧
	 *
	 */
	public List<Cloud_deviceModel> getUnderCompanyDevices(Cloud_deviceModel model) throws Exception {

		// 会社IDを設定する
		this.setCompanyIDToModel(model);

		// 配下各社ID一覧を取得する
		List<Integer> underUserCompanyIdList = cloud_userService.getUnderCompanyIds(model);

		// 全社のデバイス一覧取得
		List<Cloud_deviceEntity> list = cloud_deviceRepository.searchUnderCompanyDevicesByCompanyidIn(underUserCompanyIdList);
		return this.getModelsByEntitys(list);

	}

	/*
	 * 配下各社のデバイス検索
	 * @param model Cloud_deviceModel デバイス情報
	 * @return List<Cloud_deviceModel> デバイス一覧
	 *
	 */
	public List<Cloud_deviceModel> getUnderCompanyDevicesByConditions(Cloud_deviceModel model) throws Exception {

		// 会社IDを設定する
		this.setCompanyIDToModel(model);

		List<Integer> underUserCompanyIdList = new ArrayList<Integer>();
		if (model.getCompanyid() == null) {
			// 配下各社ID一覧を取得する
			underUserCompanyIdList = cloud_userService.getUnderCompanyIds(model);
		} else {
			// 指定会社IDを設定する
			underUserCompanyIdList = Arrays.asList(model.getCompanyid());
		}

		// 全社のデバイス一覧取得
		List<Cloud_deviceEntity> list = new ArrayList<Cloud_deviceEntity>();
		// グループ指定なしの場合
		if (model.getGroupForSearch() == CommonConstant.DEFAULT_MATCH_ALL ) {
			// プロジェクト名指定なし
			if (model.getProjectnameForSearch() == CommonConstant.DEFAULT_MATCH_ALL) {
				list = cloud_deviceRepository.findByCompanyidInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndCompany_IndustryLike(
						underUserCompanyIdList,
						model.getImeiForSearch(),
						model.getImeiForSearch(),
						model.getProductnameForSearch(),
						model.getIndustryForSearch()
						);
			// プロジェクト名指定あり
			} else {
				list = cloud_deviceRepository.findByCompanyidInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLike(
						underUserCompanyIdList,
						model.getImeiForSearch(),
						model.getImeiForSearch(),
						model.getProductnameForSearch(),
						model.getProjectnameForSearch(),
						model.getIndustryForSearch()
						);
			}
		// グループ指定ありの場合
		} else {
			// プロジェクト名指定なし
			if (model.getProjectnameForSearch() == CommonConstant.DEFAULT_MATCH_ALL) {

				list = cloud_deviceRepository.findByCompanyidInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndCompany_IndustryLikeAndGroupentity_GroupnameLike(
						underUserCompanyIdList,
						model.getImeiForSearch(),
						model.getImeiForSearch(),
						model.getProductnameForSearch(),
						model.getIndustryForSearch(),
						model.getGroupForSearch()
						);
			// プロジェクト名指定あり
			} else {
				list = cloud_deviceRepository.findByCompanyidInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLikeAndGroupentity_GroupnameLike(
						underUserCompanyIdList,
						model.getImeiForSearch(),
						model.getImeiForSearch(),
						model.getProductnameForSearch(),
						model.getProjectnameForSearch(),
						model.getIndustryForSearch(),
						model.getGroupForSearch()
						);
			}
		}
		return this.getModelsByEntitys(list);

	}

	/*
	 * 配下ユーザのデバイス検索
	 * @param model Cloud_deviceModel デバイス情報
	 * @return List<Cloud_deviceModel> デバイス一覧
	 *
	 */
	public List<Cloud_deviceModel> getUnderUserDevicesByConditions(Cloud_deviceModel model, List<Integer> userids) throws Exception {


		// 全社のデバイス一覧取得
		List<Cloud_deviceEntity> list = new ArrayList<Cloud_deviceEntity>();
		// グループ指定なしの場合
		if (model.getGroupForSearch() == CommonConstant.DEFAULT_MATCH_ALL ) {
			// プロジェクト名指定なし
			if (model.getProjectnameForSearch() == CommonConstant.DEFAULT_MATCH_ALL) {
				list = cloud_deviceRepository.findByUseridInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndCompany_IndustryLike(
						userids,
						model.getImeiForSearch(),
						model.getImeiForSearch(),
						model.getProductnameForSearch(),
						model.getIndustryForSearch()
						);
			// プロジェクト名指定あり
			} else {
				list = cloud_deviceRepository.findByUseridInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLike(
						userids,
						model.getImeiForSearch(),
						model.getImeiForSearch(),
						model.getProductnameForSearch(),
						model.getProjectnameForSearch(),
						model.getIndustryForSearch()
						);
			}
		// グループ指定ありの場合
		} else {
			// プロジェクト名指定なし
			if (model.getProjectnameForSearch() == CommonConstant.DEFAULT_MATCH_ALL) {

				list = cloud_deviceRepository.findByUseridInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndCompany_IndustryLikeAndGroupentity_GroupnameLike(
						userids,
						model.getImeiForSearch(),
						model.getImeiForSearch(),
						model.getProductnameForSearch(),
						model.getIndustryForSearch(),
						model.getGroupForSearch()
						);
			// プロジェクト名指定あり
			} else {
				list = cloud_deviceRepository.findByUseridInAndImeiLikeOrSnLikeAndProduct_ProductnameLikeAndProject_ProjectnameLikeAndCompany_IndustryLikeAndGroupentity_GroupnameLike(
						userids,
						model.getImeiForSearch(),
						model.getImeiForSearch(),
						model.getProductnameForSearch(),
						model.getProjectnameForSearch(),
						model.getIndustryForSearch(),
						model.getGroupForSearch()
						);
			}
		}
		return getModelsByEntitys(list);

	}

	/*
	 * 全社のデバイス一覧取得
	 * @param model Cloud_deviceModel デバイス情報
	 * @return List<Cloud_deviceModel> デバイス一覧
	 *
	 */
	public List<Cloud_deviceModel> getCompanyDevices(Cloud_deviceModel model) throws Exception {

		// 会社IDを設定する
		this.setCompanyIDToModel(model);

		// 全社のデバイス一覧取得
		List<Cloud_deviceEntity> list = cloud_deviceRepository.searchAllDevicesByCompanyid(model.getTargetUserInfo().getTargetuserCompanyid());
		return this.getModelsByEntitys(list);

	}

	/*
	 * 配下ユーザのデバイス一覧取得
	 * @param model Cloud_deviceModel デバイス情報
	 * @return List<Cloud_deviceModel> デバイス一覧
	 *
	 */
	public List<Cloud_deviceModel> getUnderUserDevices(Cloud_deviceModel model, List<Integer> userids) throws Exception {

		// 配下ユーザのデバイス一覧取得
		List<Cloud_deviceEntity> list = cloud_deviceRepository.searchUnderUserDevicesByUseridIn(userids);
		return this.getModelsByEntitys(list);

	}

	/*
	 * 自社デバイス一覧取得(デバイス選択子画面用：プロジェクトとグループに所属しない自社デバイス)
	 * @param model Cloud_deviceModel デバイス情報
	 * @return List<Cloud_deviceModel> デバイス一覧
	 *
	 */
	public List<Cloud_deviceModel> getMySelectableDevicesByCompanyid(Cloud_deviceModel model) throws Exception {

		// 会社IDを設定する
		this.setCompanyIDToModel(model);

		// 全社のデバイス一覧取得
		List<Cloud_deviceEntity> list = cloud_deviceRepository.searchSelectableDevicesByCompanyid(model.getTargetUserInfo().getTargetuserCompanyid());
		return this.getModelsByEntitys(list);

	}

	/*
	 * プロジェクトデバイス一覧取得(グループに所属なし)
	 * @param projectid Integer プロジェクトID
	 * @return List<Cloud_deviceModel> プロジェクトデバイス一覧
	 *
	 */
	public List<Cloud_deviceModel> getProjectDevices(Integer projectid) throws Exception {

		List<Cloud_deviceEntity> list = cloud_deviceRepository.searchDevicesByProjectidAndGroupid(projectid,0);
		return this.getModelsByEntitys(list);

	}

	/*
	 * グループ別デバイス一覧取得
	 * @param projectid Integer プロジェクトID
	 * @param groupid Integer グループID
	 * @return List<Cloud_deviceModel> グループ別デバイス一覧
	 *
	 */
	public List<Cloud_deviceModel> getGroupDevices(Integer projectid, Integer groupid) throws Exception {

		List<Cloud_deviceEntity> list = cloud_deviceRepository.searchDevicesByProjectidAndGroupid(projectid, groupid);
		return this.getModelsByEntitys(list);

	}

	/*
	 * デバイス詳細取得
	 * @param deviceid Integer デバイスID
	 * @return Cloud_deviceDetailModel デバイス詳細情報
	 *
	 */
	public Cloud_deviceDetailModel getDeviceDetail(Integer deviceid) throws Exception {

		Optional<Cloud_deviceEntity> entity = cloud_deviceRepository.findById(deviceid);

		return getDetailModelByEntity(entity.get());

	}

	/*
	 * デバイス登録
	 * @param model Cloud_deviceModel デバイス情報
	 * @return Integer デバイスID
	 *
	 */
	public Integer registerDevice(Cloud_deviceModel model) throws Exception {

		// 会社IDを設定する
		this.setCompanyIDToModel(model);
		// デバイス登録
		Cloud_deviceEntity insertedEntity = cloud_deviceRepository.save(this.getEntitByDetailModel(model.getDeviceDetail(),model.getLoginInfo()));
		return insertedEntity.getDeviceid();

	}

	/*
	 * デバイス一括登録
	 * @param model Cloud_deviceModel デバイス情報
	 * @return Integer デバイスID
	 *
	 */
	public Integer registerDevices(Cloud_deviceModel model) throws Exception {

		// 会社IDを設定する
		this.setCompanyIDToModel(model);
		// デバイス登録
		Integer count = 0;
		for (Cloud_deviceDetailModel deviceDetailModel:model.getDeviceDetailList()) {
			Cloud_deviceEntity insertedEntity = cloud_deviceRepository.save(getEntitByDetailModel(deviceDetailModel,model.getLoginInfo()));
			count++;
		}
		return count;

	}

	/*
	 * デバイス更新
	 * @param model Cloud_deviceModel デバイス情報
	 * @return Integer デバイスID
	 *
	 */
	public Integer updateDevice(Cloud_deviceModel model) throws Exception {
		// 会社IDを設定する
		this.setCompanyIDToModel(model);
		// デバイス更新
		Cloud_deviceEntity updatedEntity = cloud_deviceRepository.save(this.getEntitByModelForUpdate(model));
		return updatedEntity.getDeviceid();

	}

	/*
	 * デバイスのプロジェクト情報をクリアする（プロジェクトのみ）
	 * @param model Integer Cloud_projectDetailModel
	 *
	 */
	public void clearProjectInfoForProjectOnly(Cloud_projectDetailModel model) throws Exception {

		if (model.getDeviceList() != null && !model.getDeviceList().isEmpty()) {
			// デバイスID一覧取得
			List<Integer> deviceidList = new ArrayList<Integer>();
			for (Cloud_deviceModel cloud_deviceModel:model.getDeviceList()) {
				deviceidList.add(cloud_deviceModel.getDeviceid());
			}

			// デバイス一覧取得
			List<Cloud_deviceEntity> list = (List<Cloud_deviceEntity>) cloud_deviceRepository.findAllById(deviceidList);
			/* システム日時 */
			Timestamp systemTime = new Timestamp(System.currentTimeMillis());
			for (Cloud_deviceEntity entity:list) {
				// プロジェクト情報をクリアする
				entity.setProjectid(null);
				entity.setU_uid(model.getLoginInfo().getLoginuserid());
				entity.setU_time(systemTime);
			}
			// デバイス更新
			cloud_deviceRepository.saveAll(list);
		}
		return ;

	}

	/*
	 * デバイスのグループ情報をクリアする（グループ）
	 * @param model Cloud_groupModel
	 *
	 */
	public void clearGroupInfoForGroupOnly(Cloud_groupModel model) throws Exception {

		if (model.getDeviceList() != null && !model.getDeviceList().isEmpty()) {
			// デバイスID一覧取得
			List<Integer> deviceidList = new ArrayList<Integer>();
			for (Cloud_deviceModel cloud_deviceModel:model.getDeviceList()) {
				deviceidList.add(cloud_deviceModel.getDeviceid());
			}

			// デバイス一覧取得
			List<Cloud_deviceEntity> list = (List<Cloud_deviceEntity>) cloud_deviceRepository.findAllById(deviceidList);
			/* システム日時 */
			Timestamp systemTime = new Timestamp(System.currentTimeMillis());
			for (Cloud_deviceEntity entity:list) {
				// プロジェクト情報をクリアする
				entity.setProjectid(null);
				// グループ情報をクリアする
				entity.setGroupid(null);
				entity.setU_uid(model.getLoginInfo().getLoginuserid());
				entity.setU_time(systemTime);
			}
			// デバイス更新
			cloud_deviceRepository.saveAll(list);
		}
		return ;

	}

	/*
	 * デバイスのプロジェクト情報をクリアする（プロジェクト削除用）
	 * @param model Cloud_projectModel
	 *
	 */
	public void clearProjectInfoForProjectDelete(Cloud_projectModel model) throws Exception {

			// デバイス一覧取得
			List<Cloud_deviceEntity> list = (List<Cloud_deviceEntity>) cloud_deviceRepository.searchDevicesByProjectid(model.getProjectid());
			if (!list.isEmpty()) {
				/* システム日時 */
				Timestamp systemTime = new Timestamp(System.currentTimeMillis());
				for (Cloud_deviceEntity entity:list) {
					// プロジェクト情報をクリアする
					entity.setProjectid(null);
					// グループ情報をクリアする
					entity.setGroupid(null);
					entity.setU_uid(model.getLoginInfo().getLoginuserid());
					entity.setU_time(systemTime);
				}
				// デバイス更新
				cloud_deviceRepository.saveAll(list);
			}
		return ;

	}

	/*
	 * デバイスのグループ情報をクリアする（グループ）
	 * @param loginInfo LoginInfo ログイン情報
	 * @param groupid Integer 削除対象グループID
	 *
	 */
	public void clearGroupInfoForDelete(LoginInfo loginInfo, Integer groupid) throws Exception {


		// デバイス一覧取得
		List<Cloud_deviceEntity> list = (List<Cloud_deviceEntity>) cloud_deviceRepository.searchDevicesByGroupid(groupid);
		if (!list.isEmpty()) {
			/* システム日時 */
			Timestamp systemTime = new Timestamp(System.currentTimeMillis());
			for (Cloud_deviceEntity entity:list) {
				// プロジェクト情報をクリアする
				entity.setProjectid(null);
				// グループ情報をクリアする
				entity.setGroupid(null);
				entity.setU_uid(loginInfo.getLoginuserid());
				entity.setU_time(systemTime);
			}
			// デバイス更新
			cloud_deviceRepository.saveAll(list);
		}
		return ;

	}

	/*
	 * デバイス削除
	 * @param model Cloud_deviceModel デバイス情報
	 *
	 */
	public void deleteDevice(Cloud_deviceModel model) throws Exception {
		// 会社IDを設定する
		this.setCompanyIDToModel(model);
		// デバイス削除
		if (cloud_deviceRepository.existsById(model.getDeviceid())) {
			cloud_deviceRepository.deleteById(model.getDeviceid());
		}
		return ;

	}

	/*
	 * デバイス選択削除
	 * @param deviceidlist List<Integer> デバイスIDリスト
	 * @return Integer 削除件数
	 *
	 */
	public Integer deleteDevices(List<Integer> deviceidlist) throws Exception {

		// 削除対象取得
		Iterable<Cloud_deviceEntity> list = cloud_deviceRepository.findAllById(deviceidlist);
		// 削除件数取得
		Integer returnCount = Util.size(list);
		// 削除実施
		cloud_deviceRepository.deleteAll(list);
		return returnCount;

	}

	/*
	 * デバイス一括削除
	 * @param model Cloud_deviceModel デバイス情報
	 * @return Integer 削除件数
	 *
	 */
	public Integer deleteAllCompanyDevices(Cloud_deviceModel model) throws Exception {

		// 削除対象取得
		List<Cloud_deviceEntity> list = cloud_deviceRepository.searchAllDevicesByCompanyid(model.getTargetUserInfo().getTargetuserCompanyid());
		// 削除件数取得
		Integer returnCount = Util.size(list);
		// 削除実施
		cloud_deviceRepository.deleteAll(list);
		return returnCount;

	}

	/*
	 * デバイス一括登録時プロジェクト存在チェック
	 * @param model Cloud_deviceModel デバイス情報
	 * @return List<Cloud_deviceDetailModel> デバイス情報リスト
	 *
	 */
	public List<Cloud_deviceDetailModel> checkProjectExistedInDB(Cloud_deviceModel model) throws Exception {

		List<Cloud_deviceDetailModel> returnList = new ArrayList<Cloud_deviceDetailModel>();
		for (Cloud_deviceDetailModel deviceDetailModel:model.getDeviceDetailList()) {
			if (deviceDetailModel.getProjectid() != null) {
				Optional<Cloud_projectEntity> entity = cloud_projectRepository.findById(deviceDetailModel.getProjectid());
				// 存在しない場合、
				if (!entity.isPresent()) {
					// 戻るリストに追加
					returnList.add(deviceDetailModel);
				}
			}
		}
		return returnList;

	}

	/*
	 * デバイス一括登録時プロダクト存在チェック
	 * @param model Cloud_deviceModel デバイス情報
	 * @return List<Cloud_deviceDetailModel> デバイス情報リスト
	 *
	 */
	public List<Cloud_deviceDetailModel> checkProductExistedInDB(Cloud_deviceModel model) throws Exception {

		List<Cloud_deviceDetailModel> returnList = new ArrayList<Cloud_deviceDetailModel>();
		for (Cloud_deviceDetailModel deviceDetailModel:model.getDeviceDetailList()) {
			Optional<Cloud_productEntity> entity = cloud_productRepository.findById(deviceDetailModel.getProductid());
			// 存在しない場合、
			if (!entity.isPresent()) {
				// 戻るリストに追加
				returnList.add(deviceDetailModel);
			}
		}
		return returnList;

	}

	/*
	 * デバイス一括登録時グループ存在チェック
	 * @param model Cloud_deviceModel デバイス情報
	 * @return List<Cloud_deviceDetailModel> デバイス情報リスト
	 *
	 */
	public List<Cloud_deviceDetailModel> checkGroupExistedInDB(Cloud_deviceModel model) throws Exception {

		List<Cloud_deviceDetailModel> returnList = new ArrayList<Cloud_deviceDetailModel>();
		for (Cloud_deviceDetailModel deviceDetailModel:model.getDeviceDetailList()) {
			if (deviceDetailModel.getGroupid() != null) {
				Optional<Cloud_groupEntity> entity = cloud_groupRepository.findById(deviceDetailModel.getGroupid());
				// 存在しない場合、
				if (!entity.isPresent()) {
					// 戻るリストに追加
					returnList.add(deviceDetailModel);
				}
			}
		}
		return returnList;

	}

	/*
	 * デバイス登録時IMEI存在チェック
	 * @param model Cloud_deviceModel デバイス情報
	 * @return List<Cloud_deviceDetailModel> デバイス情報リスト
	 *
	 */
	public List<Cloud_deviceDetailModel> checkImeiExistedInDB(Cloud_deviceModel model) throws Exception {

		List<Cloud_deviceDetailModel> returnList = new ArrayList<Cloud_deviceDetailModel>();

		List<String> imeiList = getImeiList(model);
		List<Cloud_deviceEntity> devices = cloud_deviceRepository.searchDevicesByImeiIn(imeiList);

		if (!devices.isEmpty()) {
			for (Cloud_deviceEntity entity:devices) {
				for (Cloud_deviceDetailModel deviceDetailModel:model.getDeviceDetailList()) {
					// 同じの場合、
					if (entity.getImei().equals(deviceDetailModel.getImei())) {
						// 戻るリストに追加
						returnList.add(deviceDetailModel);
					}
				}
			}
		}
		return returnList;
	}

	/*
	 * デバイス登録時SN存在チェック
	 * @param model Cloud_deviceModel デバイス情報
	 * @return List<Cloud_deviceDetailModel> デバイス情報リスト
	 *
	 */
	public List<Cloud_deviceDetailModel> checkSnExistedInDB(Cloud_deviceModel model) throws Exception {

		List<Cloud_deviceDetailModel> returnList = new ArrayList<Cloud_deviceDetailModel>();

		List<String> snList = getSnList(model);
		List<Cloud_deviceEntity> devices = cloud_deviceRepository.searchDeviceBySnIn(snList);

		if (!devices.isEmpty()) {
			for (Cloud_deviceEntity entity:devices) {
				for (Cloud_deviceDetailModel deviceDetailModel:model.getDeviceDetailList()) {
					// 同じの場合、
					if (entity.getSn().equals(deviceDetailModel.getSn())) {
						// 戻るリストに追加
						returnList.add(deviceDetailModel);
					}
				}
			}
		}
		return returnList;
	}

	/*
	 * デバイス登録時SIM_IMSI存在チェック
	 * @param model Cloud_deviceModel デバイス情報
	 * @return List<Cloud_deviceDetailModel> デバイス情報リスト
	 *
	 */
	public List<Cloud_deviceDetailModel> checkSim_imsiExistedInDB(Cloud_deviceModel model) throws Exception {

		List<Cloud_deviceDetailModel> returnList = new ArrayList<Cloud_deviceDetailModel>();

		List<String> sim_imsiList = getSim_imsiList(model);
		List<Cloud_deviceEntity> devices = cloud_deviceRepository.searchDeviceBySim_imsiIn(sim_imsiList);

		if (!devices.isEmpty()) {
			for (Cloud_deviceEntity entity:devices) {
				for (Cloud_deviceDetailModel deviceDetailModel:model.getDeviceDetailList()) {
					// 同じの場合、
					if (entity.getSim_imsi().equals(deviceDetailModel.getSim_imsi())) {
						// 戻るリストに追加
						returnList.add(deviceDetailModel);
					}
				}
			}
		}
		return returnList;
	}

	/*
	 * デバイス登録時SIM_ICCID存在チェック
	 * @param model Cloud_deviceModel デバイス情報
	 * @return List<Cloud_deviceDetailModel> デバイス情報リスト
	 *
	 */
	public List<Cloud_deviceDetailModel> checkSim_iccidExistedInDB(Cloud_deviceModel model) throws Exception {

		List<Cloud_deviceDetailModel> returnList = new ArrayList<Cloud_deviceDetailModel>();

		List<String> sim_iccidList = getSim_iccidList(model);
		List<Cloud_deviceEntity> devices = cloud_deviceRepository.searchDeviceBySim_iccidIn(sim_iccidList);

		if (!devices.isEmpty()) {
			for (Cloud_deviceEntity entity:devices) {
				for (Cloud_deviceDetailModel deviceDetailModel:model.getDeviceDetailList()) {
					// 同じの場合、
					if (entity.getSim_iccid().equals(deviceDetailModel.getSim_iccid())) {
						// 戻るリストに追加
						returnList.add(deviceDetailModel);
					}
				}
			}
		}
		return returnList;
	}

	/*
	 * デバイス登録時SIM_TEL存在チェック
	 * @param model Cloud_deviceModel デバイス情報
	 * @return List<Cloud_deviceDetailModel> デバイス情報リスト
	 *
	 */
	public List<Cloud_deviceDetailModel> checkSim_telExistedInDB(Cloud_deviceModel model) throws Exception {

		List<Cloud_deviceDetailModel> returnList = new ArrayList<Cloud_deviceDetailModel>();

		List<String> sim_telList = getSim_telList(model);
		List<Cloud_deviceEntity> devices = cloud_deviceRepository.searchDeviceBySim_telIn(sim_telList);

		if (!devices.isEmpty()) {
			for (Cloud_deviceEntity entity:devices) {
				for (Cloud_deviceDetailModel deviceDetailModel:model.getDeviceDetailList()) {
					// 同じの場合、
					if (entity.getSim_tel().equals(deviceDetailModel.getSim_tel())) {
						// 戻るリストに追加
						returnList.add(deviceDetailModel);
					}
				}
			}
		}
		return returnList;
	}

	/*
	 * IMEIリスト取得
	 */
	private List<String> getImeiList(Cloud_deviceModel model) throws Exception {

		List<String> list = new ArrayList<String>();
		for (Cloud_deviceDetailModel deviceDetailModel:model.getDeviceDetailList()) {
			// NULLでない場合、
			if (deviceDetailModel.getImei() != null && !deviceDetailModel.getImei().isEmpty()) {
				// 戻るリストに追加
				list.add(deviceDetailModel.getImei());
			}
		}
		return list;

	}

	/*
	 * SNリスト取得
	 */
	private List<String> getSnList(Cloud_deviceModel model) throws Exception {

		List<String> list = new ArrayList<String>();
		for (Cloud_deviceDetailModel deviceDetailModel:model.getDeviceDetailList()) {
			// NULLでない場合、
			if (deviceDetailModel.getSn() != null && !deviceDetailModel.getSn().isEmpty()) {
				// 戻るリストに追加
				list.add(deviceDetailModel.getSn());
			}
		}
		return list;

	}

	/*
	 * SIM_IMSIリスト取得
	 */
	private List<String> getSim_imsiList(Cloud_deviceModel model) throws Exception {

		List<String> list = new ArrayList<String>();
		for (Cloud_deviceDetailModel deviceDetailModel:model.getDeviceDetailList()) {
			// NULLでない場合、
			if (deviceDetailModel.getSim_imsi() != null && !deviceDetailModel.getSim_imsi().isEmpty()) {
				// 戻るリストに追加
				list.add(deviceDetailModel.getSim_imsi());
			}
		}
		return list;

	}

	/*
	 * SIM_ICCIDリスト取得
	 */
	private List<String> getSim_iccidList(Cloud_deviceModel model) throws Exception {

		List<String> list = new ArrayList<String>();
		for (Cloud_deviceDetailModel deviceDetailModel:model.getDeviceDetailList()) {
			// NULLでない場合、
			if (deviceDetailModel.getSim_iccid() != null && !deviceDetailModel.getSim_iccid().isEmpty()) {
				// 戻るリストに追加
				list.add(deviceDetailModel.getSim_iccid());
			}
		}
		return list;

	}

	/*
	 * SIM_TELリスト取得
	 */
	private List<String> getSim_telList(Cloud_deviceModel model) throws Exception {

		List<String> list = new ArrayList<String>();
		for (Cloud_deviceDetailModel deviceDetailModel:model.getDeviceDetailList()) {
			// NULLでない場合、
			if (deviceDetailModel.getSim_tel() != null && !deviceDetailModel.getSim_tel().isEmpty()) {
				// 戻るリストに追加
				list.add(deviceDetailModel.getSim_tel());
			}
		}
		return list;

	}

	/*
	 * EntityからDetailModel取得
	 * @param entity Cloud_deviceEntity
	 * @return Cloud_deviceDetailModel
	 *
	 */
	public Cloud_deviceDetailModel getDetailModelByEntity(Cloud_deviceEntity entity) throws Exception {
		Cloud_deviceDetailModel model = new Cloud_deviceDetailModel();
		model.setDeviceid(entity.getDeviceid());
		model.setProjectid(entity.getProjectid());
		model.setGroupid(entity.getGroupid());
		model.setDevicename(entity.getDevicename());
		model.setImei(entity.getImei());
		model.setSn(entity.getSn());
		model.setSim_iccid(entity.getSim_iccid());
		model.setSim_imsi(entity.getSim_imsi());
		model.setSim_tel(entity.getSim_tel());
		model.setEncryptedcommunications(entity.getEncryptedcommunications());
		model.setEncryptedkey(entity.getEncryptedkey());
		model.setConnectserverurl(entity.getConnectserverurl());
		model.setConnectserverport(entity.getConnectserverport());
		model.setBindingflag(entity.getBindingflag());
		model.setFmlastestversion(entity.getFmlastestversion());
		model.setVersioncomfirmtime(entity.getVersioncomfirmtime());
		model.setCompanyid(entity.getCompanyid());
		model.setUserid(entity.getUserid());
		model.setLastprojectId(entity.getLastprojectId());
		model.setLastgroupid(entity.getLastgroupid());
		model.setAlive(entity.getAlive());

		// プロダクト情報取得
		Optional<Cloud_productEntity> productEntity  = cloud_productRepository.findById(entity.getProductid());
		model.setProductid(entity.getProductid());
		model.setProductcode(productEntity.get().getProductcode());
		model.setProductname(productEntity.get().getProductname());

		// 会社情報取得
		Optional<Cloud_companyEntity> companyEntity  = cloud_companyRepository.findById(entity.getCompanyid());
		model.setIndustry(companyEntity.get().getIndustry());
		model.setCompanyname(companyEntity.get().getCompanyname());

		return model;

	}

	/*
	 * EntityからModel取得
	 * @param entity Cloud_deviceEntity
	 * @return Cloud_deviceModel
	 *
	 */
	public Cloud_deviceModel getModelByEntity(Cloud_deviceEntity entity) throws Exception {
		Cloud_deviceModel model = new Cloud_deviceModel();
		model.setDeviceid(entity.getDeviceid());
		model.setProjectid(entity.getProjectid());
		model.setGroupid(entity.getGroupid());
		model.setDevicename(entity.getDevicename());
		model.setImei(entity.getImei());
		model.setSn(entity.getSn());
		model.setSim_iccid(entity.getSim_iccid());
		model.setSim_imsi(entity.getSim_imsi());
		model.setSim_tel(entity.getSim_tel());
		model.setEncryptedcommunications(entity.getEncryptedcommunications());
		model.setEncryptedkey(entity.getEncryptedkey());
		model.setConnectserverurl(entity.getConnectserverurl());
		model.setConnectserverport(entity.getConnectserverport());
		model.setBindingflag(entity.getBindingflag());
		model.setFmlastestversion(entity.getFmlastestversion());
		model.setVersioncomfirmtime(entity.getVersioncomfirmtime());
		model.setCompanyid(entity.getCompanyid());
		model.setProductid(entity.getProductid());

		// 会社名
		Optional<Cloud_companyEntity> company = cloud_companyRepository.findById(entity.getCompanyid());
		if (!company.isEmpty()) {	model.setCompanyname(company.get().getCompanyname());}

		// プロダクト名
		if (entity.getProductid() != null) {
			Optional<Cloud_productEntity> product = cloud_productRepository.findById(entity.getProductid());
			if (!product.isEmpty()) {	model.setProductname(product.get().getProductname());}
		}
		// プロジェクト名
		if (entity.getProjectid() != null) {
			Optional<Cloud_projectEntity> project = cloud_projectRepository.findById(entity.getProjectid());
			if (!project.isEmpty()) {	model.setProjectname(project.get().getProjectname());}

		}
		// グループ名
		if (entity.getGroupid() != null) {
			Optional<Cloud_groupEntity> group = cloud_groupRepository.findById(entity.getGroupid());
			if (!group.isEmpty()) {		model.setGroupname(group.get().getGroupname());	}
		}

		model.setUserid(entity.getUserid());
		model.setLastprojectId(entity.getLastprojectId());
		model.setLastgroupid(entity.getLastgroupid());
		model.setAlive(entity.getAlive());

		return model;

	}

	/*
	 * EntityリストからModeリストl取得
	 * @param entityList List<Cloud_deviceEntity> Entityリスト
	 * @return List<Cloud_deviceModel> Modeリスト
	 *
	 */
	public List<Cloud_deviceModel> getModelsByEntitys(List<Cloud_deviceEntity> entityList) throws Exception {
		List<Cloud_deviceModel> modelList = new ArrayList<Cloud_deviceModel>();
		for (Cloud_deviceEntity entity:entityList) {
			modelList.add(getModelByEntity(entity));
		}

		return modelList;

	}

	/*
	 * 会社IDを設定する
	 * @param model Cloud_deviceModel デバイス情報
	 *
	 */
	public void setCompanyIDToModel(Cloud_deviceModel model) throws Exception {

		// 自分自身なら
		if (model.getTargetUserInfo().getTargetuserid() == model.getLoginInfo().getLoginuserid()) {
			// 自社IDを設定する
			model.getTargetUserInfo().setTargetuserCompanyid(model.getLoginInfo().getLogincompanyid());
		} else {
			// ターゲットユーザーの会社IDを取得する
			Optional<Cloud_userEntity> cloud_userEntity = cloud_userRepository.findById(model.getTargetUserInfo().getTargetuserid());
			// ターゲットユーザーの会社IDを設定する
			model.getTargetUserInfo().setTargetuserCompanyid(cloud_userEntity.get().getCompanyid());
		}

	}

	/*
	 * 全社のデバイス一覧取得(ダッシュボード用)
	 * @param useridList List<Integer> ユーザーIDリスト
	 * @return List<Cloud_deviceModel> デバイス一覧
	 *
	 */
	public List<Cloud_deviceModel> getUnderCompanyDevicesByUserids(List<Integer> useridList) throws Exception {

		// 全社のデバイス一覧取得
		List<Cloud_deviceEntity> list = cloud_deviceRepository.searchUnderCompanyDevicesByUseridIn(useridList);
		return this.getModelsByEntitys(list);

	}

	/*
	 * 全社のプロダクトタイプ別デバイス一覧取得(ダッシュボード用)
	 * @param producttype String プロダクトタイプ
	 * @param useridList List<Integer> ユーザーIDリスト
	 * @return List<Cloud_deviceModel> デバイス一覧
	 *
	 */
	public List<Cloud_deviceModel> getUnderCompanyDevicesByProducttypeAndUserids(String producttype, List<Integer> useridList) throws Exception {

		// 全社のデバイス一覧取得
		List<Cloud_deviceEntity> list = cloud_deviceRepository.searchUnderCompanyDevicesByProducttypeAndUseridIn(producttype, useridList);
		return this.getModelsByEntitys(list);

	}

	/*
	 * ModelからEntity取得
	 * @param entity Cloud_deviceEntity
	 * @return Cloud_deviceModel
	 *
	 */
	private Cloud_deviceEntity getEntitByModel(Cloud_deviceModel model) throws Exception {

		Cloud_deviceEntity entity = new Cloud_deviceEntity();

		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());

		// 情報設定
//		entity.setProjectid(CommonConstant.PROJECT_NOT_SET);
//		entity.setGroupid(CommonConstant.GROUP_NOT_SET);
		entity.setDevicename(model.getDevicename());
		entity.setImei(model.getImei());
		entity.setSn(model.getSn());
		entity.setSim_iccid(model.getSim_iccid());
		entity.setSim_imsi(model.getSim_imsi());
		entity.setSim_tel(model.getSim_tel());
		entity.setEncryptedcommunications(model.getEncryptedcommunications());
		entity.setEncryptedkey(model.getEncryptedkey());
		entity.setConnectserverurl(model.getConnectserverurl());
		entity.setConnectserverport(model.getConnectserverport());
		entity.setBindingflag(model.getBindingflag());
		entity.setFmlastestversion(model.getFmlastestversion());
		entity.setVersioncomfirmtime(model.getVersioncomfirmtime());
		entity.setCompanyid(model.getTargetUserInfo().getTargetuserCompanyid());
		entity.setUserid(model.getTargetUserInfo().getTargetuserid());
//		entity.setLastprojectId(CommonConstant.PROJECT_NOT_SET);
//		entity.setLastgroupid(CommonConstant.GROUP_NOT_SET);
		entity.setAlive(AliveConstant.ALIVE);
		entity.setI_uid(model.getLoginInfo().getLoginuserid());
		entity.setI_time(systemTime);
		entity.setU_uid(model.getLoginInfo().getLoginuserid());
		entity.setU_time(systemTime);

		return entity;

	}

	/*
	 * DetailModelからEntity取得(登録用)
	 * @param entity Cloud_deviceEntity
	 * @return Cloud_deviceDetailModel
	 *
	 */
	private Cloud_deviceEntity getEntitByDetailModel(Cloud_deviceDetailModel model,LoginInfo loginInfo) throws Exception {

		Cloud_deviceEntity entity = new Cloud_deviceEntity();

		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());

		// 情報設定
		if (model.getProjectid() != null) {
			entity.setProjectid(model.getProjectid());
		}

		if (model.getGroupid() != null) {
			entity.setGroupid(model.getGroupid());
		}

		entity.setDevicename(model.getDevicename());
		entity.setImei(model.getImei());
		entity.setSn(model.getSn());
		entity.setSim_iccid(model.getSim_iccid());
		entity.setSim_imsi(model.getSim_imsi());
		entity.setSim_tel(model.getSim_tel());
		entity.setProductid(model.getProductid());
		entity.setCompanyid(model.getCompanyid());

		// ユーザID設定
		if (model.getUserid() != null) {
			entity.setUserid(model.getUserid());
		} else {
			entity.setUserid(loginInfo.getLoginuserid());
		}

		entity.setEncryptedcommunications(model.getEncryptedcommunications());
		entity.setEncryptedkey(model.getEncryptedkey());
		entity.setConnectserverurl(model.getConnectserverurl());
		entity.setConnectserverport(model.getConnectserverport());
		entity.setBindingflag(model.getBindingflag());
//		entity.setFmlastestversion(model.getFmlastestversion());
//		entity.setVersioncomfirmtime(model.getVersioncomfirmtime());
//		entity.setLastprojectId(CommonConstant.PROJECT_NOT_SET);
//		entity.setLastgroupid(CommonConstant.GROUP_NOT_SET);
		entity.setAlive(AliveConstant.ALIVE);
		entity.setI_uid(loginInfo.getLoginuserid());
		entity.setI_time(systemTime);
		entity.setU_uid(loginInfo.getLoginuserid());
		entity.setU_time(systemTime);

		return entity;

	}

	/*
	 * ModelからEntity取得(更新用)
	 * @param entity Cloud_deviceEntity
	 * @return Cloud_deviceModel
	 *
	 */
	private Cloud_deviceEntity getEntitByModelForUpdate(Cloud_deviceModel model) throws Exception {

		Optional<Cloud_deviceEntity> value = cloud_deviceRepository.findById(model.getDeviceDetail().getDeviceid());

		Cloud_deviceEntity entity = value.get();

		/* システム日時 */
		Timestamp systemTime = new Timestamp(System.currentTimeMillis());

		// 情報設定
//		entity.setProjectid(model.getProjectid());
		entity.setGroupid(model.getGroupid());
		entity.setDevicename(model.getDeviceDetail().getDevicename());
//		entity.setImei(model.getImei());
//		entity.setSn(model.getSn());
		entity.setSim_iccid(model.getDeviceDetail().getSim_iccid());
		entity.setProductid(model.getDeviceDetail().getProductid());
		entity.setSim_imsi(model.getDeviceDetail().getSim_imsi());
		entity.setSim_tel(model.getDeviceDetail().getSim_tel());
//		entity.setEncryptedcommunications(model.getEncryptedcommunications());
//		entity.setEncryptedkey(model.getEncryptedkey());
//		entity.setConnectserverurl(model.getConnectserverurl());
//		entity.setConnectserverport(model.getConnectserverport());
//		entity.setBindingflag(model.getBindingflag());
//		entity.setFmlastestversion(model.getFmlastestversion());
//		entity.setVersioncomfirmtime(model.getVersioncomfirmtime());
//		entity.setCompanyid(model.getTargetUserInfo().getTargetuserCompanyid());
//		entity.setUserid(model.getTargetUserInfo().getTargetuserid());
//		entity.setLastprojectId(model.getLastprojectId());
//		entity.setLastgroupid(model.getLastgroupid());
//		entity.setAlive(model.getAlive());

		// ユーザIDを設定
		entity.setUserid(model.getUserid());
		entity.setU_uid(model.getLoginInfo().getLoginuserid());
		entity.setU_time(systemTime);

		return entity;

	}
}
