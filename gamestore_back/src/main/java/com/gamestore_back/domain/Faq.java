package com.gamestore_back.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "faq")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Faq extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long faqId;

    @Column
    private String question;

    @Column
    private String answer;

    @Column(name = "category_id")
    private Long categoryId;


}

