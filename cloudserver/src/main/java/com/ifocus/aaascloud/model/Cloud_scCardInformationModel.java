package com.ifocus.aaascloud.model;

import lombok.Data;

import java.util.List;

@Data
public class Cloud_scCardInformationModel {
    private List<CardInformation> list;

    @Data
    public static class CardInformation{
        private Integer no;
        private String ukeirebi;
        private String kubun;
        private String imei;
        private String kanribango;
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
    }

}
