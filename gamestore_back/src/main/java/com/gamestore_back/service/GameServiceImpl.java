package com.gamestore_back.service;

import com.gamestore_back.domain.Game;
import com.gamestore_back.dto.GameDTO;
import com.gamestore_back.repository.GameRepository;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {

    private final GameRepository gameRepository;
    private final ModelMapper modelMapper;

    @Override
    public void fetchAndSavePopularGames() {
        System.out.println("SteamCharts에서 인기 게임 데이터를 크롤링합니다...");
        List<Game> gamesToSave = new ArrayList<>();

        int maxPages = 12; // 크롤링할 페이지 수 (25개 x 12 = 300개)
        try {
            for (int page = 1; page <= maxPages; page++) {
                String url = "https://steamcharts.com/top/p." + page;
                System.out.println("크롤링 URL: " + url);

                // HTTP 요청 및 HTML 파싱
                var document = Jsoup.connect(url)
                        .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
                        .timeout(10000)
                        .get();
                var rows = document.select("table.common-table tbody tr");

                for (var row : rows) {
                    var columns = row.select("td");
                    if (columns.size() < 2) continue;

                    String gameName = columns.get(1).text();
                    String appIdLink = columns.get(1).select("a").attr("href");
                    String appId = appIdLink.substring(appIdLink.lastIndexOf("/") + 1);

                    // 중복된 게임 방지
                    if (gameRepository.existsByAppId(Long.valueOf(appId))) {
                        System.out.println("중복된 게임: " + gameName + " (App ID: " + appId + ")");
                        continue;
                    }

                    Game game = new Game();
                    game.setAppId(Long.valueOf(appId));
                    game.setGameName(gameName);

                    gamesToSave.add(game);
                    System.out.println("저장 준비 게임: " + game.getGameName() + " (App ID: " + appId + ")");
                }

                // 페이지 요청 간 2초 대기
                Thread.sleep(2000);
            }

            if (!gamesToSave.isEmpty()) {
                gameRepository.saveAll(gamesToSave);
                System.out.println("총 저장된 게임 수: " + gamesToSave.size());
            }

        } catch (Exception e) {
            System.err.println("크롤링 중 오류 발생: " + e.getMessage());
        }

        System.out.println("인기 게임 데이터 크롤링 및 저장 작업 완료.");
    }

    @Override
    public void fetchAndSaveGameDetails() {
        System.out.println("Steam Store Data API에서 게임 세부 정보를 가져옵니다...");
        List<Game> games = gameRepository.findAll();
        List<Game> gamesToUpdate = new ArrayList<>();

        int batchSize = 50;
        int totalGames = games.size();

        for (int start = 0; start < totalGames; start += batchSize) {
            List<Game> batch = games.subList(start, Math.min(start + batchSize, totalGames));

            for (Game game : batch) {
                int retryCount = 0;
                boolean success = false;

                while (retryCount < 3 && !success) { // 최대 3번 재시도
                    try {
                        System.out.println("현재 처리 중인 App ID: " + game.getAppId());

                        String response = Jsoup.connect("https://store.steampowered.com/api/appdetails?")
                                .data("appids", String.valueOf(game.getAppId()))
                                .data("l", "korean")
                                .ignoreContentType(true)
                                .timeout(10000)
                                .execute()
                                .body();

                        JsonObject jsonResponse = JsonParser.parseString(response).getAsJsonObject();
                        JsonObject gameData = jsonResponse.getAsJsonObject(String.valueOf(game.getAppId()));

                        if (gameData == null || !gameData.get("success").getAsBoolean()) {
                            System.out.println("유효하지 않은 게임 데이터. App ID: " + game.getAppId());
                            break;
                        }

                        JsonObject details = gameData.getAsJsonObject("data");

                        if (details != null) {
                            game.setGameDescription(details.has("short_description")
                                    ? details.get("short_description").getAsString()
                                    : null);

                            // 가격 설정
                            if (details.has("price_overview")) {
                                JsonObject priceOverview = details.getAsJsonObject("price_overview");
                                BigDecimal price = priceOverview.get("final").getAsBigDecimal().divide(BigDecimal.valueOf(100));
                                game.setPrice(price); // BigDecimal 타입으로 저장

                                if (priceOverview.has("discount_percent")) {
                                    game.setDiscountRate(priceOverview.get("discount_percent").getAsInt());
                                } else {
                                    game.setDiscountRate(0);
                                }
                            } else {
                                game.setPrice(BigDecimal.ZERO); // 무료 게임은 0으로 저장
                                game.setDiscountRate(0);
                            }

                            // 날짜 설정
                            game.setReleaseDate(details.has("release_date")
                                    ? parseReleaseDate(details.getAsJsonObject("release_date").get("date").getAsString())
                                    : null);

                            // 썸네일
                            game.setThumbnailUrl(details.has("header_image")
                                    ? details.get("header_image").getAsString()
                                    : null);

                            // 트레일러 URL
                            if (details.has("movies")) {
                                JsonArray movies = details.getAsJsonArray("movies");
                                if (movies.size() > 0) {
                                    JsonObject movie = movies.get(0).getAsJsonObject();
                                    String trailerUrl = movie.getAsJsonObject("mp4").get("max").getAsString();
                                    game.setTrailerUrl(trailerUrl);
                                }
                            }

                            // 장르
                            if (details.has("genres")) {
                                JsonArray genres = details.getAsJsonArray("genres");
                                List<String> genreList = new ArrayList<>();
                                for (int i = 0; i < genres.size(); i++) {
                                    genreList.add(genres.get(i).getAsJsonObject().get("description").getAsString());
                                }
                                game.setGenre(String.join(", ", genreList));
                            }

                            // 나이 제한
                            if (details.has("required_age")) {
                                int ageRestriction = details.get("required_age").getAsInt();
                                game.setAgeRestriction(formatAgeRestriction(ageRestriction));
                            } else {
                                game.setAgeRestriction("전체 이용가");
                            }

                            // PC 요구 사항
                            if (details.has("pc_requirements")) {
                                JsonObject pcRequirements = details.getAsJsonObject("pc_requirements");
                                game.setMinimumPcRequirements(pcRequirements.has("minimum")
                                        ? pcRequirements.get("minimum").getAsString()
                                        : null);
                                game.setRecommendedPcRequirements(pcRequirements.has("recommended")
                                        ? pcRequirements.get("recommended").getAsString()
                                        : null);
                            }

                            // 추천 수
                            if (details.has("recommendations")) {
                                JsonObject recommendations = details.getAsJsonObject("recommendations");
                                game.setRecommendations(recommendations.get("total").getAsInt());
                            }

                            // 지원 언어
                            if (details.has("supported_languages")) {
                                String supportedLanguages = details.get("supported_languages").getAsString();
                                game.setSupportedLanguages(supportedLanguages);
                            }

                            gamesToUpdate.add(game);
                            System.out.println("업데이트 준비 완료: " + game.getGameName());
                        }

                        success = true; // 성공적으로 처리 완료

                        // 각 요청 간 2초 대기 추가
                        Thread.sleep(2000);

                    } catch (Exception e) {
                        retryCount++;
                        System.err.println("API 호출 실패. App ID: " + game.getAppId() + ", 오류: " + e.getMessage());

                        if (retryCount >= 3) {
                            System.err.println("최대 재시도 횟수 초과. App ID: " + game.getAppId());
                        } else {
                            try {
                                Thread.sleep(5000); // 재시도 전 대기
                            } catch (InterruptedException ex) {
                                Thread.currentThread().interrupt();
                            }
                        }
                    }
                }
            }

            if (!gamesToUpdate.isEmpty()) {
                gameRepository.saveAll(gamesToUpdate);
                gamesToUpdate.clear();
                System.out.println("현재 배치 저장 완료");
            }

            try {
                Thread.sleep(5000); // 배치 간 대기
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        System.out.println("게임 세부 정보 업데이트 작업 완료.");
    }

    @Override
    public List<GameDTO> filterAndSearchGames(String genre, BigDecimal minPrice, BigDecimal maxPrice, Integer minDiscount, Integer releaseYear, String search) {

        // Repository를 통해 필터링된 데이터를 가져옵니다.
        List<Game> filteredGames = gameRepository.filterAndSearchGames(genre, minPrice, maxPrice, minDiscount, releaseYear, search);

        // Game 엔티티를 GameDTO로 변환하여 반환합니다.
        return filteredGames.stream()
                .map(game -> modelMapper.map(game, GameDTO.class)) // ModelMapper를 사용해 변환
                .collect(Collectors.toList());
    }

    @Override
    public List<GameDTO> searchGamesByName(String gameName) {
        List<Game> games = gameRepository.findByGameNameContainingIgnoreCase(gameName);
        return games.stream()
                .map(game -> modelMapper.map(game, GameDTO.class))
                .collect(Collectors.toList());
    }

    private LocalDate parseReleaseDate(String dateStr) {
        try {
            dateStr = dateStr.replaceAll("(?<=\\D)(\\d)(?=월)", "0$1")
                    .replaceAll("(?<=월 )(\\d)(?=일)", "0$1");

            // 날짜에 일이 없을 경우 처리
            if (dateStr.matches("\\d{4}년 \\d{1,2}월")) {
                dateStr += " 01일";
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");
            return LocalDate.parse(dateStr, formatter);
        } catch (DateTimeParseException e) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d MMMM yyyy");
                return LocalDate.parse(dateStr, formatter);
            } catch (DateTimeParseException ex) {
                System.err.println("날짜 파싱 실패: " + dateStr);
                return null;
            }
        }
    }

    private String formatPrice(BigDecimal price) {
        return "₩ " + price.toBigInteger().toString().replaceAll("\\B(?=(\\d{3})+(?!\\d))", ",");
    }

    private String formatAgeRestriction(int age) {
        return age == 0 ? "전체 이용가" : age + "세 이용가";
    }

    @Override
    public List<Game> getAllGames() {
        System.out.println("저장된 모든 게임을 가져옵니다...");
        return gameRepository.findAll();
    }

    @Override
    public GameDTO findGameById(Long appId) {
        return gameRepository.findById(appId)
                .map(game -> modelMapper.map(game, GameDTO.class))
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 게임을 찾을 수 없습니다: " + appId));
    }
}
