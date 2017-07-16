package com.github.maventest.module.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.maventest.module.entity.User;
import com.github.maventest.module.mapper.UserMapper;
import com.github.maventest.module.service.UserService;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired(required=false)
	private UserMapper userMapper;
	
	public List<User> selectUsers() {
		
		return userMapper.selectUsers();
	}
	

}
