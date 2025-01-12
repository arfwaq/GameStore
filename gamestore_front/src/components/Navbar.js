// Navbar.jsx
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../slices/loginSlice'; // 로그아웃 액션 가져오기
import { useState } from 'react';
import '../css/navbar.css';
import { decodedJWT } from '../util/jwtUtil'; // JWT 디코딩 유틸리티
import { getCookie } from '../util/cookieUtil'; // 쿠키 유틸리티 함수 가져오기
import ImageSearch from '../components/ImageSearch';
import gamelogo from "../image/gamelogo.png";

const Navbar = () => {
  const loginState = useSelector((state) => state.loginSlice); // 로그인 상태 가져오기
  const dispatch = useDispatch(); // Redux 디스패치
  const navigate = useNavigate(); // 페이지 이동
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 모바일 메뉴 열림 상태
  const [isSearchActive, setIsSearchActive] = useState(false); // 검색 모드 활성화 상태

  const userRole = decodedJWT()?.roleNames || []; // JWT에서 roleNames 가져오기
  const isAdmin = userRole.includes('ADMIN'); // ADMIN 권한 확인

  const playerCookie = getCookie('player'); // 'player' 쿠키 값 가져오기

  // 로그아웃 처리 함수
  const handleLogout = () => {
    // 쿠키 삭제 함수
    const deleteCookie = (name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };

    // 쿠키 삭제 (예: "player" 쿠키 삭제)
    deleteCookie('player');

    // Redux 상태 업데이트
    dispatch(logout());

    alert('로그아웃 되었습니다.');

    // 홈으로 이동
    navigate('/');
  };

  // 검색 처리 함수
  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      alert('검색어를 입력하세요.');
      return;
    }
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // 검색 페이지로 이동
    setSearchQuery(''); // 검색 후 입력창 비우기
    setIsSearchActive(false); // 검색 모드 종료
    setIsMenuOpen(false); // 모바일 메뉴 닫기
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleSearch = () => {
    setIsSearchActive((prev) => !prev);
    if (!isSearchActive) {
      // 검색 모드 활성화 시 메뉴 닫기
      setIsMenuOpen(false);
    }
  };

  return (
    <header id="navbar">
      <div className={`navbar-container ${isSearchActive ? 'search-active' : ''}`}>
        {/* 로고 */}
        {!isSearchActive && (
          <div className="navbar-logo">
            <Link to="/">
              <img src={gamelogo} alt="Company Logo" className="footer-logo-image"/>
            </Link>
          </div>
        )}

        {/* 네비게이션 링크 */}
        {!isSearchActive && (
          <nav className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
            <ul>
              {playerCookie && ( // 'player' 쿠키가 있을 때만 마이페이지 링크 렌더링
                <li>
                  <Link to="/mypage" onClick={() => setIsMenuOpen(false)}>
                    마이페이지
                  </Link>
                </li>
              )}
              <li>
                <Link to="/category" onClick={() => setIsMenuOpen(false)}>
                  카테고리
                </Link>
              </li>
              <li>
                <Link to="/news" onClick={() => setIsMenuOpen(false)}>
                  뉴스
                </Link>
              </li>
              <li>
                <Link to="/community" onClick={() => setIsMenuOpen(false)}>
                  커뮤니티
                </Link>
              </li>
              <li>
                <Link to="/support" onClick={() => setIsMenuOpen(false)}>
                  지원
                </Link>
              </li>
              <li>
                <Link to="/equipments" onClick={() => setIsMenuOpen(false)}>
                  장비
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                    관리자 페이지
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}

        {/* 검색 및 로그인/로그아웃 */}
        <div className="navbar-actions">
          {/* PC용 항상 보이는 검색 바 */}
          <div className="desktop-search">
            <input
              className="navInput"
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <button className="search-button" onClick={handleSearch}>
              검색
            </button>
            <ImageSearch className="image-search-button" />
          </div>

          {/* 모바일/태블릿용 검색 모드 */}
          {isSearchActive ? (
            <div className="active-search mobile-search">
              <input
                className="navInput"
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
              <button className="search-button" onClick={handleSearch}>
                검색
              </button>
              <ImageSearch className="image-search-button" />
              <button className="close-search" onClick={toggleSearch} aria-label="검색 닫기">
                ✖️
              </button>
            </div>
          ) : (
            /* 검색 모드가 비활성화된 경우 */
            <>
              {/* 검색 아이콘 (모바일/태블릿) */}
              <button className="search-icon mobile-search-icon" onClick={toggleSearch} aria-label="검색">
                🔍
              </button>
              {/* 닉네임 표시 및 클릭 시 회원정보 페이지 이동 */}
              {loginState.email && (
                <Link
                  to={`/player/profile?email=${loginState.email}`} // 프로필 페이지로 이동
                  className="navbar-nickname"
                >
                  {loginState.nickname || '사용자'}
                </Link>
              )}
              {/* 로그인/로그아웃 버튼 */}
              {!loginState.email ? (
                <Link to="/player/login" className="navbar-login">
                  로그인
                </Link>
              ) : (
                <button className="logout-button" onClick={handleLogout}>
                  로그아웃
                </button>
              )}
            </>
          )}
        </div>

        {/* 토글 버튼 (모바일에서만 보임) */}
        {!isSearchActive && (
          <button
            className="navbar-toggle"
            onClick={toggleMenu}
            aria-label="네비게이션 메뉴 토글"
            aria-expanded={isMenuOpen}
          >
            ☰
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
