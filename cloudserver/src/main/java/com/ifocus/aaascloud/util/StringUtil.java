package com.ifocus.aaascloud.util;

import java.util.Objects;

public class StringUtil {

    /**
     * 空（nullを含む）文字列の判断処理を行う
     *
     * @param target 指定した文字列
     * @return true: 空
     */
    public static boolean isEmpty(String target) {
        return Objects.isNull(target) || "".equals(target);
    }

    /**
     * 空以外文字列の判断処理を行う
     *
     * @param target 指定した文字列
     * @return true: 空ではない
     */
    public static boolean isNotEmpty(String target) {
        return !isEmpty(target);
    }

}