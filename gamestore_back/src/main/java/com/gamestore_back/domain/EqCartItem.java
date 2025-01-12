package com.gamestore_back.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_eq_cart_item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"eqCart", "gamingEquipment"})
public class EqCartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ecino;

    @ManyToOne
    @JoinColumn(name = "eq_cart_ecno", nullable = false)
    @JsonBackReference
    private EqCart eqCart;

    @ManyToOne
    @JoinColumn(name = "game_equipment_id", nullable = false)
    private GamingEquipment gamingEquipment;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false, length = 100)
    private String ownerEmail;

    @PrePersist
    public void syncOwnerEmail() {
        if (this.eqCart != null) {
            this.ownerEmail = this.eqCart.getOwnerEmail();
        }
    }
}
