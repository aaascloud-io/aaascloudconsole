package com.ifocus.aaascloud.injector;

import com.ifocus.aaascloud.api.common.BaseHttpResponse;
import com.ifocus.aaascloud.constant.ErrorConstant;
import com.ifocus.aaascloud.exception.BusinessException;
import com.ifocus.aaascloud.exception.ValidationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;

import javax.persistence.PersistenceException;

@ControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(PersistenceException.class)
    @ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public BaseHttpResponse<?> handleDbAccessError(PersistenceException e, WebRequest req, Object handler) {
        BaseHttpResponse<String> response = new BaseHttpResponse<>();
        response.setResultCode(ErrorConstant.ERROR_CODE_9999);
        response.setResultMsg(e.getMessage());
        return response;
    }

    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    @ResponseBody
    public BaseHttpResponse<?> handleValidationError(ValidationException e, WebRequest req, Object handler) {
        BaseHttpResponse<String> response = new BaseHttpResponse<>();
        response.setResultCode(e.getCode());
        response.setResultMsg(e.getMessage());

//        StackTraceElement stackTraceElement= e.getStackTrace()[0];
//        System.out.println("File="+stackTraceElement.getFileName());
//        System.out.println("Line="+stackTraceElement.getLineNumber());
//        System.out.println("Method="+stackTraceElement.getMethodName());

        return response;
    }

    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    @ResponseBody
    public BaseHttpResponse<?> handleBusinessError(ValidationException e, WebRequest req, Object handler) {
        BaseHttpResponse<String> response = new BaseHttpResponse<>();
        response.setResultCode(e.getCode());
        response.setResultMsg(e.getMessage());
        return response;
    }

}