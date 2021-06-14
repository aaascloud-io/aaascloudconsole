package com.ifocus.aaascloud.exception;

import lombok.Data;

@Data
public class ApiBaseException extends RuntimeException {

    protected String code;


    public ApiBaseException() {
        super();
    }

    public ApiBaseException(String message) {
        this(null, message);
    }

    public ApiBaseException(String message, Throwable cause) {
        this(null, message, cause);
    }

    public ApiBaseException(Throwable cause) {
        super(cause);
    }

    public ApiBaseException(String code, String message) {
        super(message);
        this.code = code;
    }

    public ApiBaseException(String code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }

}