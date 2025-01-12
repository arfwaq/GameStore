import { Link } from "react-router-dom";
import { getKakaoLoginLink } from "../../api/kakaoApi";
import kakaoLoginImage from "../../image/kakao_login_medium_wide.png";

const KakaoLoginComponent = () => {
  const link = getKakaoLoginLink();


  return (
    <div className="flex flex-col">
      <div className="flex justify-center  w-full">
        <div className="text-3xl text-center m-6 text-white font-extrabold w-3/4 bg-yellow-500 shadow-sm rounded p-2">
            <Link to={link}>
                <img
                    src={kakaoLoginImage} // 불러온 이미지 사용
                    alt="카카오 로그인"
                    className="kakao-login-image"

                />
            </Link>
        </div>
      </div>
    </div>
  );
};

export default KakaoLoginComponent;
