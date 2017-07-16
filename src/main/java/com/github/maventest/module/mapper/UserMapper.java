package com.github.maventest.module.mapper;

import java.util.List;

import com.github.maventest.module.entity.User;


public interface UserMapper {
	
	List<User> selectUsers();

}
