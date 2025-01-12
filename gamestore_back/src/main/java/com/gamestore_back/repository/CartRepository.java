package com.gamestore_back.repository;

import com.gamestore_back.domain.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    @Query("select cart from Cart cart where cart.owner.email = :email")
    Optional<Cart> getCartOfMember(@Param("email") String email);
}
