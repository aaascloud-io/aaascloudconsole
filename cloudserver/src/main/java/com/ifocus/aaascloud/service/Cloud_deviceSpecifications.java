package com.ifocus.aaascloud.service;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.relational.core.sql.Join.JoinType;
import org.springframework.stereotype.Service;

import com.ifocus.aaascloud.entity.Cloud_deviceEntity;
import com.ifocus.aaascloud.model.Cloud_deviceModel;

import org.springframework.util.StringUtils;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.math.BigDecimal;

@Service
public class Cloud_deviceSpecifications {
	
    // companyidを含むものを検索
    public static Specification<Cloud_deviceEntity> companyidContains(Cloud_deviceModel model) {
        return model.getCompanyid() == null ? null: new Specification<Cloud_deviceEntity>() {
            @Override
            public Predicate toPredicate(Root<Cloud_deviceEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                return cb.equal(root.get("companyid"), model.getCompanyid());
            }
        };
    }
    
//    private Specification<Cloud_deviceEntity> productNameContains(Cloud_deviceModel model) {
//        return model.getProductname()  == null? null : new Specification<Cloud_deviceEntity>() {
//            @Override
//            public Predicate toPredicate(Root<Cloud_deviceEntity> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
//                return criteriaBuilder.equal(root.join("cloud_product", JoinType.LEFT_OUTER_JOIN).get("productname"), model.getProductname());
//            }
//        };
//    }

}
