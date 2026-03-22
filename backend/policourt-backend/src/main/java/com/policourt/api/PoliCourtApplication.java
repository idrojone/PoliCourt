package com.policourt.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PoliCourtApplication {

	public static void main(String[] args) {
		SpringApplication.run(PoliCourtApplication.class, args);
	}

}
