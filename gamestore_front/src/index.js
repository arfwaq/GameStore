import React from "react";
import { createRoot } from "react-dom/client"; // React 18의 createRoot 사용
import { Provider } from "react-redux";
import store from "./store"; // 생성한 Redux 스토어를 import
import App from "./App";

const container = document.getElementById("root"); // root DOM 컨테이너 가져오기
const root = createRoot(container); // createRoot로 React 애플리케이션 초기화

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);