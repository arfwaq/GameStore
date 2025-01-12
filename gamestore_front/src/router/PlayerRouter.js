import { Suspense, lazy } from "react";
import { Route, createRoutesFromElements } from "react-router-dom";

const Loading = <div>Loading....</div>;
const Login = lazy(() => import("../Pages/player/LoginPage"));
const MakePlayer = lazy(() => import("../Pages/player/MakePlayer"));

const KakaoRedirect = lazy(() => import("../Pages/player/KakaoRedirectPage"));
const MemberModify = lazy(() => import("../Pages/player/ModifyPage"));
const PlayerProfile = lazy(() => import("../Pages/player/PlayerProfile"));
const ModifyPw = lazy(() => import("../Pages/find/ModifyPw"));

const PlayerRouter = () =>
  createRoutesFromElements(
    <>
      <Route
        path="login"
        element={
          <Suspense fallback={Loading}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="kakao"
        element={
          <Suspense fallback={Loading}>
            <KakaoRedirect />
          </Suspense>
        }
      />
      <Route
        path="modify"
        element={
          <Suspense fallback={Loading}>
            <MemberModify />
          </Suspense>
        }
      />
      <Route
        path="make"
        element={
          <Suspense fallback={Loading}>
            <MakePlayer />
          </Suspense>
        }
      />
      <Route
        path="profile"
        element={
          <Suspense fallback={Loading}>
            <PlayerProfile />
          </Suspense>
        }
      />

      {/* 비밀번호 변경 페이지 */}
      <Route
        path=":email/modify-pw"
        element={
          <Suspense fallback={Loading}>
            <ModifyPw />
          </Suspense>
        }
      />

    </>
  );

export default PlayerRouter;
