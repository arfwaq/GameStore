import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jwtAxios from "../../util/jwtUtil";
import "../../css/modifypw.css"; // CSS 파일 연결
import { modifyPassword } from "../../api/PlayerApi"; // API 함수 임포트

const ModifyPw = () => {
    const { email } = useParams(); // 동적 파라미터에서 email 가져오기
    const [currentPassword, setCurrentPassword] = useState(""); // 현재 비밀번호 상태
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수

    const handlePasswordChange = async () => {
        // 입력 검증
        if (!currentPassword) {
            setError("현재 비밀번호를 입력해주세요.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("새 비밀번호가 일치하지 않습니다.");
            return;
        }
        if (newPassword.length < 6) { // 예시: 비밀번호 길이 검증
            setError("비밀번호는 최소 6자 이상이어야 합니다.");
            return;
        }
        if (newPassword === currentPassword) { // 현재 비밀번호와 새 비밀번호 동일 여부 확인
            setError("새 비밀번호는 현재 비밀번호와 다르게 설정해주세요.");
            return;
        }


        try {
            await modifyPassword(email, currentPassword, newPassword);
            // 서버에 현재 비밀번호와 새 비밀번호 전송
            await jwtAxios.put("/api/player/modify-pw", {
                email,
                currentPassword,
                newPassword,
            });
            alert("비밀번호가 성공적으로 변경되었습니다.");
            navigate("/"); // 홈으로 리다이렉트


        } catch (err) {
            if (err.response && err.response.status === 400) { // 예시: 잘못된 현재 비밀번호
                setError("현재 비밀번호가 올바르지 않습니다.");
            } else {
                setError("비밀번호 변경에 실패했습니다.");
            }
        }
    };

    return (
        <div className="modify-pw-container">
            <div className="modify-pw-card">
                <h1 className="modify-pw-title">비밀번호 변경</h1>
                <p className="modify-pw-email">이메일: {email}</p>

                {/* 현재 비밀번호 입력 필드 추가 */}
                <input
                    type="password"
                    placeholder="현재 비밀번호"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="modify-pw-input"
                />

                <input
                    type="password"
                    placeholder="새 비밀번호"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="modify-pw-input"
                />
                <input
                    type="password"
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="modify-pw-input"
                />
                {error && <p className="modify-pw-error">{error}</p>}
                <div className="modify-pw-actions">
                    <button className="modify-pw-button confirm" onClick={handlePasswordChange}>
                        확인
                    </button>
                    <button className="modify-pw-button cancel" onClick={() => navigate("/")}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModifyPw;
