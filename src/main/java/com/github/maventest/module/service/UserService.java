package com.github.maventest.module.service;

import java.util.List;

import com.github.maventest.module.entity.User;

public interface UserService {
	List<User> selectUsers();
}
