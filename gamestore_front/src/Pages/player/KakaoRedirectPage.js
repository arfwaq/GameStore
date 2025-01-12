import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAccessToken, getPlayerWithAccessToken } from '../../api/kakaoApi';
import { useDispatch } from "react-redux";
import { login } from "../../slices/loginSlice";
import useCustomLogin from "../../hooks/useCustomLogin";

const KakaoRedirectPage = () => {
  const [searchParams] = useSearchParams();

  const { moveToPath } = useCustomLogin();

  const dispatch = useDispatch();

  // 인가코드 받기위한 변수
  const authCode = searchParams.get("code");

  useEffect(() => {
    getAccessToken(authCode).then((accessToken) => {
      console.log(accessToken);

      // back에서 사용자 정보를 받아와서 memberInfo로 전달.
      getPlayerWithAccessToken(accessToken).then((playerInfo) => {
        console.log("------------------");
        console.log(playerInfo);

        dispatch(login(playerInfo));

        // 소셜 회원이 아니라면
        if (playerInfo && !playerInfo.social) {
          moveToPath("/");
        } else {
          moveToPath("/");
        }
      });
    });
  }, [authCode]);
  return (
    <div>
      <div>Kakao Login Redirect</div>
      <div>{authCode}</div>
    </div>
  );
};

export default KakaoRedirectPage;
