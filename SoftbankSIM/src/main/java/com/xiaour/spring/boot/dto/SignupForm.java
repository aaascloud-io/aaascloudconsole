package com.xiaour.spring.boot.dto;

import lombok.Data;

@Data
public class SignupForm {
    public String username;
    public String password;
    public String validateCode;

}
