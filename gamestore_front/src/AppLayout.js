import React from 'react';
import { Outlet } from 'react-router-dom';
import Chatbot from './Chatbot';

const AppLayout = () => (
  <div>
    <Outlet /> {/* 현재 경로에 해당하는 자식 컴포넌트 */}
    <Chatbot /> {/* 항상 표시되는 Chatbot */}
  </div>
);

export default AppLayout;
