package com.xiaour.spring.boot.utils;

import org.springframework.util.DigestUtils;

public class Md5Util {

	public static String getMd5(String inStr) {
		return DigestUtils.md5DigestAsHex(inStr.getBytes());
	}

	public static String conver(String inStr) {
		char[] a = inStr.toCharArray();
        for (int i = 0; i < a.length; i++){
            a[i] = (char) (a[i] ^ 't');
        }
        String s = new String(a);
        return s;
	}


}
