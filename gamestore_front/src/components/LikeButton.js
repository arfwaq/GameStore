import React, { useState, useEffect } from "react";
import { addLove, removeloveItem, checkLoveStatus } from "../api/LoveApi"; // checkLoveStatus 추가
import PropTypes from "prop-types";

const LikeButton = ({ appId }) => {
    const [isLiked, setIsLiked] = useState(false); // 초기 상태는 false
    const [loading, setLoading] = useState(true); // 상태 초기화 로딩 상태

    // 서버에서 초기 찜 상태를 가져오는 함수
    useEffect(() => {
        const fetchLoveStatus = async () => {
            try {
                setLoading(true); // 로딩 상태 시작
                const liked = await checkLoveStatus(appId); // 서버에서 찜 상태 확인
                setIsLiked(liked); // 찜 상태 업데이트
            } catch (error) {
                console.error("초기 찜 상태 로드 오류:", error);
            } finally {
                setLoading(false); // 로딩 상태 종료
            }
        };

        fetchLoveStatus();
    }, [appId]); // appId가 변경될 때마다 실행

    const handleToggle = async () => {
        try {
            if (isLiked) {
                // 이미 찜 상태라면 삭제
                await removeloveItem(appId);
                setIsLiked(false);
                alert("찜이 취소되었습니다.");
            } else {
                // 찜 상태가 아니라면 추가
                await addLove({ app_id: appId });
                setIsLiked(true);
                alert("찜이 되었습니다.");
            }
        } catch (error) {
            console.error("찜 상태 변경 오류:", error);
            alert("찜 상태를 변경할 수 없습니다. 다시 시도해주세요.");
        }
    };

    if (loading) {
        // 로딩 중일 때 표시
        return <div>Loading...</div>;
    }

    return (
        <div
            className="like-button"
            onClick={(e) => {
                e.stopPropagation(); // 클릭 이벤트 전파 방지
                handleToggle();
            }}
            role="button"
            tabIndex={0}
            aria-label={isLiked ? "찜 취소" : "찜 추가"}
            style={{
                cursor: "pointer",
                fontSize: "24px",
                userSelect: "none",
                transition: "color 0.2s",
            }}
        >
            {isLiked ? "❤️" : "🤍"}
        </div>
    );
};

LikeButton.propTypes = {
    appId: PropTypes.number.isRequired, // 필수로 전달되는 게임 ID
};

export default LikeButton;
