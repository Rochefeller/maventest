package com.github.test;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.pool.DruidPooledConnection;
import com.github.maventest.module.entity.User;
import com.github.maventest.module.service.UserService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"classpath:applicationContext.xml"})
public class UserServiceImplTest {
	
	@Autowired
	private UserService userService;
	@Autowired
	private DruidDataSource du;
	@Test
	public void testSelectUsers() {
		
		System.out.println(userService);
		List<User> users = userService.selectUsers();
		User usera = users.get(0);
		
		System.out.println(usera.getId());
		System.out.println(usera.getFirstName());
		System.out.println(usera.getLastName());
		
//		long count = users.stream().filter(u -> u.getLastName() == null).count();
//		System.out.println(count);
//		Map<String, List<User>> map = new HashMap<>();
//		for (User user : users) {
//			if(map.get(user.getFirstName()) == null) {
//				List<User> uses = new ArrayList<>();
//				users.add(user);
//				map.put(user.getFirstName(), users);
//			}else {
//				
//				map.get(user.getFirstName()).add(user);
//			}
//		}
//		Map<String, List<User>> collect = users.stream().collect(Collectors.groupingBy(User::getFirstName));
//		
//		System.out.println(map.size()  + " " + collect.size());
	}
	
	@Test
	public void testDB() throws SQLException {
		Set<DruidPooledConnection> activeConnections = du.getActiveConnections();
		DruidPooledConnection connection = du.getConnection();
		System.out.println(connection);
		System.out.println(activeConnections.size());
	}

}
