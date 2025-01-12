package com.gamestore_back.domain;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@ToString
//@Table(name="community_image")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommunityImage {

  private String fileName;

  private int ord;

  public void setOrd(int ord) {
    this.ord = ord;
  }
}
