package com.github.maventest.module.entity;

import lombok.Data;
import lombok.experimental.Accessors;
@Accessors(chain=true)
@Data
public class User {
	
	private Long id;
	
	private String firstName;
	
	private String lastName;

}
