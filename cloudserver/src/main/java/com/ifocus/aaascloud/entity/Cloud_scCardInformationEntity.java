package com.ifocus.aaascloud.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.sql.Timestamp;

@Data
@Entity
@javax.persistence.Table(name="card_information")
public class Cloud_scCardInformationEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer no;
    private Timestamp ukeirebi;
    private String kubun;
    private String imei;
    private String kanribango;
    private String tenwabango;
    private String hakkotanto;
    private Timestamp hakkobi;
    private String hakkosaki;
    private String hakkosakitantosha;
    private String renrakusen;
    private Timestamp riyokaishibi;
    private String riyomokuteki;
    private String gaiyo;
    private String biko;
    private Integer deleteflg;
}
