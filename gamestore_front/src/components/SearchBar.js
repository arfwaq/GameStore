import React, { useState } from "react";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");  // 변수값 저장
  const [isSearchOpen, setIsSearchOpen] = useState(false);  //

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("검색어:", searchTerm); // 검색 처리 로직 추가
    setSearchTerm(""); // 검색어 초기화
  };

  return (
    <div className="search-bar">
      {/* 돋보기 아이콘 */}
      <button className="search-icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
        🔍
      </button>

      {/* 검색창 */}
      {isSearchOpen && (
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-submit">검색</button>
        </form>
      )}

      {/* 로그인 버튼 */}
      <Link to="/login" className="login-button">
        로그인
      </Link>

      {/* 카트 아이콘 */}
      <Link to="/cart" className="cart-icon">
        🛒
      </Link>
    </div>
  );
};

export default SearchBar;
