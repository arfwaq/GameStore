package com.gamestore_back.service;

import com.gamestore_back.domain.GamingEquipment;
import com.gamestore_back.dto.GamingEquipmentDTO;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.List;

@SpringBootTest
public class GamingEquipmentServiceTest {

    @Autowired
    private GamingEquipmentService service;

    private static final String CLIENT_ID = "EKPhPIREFI2xU8sQvqtw";
    private static final String CLIENT_SECRET = "22puCoyUuG";
    private static final String BASE_URL = "https://openapi.naver.com/v1/search/shop.json";
    @Test
    public void testFetchAndSave() {
        // 검색 키워드 목록
        String[] categories = {
                "게이밍 마우스", "게이밍 키보드", "게이밍 모니터", "게이밍 모니터 암",
                "게이밍 헤드셋", "게이밍 스피커", "게이밍 장패드", "게이밍 패드",
                "레이싱 휠", "조이스틱", "아케이드 스틱", "모션 컨트롤러",
                "VR 헤드셋", "VR 센서", "VR 글러브", "게이밍 의자",
                "스트리밍 장비", "RGB 조명", "게이밍 데스크"
        };

        for (String category : categories) {
            fetchAndSaveCategory(category, 150); // 각 카테고리에서 150개 데이터 저장
        }

        // 저장된 데이터 확인
        List<GamingEquipmentDTO> equipments = service.getAllEquipments();
        equipments.forEach(System.out::println);
    }

    private void fetchAndSaveCategory(String query, int targetCount) {
        int fetchedCount = 0; // 현재까지 가져온 데이터 수
        int start = 1;        // 네이버 API의 start 값

        while (fetchedCount < targetCount) {
            try {
                // API 호출
                String apiUrl = BASE_URL + "?query=" + URLEncoder.encode(query, "UTF-8")
                        + "&display=30&start=" + start;
                HttpURLConnection connection = (HttpURLConnection) new URL(apiUrl).openConnection();
                connection.setRequestMethod("GET");
                connection.setRequestProperty("X-Naver-Client-Id", CLIENT_ID);
                connection.setRequestProperty("X-Naver-Client-Secret", CLIENT_SECRET);

                int responseCode = connection.getResponseCode();
                if (responseCode == 200) { // 성공
                    BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(),"UTF-8"));
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = in.readLine()) != null) {
                        response.append(line);
                    }
                    in.close();

                    // JSON 파싱 및 저장
                    JSONObject jsonObject = new JSONObject(response.toString());
                    JSONArray items = jsonObject.getJSONArray("items");

                    for (int i = 0; i < items.length(); i++) {
                        if (fetchedCount >= targetCount) break; // 목표 개수만큼 가져오면 중단

                        JSONObject item = items.getJSONObject(i);

                        // 데이터 매핑
                        String rawName = item.getString("title");
                        String rawDescription = item.getString("title");
                        String brand = item.optString("brand", "Unknown");

                        // HTML 태그 제거
                        String cleanName = rawName.replaceAll("<[^>]*>", "");
                        String cleanDescription = rawDescription.replaceAll("<[^>]*>", "");

                        GamingEquipment equipment = new GamingEquipment();
                        equipment.setName(cleanName);
                        equipment.setCategory(query);
                        equipment.setPrice(item.has("lprice") ? Integer.parseInt(item.getString("lprice")) : 0);
                        equipment.setBrand(brand);
                        equipment.setDescription(cleanDescription);
                        equipment.setImageUrl(item.getString("image"));
                        equipment.setProductUrl(item.getString("link"));

                        // 데이터베이스에 저장
                        service.saveEquipment(equipment);
                        fetchedCount++; // 가져온 데이터 개수 증가
                    }

                    System.out.println(query + " 데이터 저장 완료 (" + fetchedCount + "/" + targetCount + ")");
                } else {
                    System.out.println(query + " API 호출 실패: " + responseCode);
                    break; // API 호출 실패 시 중단
                }
                // 딜레이 추가 (500ms)
                Thread.sleep(500);

            } catch (Exception e) {
                e.printStackTrace();
                break; // 예외 발생 시 중단
            }

            start += 30; // 다음 페이지로 이동
        }
    }

}