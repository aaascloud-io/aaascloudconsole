package com.ifocus.aaascloud.exception;

public class ValidationException extends ApiBaseException {

    public ValidationException() {
        super();
    }

    public ValidationException(String message) {
        this(null, message);
    }

    public ValidationException(String message, Throwable cause) {
        this(null, message, cause);
    }

    public ValidationException(Throwable cause) {
        super(cause);
    }

    public ValidationException(String code, String message) {
        super(message);
        this.code = code;
    }

    public ValidationException(String code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }

}
