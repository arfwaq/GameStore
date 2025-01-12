import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getCookie } from '../util/cookieUtil';

const QnaLayout = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const playerInfo = getCookie('player');

    // 토큰이 없는 경우 로그인 페이지로 리다이렉트
    if (!playerInfo || !playerInfo.accessToken) {
      alert('로그인이 필요한 페이지입니다.');
      navigate('/player/login'); // 로그인 페이지로 이동
    }
  }, [navigate]);

  return (
    <div>
      {children}
      <Outlet />
    </div>
  );
};

export default QnaLayout;
