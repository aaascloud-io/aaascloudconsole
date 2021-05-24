package com.ifocus.aaascloud.repository;

import com.ifocus.aaascloud.entity.Cloud_scUserEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Cloud_scUserRepository extends CrudRepository<Cloud_scUserEntity, Integer> {
}
