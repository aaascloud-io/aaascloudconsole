package com.ifocus.aaascloud.model;

import lombok.Data;

import java.util.List;

@Data
public class Cloud_scCardInformationModel {
    private List<TreeNode<CardInformation>> list;

    @Data
    public static class CardInformation{
        public Integer no;
        public String ukeirebi;
        public String kubun;
        public String imei;
        public String kanribango;
        public String tenwabango;
        public String hakkotanto;
        public String hakkobi;
        public String hakkosaki;
        public String hakkosakitantosha;
        public String renrakusen;
        public String riyokaishibi;
        public String riyomokuteki;
        public String gaiyo;
        public String biko;
    }

}
