package com.policourt.springboot;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/test")
public class TestController {
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
    
}
