import React, { useEffect, useState } from "react";
import jwtAxios from "../../util/jwtUtil";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../../css/playerprofile.css"; // CSS 파일 연결

const PlayerProfile = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email"); // 쿼리 파라미터에서 email 값 추출
  const [playerInfo, setPlayerInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayerInfo = async () => {
      try {
        const response = await jwtAxios.get(
            `http://localhost:8080/api/player/profile`,
            {
              params: { email }, // 서버에 email 전달
            }
        );
        setPlayerInfo(response.data);
      } catch (err) {
        console.error("회원정보를 가져오는 중 오류 발생:", err);
      }
    };

    if (email) fetchPlayerInfo();
  }, [email]);

  const handlePasswordChange = () => {
    if (email) {
      // URL 경로를 명확히 설정
      navigate(`/player/${email}/modify-pw`);
    } else {
      console.error("이메일 값이 없습니다.");
    }
  };

  return (
      <div className="profile-container">
        <div className="profile-card">
          <h1 className="profile-title">프로필 페이지</h1>
          <p>이메일: {playerInfo.email || email}</p>
          <p>닉네임: {playerInfo.nickname}</p>
          <button className="profile-button" onClick={handlePasswordChange}>
            비밀번호 변경
          </button>
        </div>
      </div>
  );
};

export default PlayerProfile;
