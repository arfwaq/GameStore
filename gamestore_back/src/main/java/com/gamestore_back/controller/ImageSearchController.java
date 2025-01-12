package com.gamestore_back.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.Map;

@RestController
@RequestMapping("/api/images")
public class ImageSearchController {

    @Value("${flask.server.url}") // application.properties에 Flask 서버 URL 설정
    private String flaskServerUrl;

    @PostMapping("/similar-search") // 요청 경로 명확히 지정
    public ResponseEntity<?> searchImage(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println("Spring Boot: 이미지 수신 성공");

            // Flask URL 설정
            String flaskUrl = flaskServerUrl + "/predict";

            // 요청 헤더 및 바디 구성
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            });

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // RestTemplate을 사용하여 Flask로 요청 전송
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl, requestEntity, Map.class);

            System.out.println("Spring Boot: Flask로부터 응답 수신 완료");
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이미지 검색 중 오류 발생: " + e.getMessage());
        }
    }
}