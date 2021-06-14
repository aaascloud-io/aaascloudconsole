package com.ifocus.aaascloud.exception;

public class BusinessException extends ApiBaseException {

    public BusinessException() {
        super();
    }

    public BusinessException(String message) {
        this(null, message);
    }

    public BusinessException(String message, Throwable cause) {
        this(null, message, cause);
    }

    public BusinessException(Throwable cause) {
        super(cause);
    }

    public BusinessException(String code, String message) {
        super(message);
        this.code = code;
    }

    public BusinessException(String code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }

}