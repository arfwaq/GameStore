import Navbar from "../../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/makeplyer.css"; // CSS 파일 연결

const MakePlayer = () => {
  const [email, setEmail] = useState(""); // 이메일 초기값
  const [password, setPassword] = useState(""); // 비밀번호 초기값
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 초기값
  const [nickname, setNickname] = useState(""); // 닉네임 초기값
  const [agree, setAgree] = useState(false); // 개인정보 동의 체크박스 상태
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 입력값 검증
    if (!email || !password || !confirmPassword || !nickname) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // 비밀번호 길이 검증 추가
    if (password.length < 6) {
      alert("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,8}$/;
    if (!nicknameRegex.test(nickname)) {
      alert("닉네임은 한글, 영문, 숫자로 이루어진 2~8자만 가능합니다.");
      return;
    }

    if (!agree) {
      alert("개인정보 처리 방침에 동의해주세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/player/make", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          pw: password,
          nickname,
          social: false,
          roleNames: [], // 빈 리스트 추가
        }),
      });

      const data = await response.json();



      alert(data.message || "회원가입이 성공적으로 완료되었습니다!");
      navigate("/player/login");
    } catch (err) {
      alert(err.message || "회원가입 실패. 다시 시도해주세요.");
    }
  };

  return (
      <>
        <Navbar />
        <div className="makeplayer-container">
          <div className="makeplayer-card">
            <h1 className="makeplayer-title">회원가입</h1>
            <form className="makeplayer-form" onSubmit={handleSubmit}>
              <input
                  type="email"
                  placeholder="이메일"
                  className="makeplayer-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
              <input
                  type="password"
                  placeholder="비밀번호"
                  className="makeplayer-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
              <input
                  type="password"
                  placeholder="비밀번호 확인"
                  className="makeplayer-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <input
                  type="text"
                  placeholder="닉네임 (2~8자, 한글/영문/숫자)"
                  className="makeplayer-input"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
              />
              <div className="makeplayer-agreement">
                <input
                    type="checkbox"
                    id="agree"
                    className="makeplayer-checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                />
                <label
                    htmlFor="agree"
                    style={{
                      color: "#3a3a3a",
                    }}
                >
                  개인정보 처리 방침에 동의합니다.
                </label>
              </div>
              <button type="submit" className="makeplayer-button">
                회원가입 완료
              </button>
            </form>
          </div>
        </div>
      </>
  );
};

export default MakePlayer;
