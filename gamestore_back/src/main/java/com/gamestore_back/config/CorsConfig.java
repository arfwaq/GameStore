//package com.gamestore_back.config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class CorsConfig implements WebMvcConfigurer {
//
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        // 모든 경로에 대해 CORS 허용
//        registry.addMapping("/**")
//                // 프론트엔드 도메인 허용 (localhost:3000)
//                .allowedOrigins("http://localhost:3000")
//                // 허용할 HTTP 메서드 지정
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                // 모든 헤더 허용
//                .allowedHeaders("*")
//                // 인증 정보(쿠키 등) 허용
//                .allowCredentials(true);
//    }
//}
