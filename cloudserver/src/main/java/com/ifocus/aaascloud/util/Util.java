package com.ifocus.aaascloud.util;

import java.util.Collection;

public class Util {

	public static int size(Iterable data) {

	    if (data instanceof Collection) {
	        return ((Collection<?>) data).size();
	    }
	    int counter = 0;
	    for (Object i : data) {
	        counter++;
	    }
	    return counter;
	}


}
