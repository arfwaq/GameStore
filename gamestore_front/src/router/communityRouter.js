import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";

// 컴포넌트들이 제대로 로드될 수 있도록 lazy 로딩을 사용
const ListCommuPage = lazy(() => import("../Pages/navpage/community/ListCommuPage"));
const ReadCommuPage = lazy(() => import("../Pages/navpage/community/ReadCommuPage"));
const AddCommuPage = lazy(() => import("../Pages/navpage/community/AddCommuPage"));
const ModifyCommuPage = lazy(() => import("../Pages/navpage/community/ModifyCommuPage"));
const Loading = <div>Loading....</div>; // 로딩 중 표시할 컴포넌트

const communityRouter = () => {
  return [
    {
      path: "",
      element: <Navigate replace to="list" />,
    },
    {
      path: "list",
      element: (
        <Suspense fallback={Loading}>
          <ListCommuPage />
        </Suspense>
      ),
    },

    {
      path: "read/:comId",
      element: (
        <Suspense fallback={Loading}>
          <ReadCommuPage />
        </Suspense>
      ),
    },
    {
      path: "add",
      element: (
        <Suspense fallback={Loading}>
          <AddCommuPage />
        </Suspense>
      ),
    },
    {
      path: "modify/:comId",
      element: (
        <Suspense fallback={Loading}>
          <ModifyCommuPage />
        </Suspense>
      ),
    },
  ];
};

export default communityRouter;