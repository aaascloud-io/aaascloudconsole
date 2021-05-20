package com.ifocus.aaascloud.constant.division;

import com.ifocus.aaascloud.util.EnumUtils;

public enum RoleDivision {
    /** 会社管理者 */
    COMPANY_MANAGER("0", "会社管理者"),
    /** 管理者 */
    MANAGER("1", "管理者"),
    /** 担当者 */
    PERSON("2", "担当者"),
    /** 顧客 */
    CLIENT("9", "顧客");

    private String value;
    private String name;

    private RoleDivision(String value, String name) {
        this.value = value;
        this.name = name;
    }

    public static RoleDivision of(String value) {
        return EnumUtils.of(values(), e -> e.value, value);
    }

    public String getName() {
        return name;
    }

    public String getValue() {
        return value;
    }
}