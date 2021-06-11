package com.ifocus.aaascloud.model;

import lombok.Data;

import java.io.Serializable;

@Data
public class Cloud_scCardInformationModel implements Serializable {

    private Integer no;
    private String ukeirebi;
    private String kubun;
    private String iccid;
    private String kanribango;
    private String imsi;
    private String tenwabango;
    private String hakkotanto;
    private String hakkobi;
    private String hakkosaki;
    private String hakkosakitantosha;
    private String renrakusen;
    private String riyokaishibi;
    private String riyomokuteki;
    private String gaiyo;
    private String biko;
    private Integer deleteflg;

}
