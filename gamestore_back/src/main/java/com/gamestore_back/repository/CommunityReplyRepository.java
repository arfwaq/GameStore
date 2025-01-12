package com.gamestore_back.repository;

import com.gamestore_back.domain.CommunityReply;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CommunityReplyRepository extends JpaRepository<CommunityReply, Long> {
  @Query("select r from CommunityReply r where r.community.comId = :comId")
  Page<CommunityReply> listOfReply(@Param("comId") Long comId, Pageable pageable);


  // 특정 커뮤니티에 달린 댓글의 수를 세는 메서드
  @Query("select count(r) from CommunityReply r where r.community.comId = :comId")
  long countByCommunity(@Param("comId") Long comId);  // 댓글 수를 반환하는 메서드

  void deleteByCommunity_ComId(Long comId);
  //원글 지워도 댓글 남게 하려면 사용 x
}
