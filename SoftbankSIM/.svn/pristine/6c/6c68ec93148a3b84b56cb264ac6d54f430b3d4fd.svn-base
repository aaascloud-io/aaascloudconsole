package com.xiaour.spring.boot.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.xiaour.spring.boot.entity.CardInfo;
import com.xiaour.spring.boot.service.CardService;

/**
 * Created by fengwei.jiang
 */
@RestController
@RequestMapping("/ajax")
public class DeviceController extends BaseController {

	@Resource
	private CardService cardService;

	@RequestMapping(value = "/list")
	public Object list() {
		Map<String, Object> map = new HashMap<String, Object>();
		List<CardInfo> carInfos = cardService.getCardInfo();
		map.put("data", carInfos);
		return map;
	}

	@RequestMapping(value = "/adddev", method = RequestMethod.POST)
	public Object adddev(String no,String ukeirebi,
			String kubun,
			String imei,
			String kanribango,
			String tenwabango, String hakkotanto, String hakkobi,
			String hakkosaki,
			String hakkosakitantosha, String renrakusen, String riyokaishibi,
			String riyomokuteki,
			String gaiyo, String biko) throws Exception {
		cardService.addCardInfo(getCardInfo("add", ukeirebi, kubun, imei, kanribango, tenwabango,
				hakkotanto,
				hakkobi, hakkosakitantosha, hakkosakitantosha, renrakusen, riyokaishibi, riyomokuteki, gaiyo, biko));
		return "sucess";

	}

	@RequestMapping(value = "/editdev", method = RequestMethod.POST)
	public String editdev(String no, String ukeirebi,
			String kubun,
			String imei,
			String kanribango,
			String tenwabango, String hakkotanto, String hakkobi,
			String hakkosaki,
			String hakkosakitantosha, String renrakusen, String riyokaishibi,
			String riyomokuteki,
			String gaiyo, String biko) throws Exception {
		cardService.updateCardInfo(getCardInfo(no, ukeirebi, kubun, imei, kanribango, tenwabango,
				hakkotanto,
				hakkobi, hakkosaki, hakkosakitantosha, renrakusen, riyokaishibi, riyomokuteki, gaiyo, biko));

		return "sucess";

	}

	@RequestMapping(value = "/deldev", method = RequestMethod.POST)
	public String deldev(String no) throws Exception {
		CardInfo cardInfo = new CardInfo();
		cardInfo.setNo(Integer.valueOf(no));
		cardService.deleteCardInfo(cardInfo);

		return "sucess";

	}

	private CardInfo getCardInfo(String no, String ukeirebi, String kubunn, String imei, String kanribango,
			String tenwabango,
			String hakkotanto, String hakkobi, String hakkosaki, String hakkosakitantosha, String renrakusen,
			String riyokaishibi,
			String riyomokuteki, String gaiyo, String biko) {
		CardInfo cardInfo = new CardInfo();
		if (!no.equals("add")) {
			cardInfo.setNo(Integer.valueOf(no));
		}
		if (!ukeirebi.equals("")) {
			cardInfo.setUkeirebi(ukeirebi);
		}
		cardInfo.setKubun(kubunn);
		cardInfo.setImei(imei);
		cardInfo.setKanribango(kanribango);
		cardInfo.setTenwabango(tenwabango);
		cardInfo.setHakkotanto(hakkotanto);
		if (!hakkobi.equals("")) {
			cardInfo.setHakkobi(hakkobi);
		}
		cardInfo.setHakkosaki(hakkosaki);
		cardInfo.setHakkosakitantosha(hakkosakitantosha);
		cardInfo.setRenrakusen(renrakusen);
		if (!riyokaishibi.equals("")) {
			cardInfo.setRiyokaishibi(riyokaishibi);
		}
		cardInfo.setRiyomokuteki(riyomokuteki);
		cardInfo.setGaiyo(gaiyo);
		cardInfo.setBiko(biko);
		return cardInfo;
	}

}
