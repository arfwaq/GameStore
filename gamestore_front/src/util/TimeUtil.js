// timeUtil.js
export function timeSince(dateString) {
    if (!dateString) {
        return ""; // 날짜가 없으면 빈 문자열 반환
    }

    const now = new Date();
    const past = new Date(dateString);

    // 혹시 dateString이 유효하지 않은 경우 예외 처리
    if (isNaN(past.getTime())) {
        return "";
    }

    const diffSeconds = Math.floor((now - past) / 1000);

    if (diffSeconds < 60) {
        return "방금 전";
    } else if (diffSeconds < 3600) {
        const minutes = Math.floor(diffSeconds / 60);
        return `${minutes}분 전`;
    } else if (diffSeconds < 86400) {
        const hours = Math.floor(diffSeconds / 3600);
        return `${hours}시간 전`;
    } else if (diffSeconds < 2592000) {
        // 30일(대략) 미만이면 일 단위 표기
        const days = Math.floor(diffSeconds / 86400);
        return `${days}일 전`;
    } else if (diffSeconds < 31536000) {
        // 12개월(대략) 미만이면 달 단위 표기
        const months = Math.floor(diffSeconds / 2592000);
        return `${months}달 전`;
    } else {
        // 1년 이상
        const years = Math.floor(diffSeconds / 31536000);
        return `${years}년 전`;
    }
}
