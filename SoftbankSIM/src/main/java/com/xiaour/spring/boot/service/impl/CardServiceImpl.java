package com.xiaour.spring.boot.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.xiaour.spring.boot.entity.CardInfo;
import com.xiaour.spring.boot.mapper.CardMapper;
import com.xiaour.spring.boot.service.CardService;

@Service
public class CardServiceImpl implements CardService{

	@Autowired
	CardMapper cardMapper;

	@Override
	public List<CardInfo> getCardInfo() {
		return cardMapper.getCardInfo();
	}

	public int addCardInfo(CardInfo cardInfo) {

		return cardMapper.addCardInfo(cardInfo);
	}

	public int updateCardInfo(CardInfo cardInfo) {

		return cardMapper.updateCardInfo(cardInfo);
	}

	public int deleteCardInfo(CardInfo cardInfo) {

		return cardMapper.deleteCardInfo(cardInfo);
	}

}
