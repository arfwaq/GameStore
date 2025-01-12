package com.gamestore_back.repository;

import com.gamestore_back.domain.Community;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

//jpa는 자동으로 객체를 생성하고 이를 통해서 예외 처리 등을 자동으로 처리. jpaRepository는 이를 위한 인터페이스
public interface CommunityRepository extends JpaRepository<Community, Long> {
//    @Query("select c from Community c where c.comId=:comId")
//    Optional<Community> findById(@Param("comId") Long comId);

    @EntityGraph(attributePaths = "imageList")
    @Query("select c from  Community c where c.comId = :comId")
    Optional<Community> selectOne(@Param("comId") Long comId);

//    @Modifying
//    @Query("update Product p set p.delFlag = :flag where p.pno = :pno")
//    void updateToDelete(@Param("pno") Long pno, @Param("flag") boolean flag);

    @Query("select c, ci  from Community c left join c.imageList ci  where ci.ord = 0 or ci.ord is null")
    Page<Object[]> selectList(Pageable pageable);
}
