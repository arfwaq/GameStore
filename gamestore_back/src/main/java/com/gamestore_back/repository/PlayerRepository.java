package com.gamestore_back.repository;

import com.gamestore_back.domain.Player;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PlayerRepository extends JpaRepository<Player, String> {

    // 이메일이 일치한다면 즉시로딩 시켜라.
    // attributePaths 로 즉시로딩 처리를 진행할수 있다.
    @EntityGraph(attributePaths = {"playerRoleList"})
    @Query("select p from Player p where p.email = :email")
    Player getWithRoles(@Param("email") String email);
    Optional<Player> findByEmail(String email);

}
