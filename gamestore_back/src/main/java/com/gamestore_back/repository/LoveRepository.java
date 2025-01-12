package com.gamestore_back.repository;


import com.gamestore_back.domain.Love;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface LoveRepository extends JpaRepository<Love, Long> {

    @Query("select love from Love love where love.owner.email = :email")
    Optional<Love> getLoveOfMember(@Param("email") String email);
}
