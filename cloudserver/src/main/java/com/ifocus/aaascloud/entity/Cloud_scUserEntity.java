package com.ifocus.aaascloud.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Data
@Entity
@javax.persistence.Table(name="sc_user")
public class Cloud_scUserEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer uid;
    private String loginid;
    private String password;
    private String company;
    private String address;
    private Integer industry;
    private String mail;
    private String tel;
}
