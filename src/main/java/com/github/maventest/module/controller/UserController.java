package com.github.maventest.module.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.github.maventest.module.entity.User;
import com.github.maventest.module.service.UserService;

@RequestMapping(value="/users")
@Controller
@SessionAttributes(value="user")
public class UserController {
	
	
	@Autowired UserService userService;
	
	@RequestMapping(value="/all", method=RequestMethod.GET)
	@ResponseBody
	public List<User> users() {
		List<User> users = userService.selectUsers();
		return users;
	}
	
	@RequestMapping(value="/chart", method=RequestMethod.GET)
	public String chart() {
		return "chart";
	}
	
	
	

}
 