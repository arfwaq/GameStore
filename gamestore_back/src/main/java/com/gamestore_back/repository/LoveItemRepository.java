package com.gamestore_back.repository;

import com.gamestore_back.domain.LoveItem;
import com.gamestore_back.dto.LoveItemListDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoveItemRepository extends JpaRepository<LoveItem, Long> {


    // 사용자 이메일 기반 찜 항목 리스트 조회
    // (lino, appId, gameDescription, gameName, price, thumbnailUrl, trailerUrl) 순서 주의
    @Query("""
        SELECT new com.gamestore_back.dto.LoveItemListDTO(
            li.lino,
            li.game.appId,
            li.game.gameDescription,
            li.game.gameName,
            li.game.price,
            li.game.thumbnailUrl,
            li.game.trailerUrl
        )
        FROM LoveItem li
        WHERE li.love.owner.email = :email
        ORDER BY li.lino DESC
    """)
    List<LoveItemListDTO> getItemsOfLoveDTOByEmail(@Param("email") String email);

    // 특정 게임 ID와 사용자 이메일로 찜 항목 조회
    // 이건 DTO가 아니라 LoveItem 엔티티를 직접 반환하므로 그대로 두거나,
    // 필요하다면 select new ... 로 바꾸면 됩니다.
    @Query("""
        SELECT li
        FROM LoveItem li
        WHERE li.love.owner.email = :email
          AND li.game.appId = :appId
    """)
    LoveItem getItemByAppId(@Param("email") String email, @Param("appId") Long appId);

    // 특정 찜 ID 기반 항목 리스트 조회
    @Query("""
        SELECT new com.gamestore_back.dto.LoveItemListDTO(
            li.lino,
            li.game.appId,
            li.game.gameDescription,
            li.game.gameName,
            li.game.price,
            li.game.thumbnailUrl,
            li.game.trailerUrl
        )
        FROM LoveItem li
        WHERE li.love.lno = :lno
        ORDER BY li.lino DESC
    """)
    List<LoveItemListDTO> getItemsOfLoveDTOByLove(@Param("lno") Long lno);
}
