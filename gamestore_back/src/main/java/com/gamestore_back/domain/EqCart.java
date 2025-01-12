package com.gamestore_back.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tbl_eq_cart")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"items"})
public class EqCart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ecno; // 장바구니 PK

    @Column(nullable = false, unique = true)
    private String ownerEmail; // 사용자 이메일로 장바구니 식별

    @OneToMany(mappedBy = "eqCart", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<EqCartItem> items = new ArrayList<>();
}
