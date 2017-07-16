package com.github.test;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.github.maventest.module.entity.User;

public class LombokTest {

	@Before
	public void setUp() {
		System.out.println("be");
	}
	
	@After
	public void tearDown() {
		
		System.out.println("after");
		
	}

	@Test
	public void testUser() {

		User user = new User();
		
		user.setFirstName("d").setId(1L).setLastName("hh");
		
		System.out.println(user.getFirstName());
		
	}

}
