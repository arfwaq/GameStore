package com.gamestore_back.controller;

import com.gamestore_back.dto.LoveItemDTO;
import com.gamestore_back.dto.LoveItemListDTO;
import com.gamestore_back.service.LoveService;
import com.gamestore_back.service.LoveServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/love")
public class LoveController {

    private final LoveService loveService;

    @PostMapping("/change")
    public List<LoveItemListDTO> changeLove(@RequestBody LoveItemDTO itemDTO) {
        String email = itemDTO.getEmail();
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("사용자 이메일이 필요합니다.");
        }

        log.info("찜 항목 변경 요청: {}, 사용자 이메일: {}", itemDTO, email);

        // (B) "remove" 동작 => (email, app_id)로 삭제
        if ("remove".equalsIgnoreCase(itemDTO.getAction())) {
            return ((LoveServiceImpl) loveService).removeByAppId(email, itemDTO.getApp_id());
        }

        // 그 외 => "add" or "modify"
        return loveService.addOrModify(itemDTO);
    }

    /**
     * 사용자의 찜 항목 조회
     */
    @GetMapping("/items")
    public List<LoveItemListDTO> getLoveItems(@RequestParam("email") String email) {
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("사용자 이메일이 필요합니다.");
        }
        log.info("찜 항목 조회 => email={}", email);
        return loveService.getLoveItems(email);
    }

    /**
     * (선택) lino 기반 삭제 API
     *  -> "B" 방식에서는 잘 안쓰지만, 필요하면 유지
     */
    @DeleteMapping("/{lino}")
    public List<LoveItemListDTO> removeFromLove(
            @PathVariable("lino") Long lino,
            @RequestParam("email") String email) {
        // 만약 "app_id" 방식만 쓰려면 이 API를 지워도 됩니다.
        return loveService.remove(lino);
    }
    @GetMapping("/check")
    public boolean checkLoveStatus(
            @RequestParam("email") String email,
            @RequestParam("appId") Long appId) {
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("사용자 이메일이 필요합니다.");
        }
        return loveService.checkLoveExists(email, appId);
    }

}
