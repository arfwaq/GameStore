import React, { useEffect, useState } from "react";
import { getList, prefix, replyCount } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";
import FetchingModal from "../community/FetchingModal";
import "./css/ListCommuComponent.css"; // 인스타 스타일 CSS

import { decodeNicknameFromJWT } from "../../util/jwtUtil";
// 시간 계산 유틸 함수
import { timeSince } from "../../util/TimeUtil";

// 초기 상태
const initState = {
    dtoList: [],
};

const ListCommuComponent = () => {
    const { moveToRead } = useCustomMove();

    const [serverData, setServerData] = useState(initState);
    const [replyCounts, setReplyCounts] = useState({});
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        setFetching(true);

        const userEmail = decodeNicknameFromJWT();
        console.log("Decoded email:", userEmail);

        getList({ page: 1, size: 9999 })
            .then((data) => {
                const newData = data || initState;

                // 서버에서 내려온 dtoList가 있다면, writer를 쿠키의 이메일로 강제 교체
                if (newData.dtoList && userEmail) {
                    newData.dtoList = newData.dtoList.map((community) => ({
                        ...community,
                        writer: userEmail,
                    }));
                }

                setServerData(newData);

                // 댓글 수 불러오기
                const replyCountPromises =
                    newData.dtoList?.map((community) => replyCount(community.comId)) || [];

                Promise.all(replyCountPromises)
                    .then((counts) => {
                        const replyCountObj = newData.dtoList?.reduce((acc, community, idx) => {
                            acc[community.comId] = counts[idx];
                            return acc;
                        }, {});
                        setReplyCounts(replyCountObj || {});
                    })
                    .catch((err) => {
                        console.error("댓글 수 로드 중 오류:", err);
                        setReplyCounts({});
                    });

                setFetching(false);
            })
            .catch((error) => {
                console.error("데이터 로드 중 오류:", error);
                setServerData(initState);
                setFetching(false);
            });
    }, []);

    return (
        <div className="list-commu-container">
            {fetching && <FetchingModal/>}

            <div className="feed-wrapper">
                {serverData.dtoList && serverData.dtoList.length > 0 ? (
                    serverData.dtoList.map((community) => (
                        <div
                            key={community.comId}
                            className="post-card"
                            onClick={() => moveToRead(community.comId)}
                        >
                            {/* 상단 사용자 정보 */}
                            <div className="post-header">
                                <div className="profile-image"/>
                                <span className="writer-name">{community.writer}</span>
                            </div>

                            {/* 게시물 이미지 */}
                            <div className="post-image-wrapper">
                                <img
                                    alt={`community-${community.comId}`}
                                    className="post-image"
                                    src={
                                        community.uploadFileNames && community.uploadFileNames.length > 0
                                            ? `${prefix}/view/${community.uploadFileNames[0]}`
                                            : "/default-image.png"
                                    }
                                />
                            </div>

                            {/* 게시글 내용 */}
                            <div className="post-content-summary">
                                <span>{community.comContent || "내용 없음"}</span>
                            </div>

                            {/* 하단 아이콘 및 정보 */}
                            <div className="post-info-wrapper">
                                <div className="post-likes">
                                    좋아요 <strong>1,234</strong>개
                                </div>

                                {/*<div className="post-content">*/}
                                {/*    <span className="post-writer">{community.writer}</span>*/}
                                {/*    <span className="post-text">{community.comTitle}</span>*/}
                                {/*</div>*/}

                                <div className="post-comments-count">
                                    댓글 {replyCounts[community.comId] || 0}개 모두 보기
                                </div>

                                {/* 작성일. 예: community.regDate or community.modDate 등 서버에서 받은 날짜 */}
                                <div className="post-date">
                                    {community.regDate ? timeSince(community.regDate) : ""}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-data">데이터가 없습니다.</p>
                )}
            </div>

        </div>
    );
};

export default ListCommuComponent;
