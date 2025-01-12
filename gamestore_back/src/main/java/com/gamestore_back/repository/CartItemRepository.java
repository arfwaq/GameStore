package com.gamestore_back.repository;

import com.gamestore_back.domain.CartItem;
import com.gamestore_back.dto.CartItemListDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // 사용자 이메일 기반 장바구니 항목 리스트 조회
    // (cino, appId, gameDescription, gameName, price, thumbnailUrl, trailerUrl) 순서 주의
    @Query("""
        SELECT new com.gamestore_back.dto.CartItemListDTO(
            ci.cino,
            ci.game.appId,
            ci.game.gameDescription,
            ci.game.gameName,
            ci.game.price,
            ci.game.thumbnailUrl,
            ci.game.trailerUrl
        )
        FROM CartItem ci
        WHERE ci.cart.owner.email = :email
        ORDER BY ci.cino DESC
    """)
    List<CartItemListDTO> getItemsOfCartDTOByEmail(@Param("email") String email);

    // 특정 게임 ID와 사용자 이메일로 장바구니 항목 조회
    // 이건 DTO가 아니라 CartItem 엔티티를 직접 반환하므로 그대로 두거나,
    // 필요하다면 select new ... 로 바꾸면 됩니다.
    @Query("""
        SELECT ci
        FROM CartItem ci
        WHERE ci.cart.owner.email = :email
          AND ci.game.appId = :appId
    """)
    CartItem getItemByAppId(@Param("email") String email, @Param("appId") Long appId);

    // 특정 장바구니 ID 기반 항목 리스트 조회
    @Query("""
        SELECT new com.gamestore_back.dto.CartItemListDTO(
            ci.cino,
            ci.game.appId,
            ci.game.gameDescription,
            ci.game.gameName,
            ci.game.price,
            ci.game.thumbnailUrl,
            ci.game.trailerUrl
        )
        FROM CartItem ci
        WHERE ci.cart.cno = :cno
        ORDER BY ci.cino DESC
    """)


    List<CartItemListDTO> getItemsOfCartDTOByCart(@Param("cno") Long cno);
}
