//package com.gamestore_back.config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class CustomServletConfig implements WebMvcConfigurer {
//
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/api/**")
//                .allowedOrigins("http://localhost:3000") //  React 개발 서버의 URL
//                .allowedMethods("*") // 모든 HTTP 메서드 허용
//                .allowedHeaders("*") // 모든 요청 헤더 허용
//                .allowCredentials(true); // 인증 정보는 허용하지 않음
//    }
//}
