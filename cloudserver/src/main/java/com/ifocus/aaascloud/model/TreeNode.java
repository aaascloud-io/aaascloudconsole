package com.ifocus.aaascloud.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TreeNode<T> implements Serializable {
    private T data;
    private List<T> children;
}