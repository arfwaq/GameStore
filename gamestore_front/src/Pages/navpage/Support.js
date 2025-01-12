import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import '../../css/support.css';

const Support = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 현재 경로가 정확히 "/support"일 경우에만 리다이렉션
    if (location.pathname === '/support') {
      navigate('faq', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div>
      <Navbar />
      <div className="support-container">
        <nav className="support-sidebar">
          <p className="support-title">고객지원</p>
          <ul>
            <li>
              <Link to="faq">자주 묻는 질문</Link>
            </li>
            <li>
              <Link to="inquire">문의하기</Link>
            </li>
            <li>
              <Link to="qna">내가 요청한 질문 전체 보기</Link>
            </li>
          </ul>
        </nav>
        <div className="support-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Support;
