package com.gamestore_back.service;

import com.gamestore_back.domain.Game;
import com.gamestore_back.domain.Love;
import com.gamestore_back.domain.LoveItem;
import com.gamestore_back.domain.Player;
import com.gamestore_back.dto.LoveItemDTO;
import com.gamestore_back.dto.LoveItemListDTO;
import com.gamestore_back.repository.GameRepository;
import com.gamestore_back.repository.LoveItemRepository;
import com.gamestore_back.repository.LoveRepository;
import com.gamestore_back.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class LoveServiceImpl implements LoveService {


    private final LoveRepository loveRepository;
    private final LoveItemRepository loveItemRepository;
    private final GameRepository gameRepository;
    private final PlayerRepository playerRepository;

    //======================================
    // "B" 방식: (email, app_id)로 삭제
    //======================================
    public List<LoveItemListDTO> removeByAppId(String email, Long appId) {
        log.info("removeByAppId() called => email: {}, appId: {}", email, appId);

        // 1) (email, appId)로 LoveItem 찾기
        LoveItem target = loveItemRepository.getItemByAppId(email, appId);

        if (target != null) {
            // 2) 찾았다면 삭제
            loveItemRepository.delete(target);
            log.info("Deleted LoveItem lino={}, for email={}, appId={}",
                    target.getLino(), email, appId);
        } else {
            log.warn("LoveItem not found for email={}, appId={}", email, appId);
        }

        // 3) 삭제 후, 최신 찜 목록을 반환
        return loveItemRepository.getItemsOfLoveDTOByEmail(email);
    }



    @Override
    public boolean checkLoveExists(String email, Long appId) {
        // getItemByAppId 메서드를 재사용하여 존재 여부 확인
        LoveItem loveItem = loveItemRepository.getItemByAppId(email, appId);
        return loveItem != null;
    }


    @Override
    public List<LoveItemListDTO> addOrModify(LoveItemDTO loveItemDTO) {
        String email = loveItemDTO.getEmail();
        Long appId = loveItemDTO.getApp_id();
        Long lino = loveItemDTO.getLino(); // lino는 이제 수정 로직 외에는 안씀

        log.info("addOrModify() => email: {}, appId: {}, lino: {}", email, appId, lino);

        // 1) Love를 찾거나, 없으면 새로 생성
        Love love = getOrCreateLove(email);

        // 2) Game 엔티티 확인
        Game game = gameRepository.findById(appId)
                .orElseThrow(() -> new IllegalArgumentException("Game not found with appId: " + appId));

        // 3) 이미 존재하는 항목인지 확인
        LoveItem existingLoveItem = loveItemRepository.getItemByAppId(email, appId);
        if (existingLoveItem == null) {
            // 3-1) 없으면 새 항목 추가
            LoveItem newLoveItem = LoveItem.builder()
                    .game(game)
                    .love(love)
                    .build();
            loveItemRepository.save(newLoveItem);
        } else {
            // 3-2) 이미 있으면? 수량이나 다른 필드가 있으면 수정,
            //      지금 예시엔 필드가 없으므로 로그만 찍거나 무시
            log.info("LoveItem already exists for email={}, appId={}", email, appId);
        }

        // 4) 최신 찜 목록 반환
        return getLoveItems(email);
    }

    @Override
    public List<LoveItemListDTO> getLoveItems(String email) {
        return loveItemRepository.getItemsOfLoveDTOByEmail(email);
    }

    //======================================
    // 기존 lino로 삭제하던 remove()는 "B" 방식에서는 사용 X
    // => 필요 없으면 제거하거나 주석 처리
    //======================================
    @Override
    public List<LoveItemListDTO> remove(Long lino) {
        throw new UnsupportedOperationException("remove(lino) is not used in approach B");
    }

    //======================================
    // 이메일로 Love를 조회 (없으면 생성)
    //======================================
    private Love getOrCreateLove(String email) {
        Optional<Love> optionalLove = loveRepository.getLoveOfMember(email);
        if (optionalLove.isPresent()) {
            return optionalLove.get();
        } else {
            log.info("Creating new love for email: {}", email);
            Player player = playerRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("No Player found for email: " + email));
            Love newLove = Love.builder()
                    .owner(player)
                    .ownerEmail(email)
                    .build();
            return loveRepository.save(newLove);
        }


    }
}
