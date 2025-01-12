// src/pages/Category.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getFilteredGames } from '../../api/todoApi'; // 백엔드 API 호출 함수
import Navbar from '../../components/Navbar';
import '../../css/category.css'; // 스타일링을 위한 CSS 파일 연결
import LikeButton from '../../components/LikeButton'; // LikeButton 컴포넌트 추가

import { getCartItems as getGameCartItems } from "../../api/cartApi"; // 장바구니 API 가져오기
import EqCartApi from "../../api/EqCartApi"; // 장비 카트 API

const Category = () => {
  const [allGames, setAllGames] = useState([]); // 전체 게임 데이터
  const [filteredGames, setFilteredGames] = useState([]); // 필터링된 게임들
  const [displayedGames, setDisplayedGames] = useState([]); // 화면에 보여줄 게임들
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 더 가져올 데이터 여부
  const gamesPerPage = 30; // 한 번에 보여줄 게임 수
  const [page, setPage] = useState(1); // 현재 페이지
  const [hoveredGame, setHoveredGame] = useState(null); // 마우스 호버 상태
  const [selectedGenre, setSelectedGenre] = useState(''); // 선택된 장르
  const navigate = useNavigate(); // 경로 이동 함수 추가
  const location = useLocation(); // 전달된 상태 처리
  const [cartItemCount, setCartItemCount] = useState(0); // 카트 아이템 갯수

  // 토글 상태 관리
  const [isGenreFilterVisible, setGenreFilterVisible] = useState(false);
  const [isFilterButtonVisible, setFilterButtonVisible] = useState(false);

  // 위로 가기 버튼 상태
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);

  // 화면 크기 감지
  const checkScreenSize = () => {
    setFilterButtonVisible(window.innerWidth <= 1500);
  };

  const [likedGames, setLikedGames] = useState(new Set()); // 찜 상태 관리

  // 찜 상태를 토글하는 함수
  const toggleLike = (appId) => {
    setLikedGames((prev) => {
      const newLikes = new Set(prev);
      if (newLikes.has(appId)) {
        newLikes.delete(appId); // 찜 해제
      } else {
        newLikes.add(appId); // 찜 추가
      }
      return newLikes;
    });
  };

  // 장바구니 아이템 갯수
  useEffect(() => {
    const fetchCartItemCount = async () => {
      try {
        const [gameItems, eqItems] = await Promise.all([
          getGameCartItems(),
          EqCartApi.getCartItems(),
        ]);
        const totalItems = gameItems.length + eqItems.length;
        setCartItemCount(totalItems);
      } catch (error) {
        console.error("장바구니 아이템 갯수를 가져오는 중 오류:", error);
      }
    };

    fetchCartItemCount();
  }, []);

  // 장바구니 버튼 클릭 시 이동
  const handleCartButtonClick = () => {
    navigate('/cart'); // 장바구니 페이지로 이동
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // 장르 필터 토글 함수
  const toggleGenreFilter = () => {
    setGenreFilterVisible((prev) => !prev);
  };

  // 사이드 필터 상태 추가
  const [filters, setFilters] = useState({
    selectedGenres: [], // 선택된 장르
    priceRange: 50000, // 최대 가격 (₩)
    discountRate: 100, // 최대 할인율 (%)
    selectedLanguages: [], // 선택된 언어
    ageRestriction: '전체', // 나이 제한
    releaseDate: 'newest', // 출시일 정렬 기준
  });

  // 원래 가격 계산 함수
  const calculateOriginalPrice = (price, discountRate) => {
    return discountRate > 0
      ? Math.round(price / (1 - discountRate / 100))
      : price;
  };

  // 전체 게임 데이터를 불러오는 함수
  const loadAllGames = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await getFilteredGames();
      if (response && response.length > 0) {
        setAllGames(response);
        if (location.state?.selectedGenre) {
          filterByGenre(location.state.selectedGenre);
        } else {
          setFilteredGames(response); // 초기 필터링 없이 전체 데이터 표시
          setDisplayedGames(response.slice(0, gamesPerPage));
          setHasMore(response.length > gamesPerPage);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('게임 데이터를 불러오지 못했습니다:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // 장르 필터링 함수 (배열 또는 문자열을 처리)
  const filterByGenre = (genre) => {
    setSelectedGenre(genre);
    setPage(1);

    // 스크롤을 맨 위로 이동시키기
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    const filtered =
      genre === ''
        ? allGames // 전체 목록 표시
        : allGames.filter((game) => {
          if (!game.genre) return false;
          if (Array.isArray(game.genre)) {
            return game.genre.some((g) =>
              g.toLowerCase().includes(genre.toLowerCase())
            );
          } else if (typeof game.genre === 'string') {
            return game.genre.toLowerCase().includes(genre.toLowerCase());
          }
          return false;
        });

    console.log(`Filtering by genre: ${genre}`);
    console.log(`Filtered games count: ${filtered.length}`);
    console.log(filtered);

    setFilteredGames(filtered);
    setDisplayedGames(filtered.slice(0, gamesPerPage));
    setHasMore(filtered.length > gamesPerPage);
  };

  // 필터 적용 메서드
  const applyFilters = () => {
    const filtered = allGames.filter((game) => {
      const genreMatch =
        filters.selectedGenres.length === 0 ||
        filters.selectedGenres.some((g) => {
          if (!game.genre) return false;
          if (Array.isArray(game.genre)) {
            return game.genre.some((genre) => genre.includes(g));
          } else if (typeof game.genre === 'string') {
            return game.genre.includes(g);
          }
          return false;
        });

      const priceMatch = game.price <= filters.priceRange;

      const discountMatch = game.discountRate <= filters.discountRate;

      // 모든 선택된 언어가 포함되는지 검사 (every 사용)
      const languageMatch =
        filters.selectedLanguages.length === 0 ||
        filters.selectedLanguages.every((lang) =>
          game.supportedLanguages?.includes(lang)
        );

      const ageMatch =
        filters.ageRestriction === '전체' ||
        game.ageRestriction?.includes(filters.ageRestriction);

      return (
        genreMatch && priceMatch && discountMatch && languageMatch && ageMatch
      );
    });

    setFilteredGames(filtered);
    setDisplayedGames(filtered.slice(0, gamesPerPage));
    setPage(1);
    setHasMore(filtered.length > gamesPerPage);
  };

  // 무한 스크롤: 다음 페이지 데이터를 불러옴
  const loadMoreGames = () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    const nextGames = filteredGames.slice(0, nextPage * gamesPerPage);

    setDisplayedGames(nextGames);
    setPage(nextPage);

    if (nextGames.length >= filteredGames.length) {
      setHasMore(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    loadAllGames();
  }, []);

  // 필터 상태 업데이트 함수
  const updateFilter = (field, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
  };

  // 스크롤 이벤트 추가
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        loadMoreGames();
      }

      // 맨 위로 버튼 표시 조건
      if (window.scrollY > 300) {
        setIsScrollTopVisible(true);
      } else {
        setIsScrollTopVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredGames, page]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // 게임 클릭 시 GameDetail 페이지로 이동
  const handleGameClick = (appId) => {
    navigate(`/games/${appId}`); // 경로 이동
  };

  // 전달된 상태에서 selectedGenre가 있을 경우 필터 적용
  useEffect(() => {
    if (location.state?.selectedGenre) {
      // `allGames`가 로드된 후에 필터링을 적용해야 함
      if (allGames.length > 0) {
        filterByGenre(location.state.selectedGenre);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.selectedGenre, allGames]); // allGames와 selectedGenre 변경 시 실행

  // 디버깅을 위한 selectedGenre 상태 확인
  useEffect(() => {
    console.log(`Selected Genre State: ${selectedGenre}`);
  }, [selectedGenre]);

  return (
    <>
      <div>
        <Navbar />

        {/* 장르 필터 드롭다운 */}
        {isFilterButtonVisible && (
          <div className="genre-filter-dropdown">
            <select
              className="genre-select"
              value={selectedGenre}
              onChange={(e) => filterByGenre(e.target.value)} // 드롭다운에서 선택 시 필터링
            >
              <option value="">장르 필터</option>
              <option value="">전체</option>
              {[
                '액션',
                '전략',
                '캐주얼',
                '인디',
                '시뮬레이션',
                'RPG',
                '어드벤처',
                '레이싱',
                '스포츠',
                '애니메이션',
                '유틸리티',
              ].map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 장르 필터 바 (1500px 이상일 때만 보임) */}
        {!isFilterButtonVisible && (
          <div className="genre-filter-bar">
            <button
              className={`genre-button ${selectedGenre === "" ? "active" : ""}`}
              onClick={() => filterByGenre("")}
            >
              전체
            </button>
            {["액션", "전략", "캐주얼", "인디", "시뮬레이션", "RPG", "어드벤처", "레이싱", "스포츠", "애니메이션", "유틸리티"].map(
              (genre) => (
                <button
                  key={genre}
                  className={`genre-button ${selectedGenre === genre ? "active" : ""}`}
                  onClick={() => filterByGenre(genre)}
                >
                  {genre}
                </button>
              )
            )}
          </div>
        )}

        {/* 새로운 컨텐츠 래퍼 */}
        <div className="content-wrapper">
          {/* 왼쪽 필터 박스 */}
          <div className="filter-sidebar">
            <h3>필터</h3>
            {/* 장르 필터 */}
            <div>
              <label>장르</label>
              {['액션', '전략', '캐주얼', '인디', '시뮬레이션', 'RPG', '어드벤처', '레이싱', '스포츠', '애니메이션', '유틸리티'].map((genre) => (
                <div key={genre}>
                  <input
                    type="checkbox"
                    value={genre}
                    onChange={(e) =>
                      updateFilter(
                        'selectedGenres',
                        e.target.checked
                          ? [...filters.selectedGenres, e.target.value]
                          : filters.selectedGenres.filter((g) => g !== e.target.value),
                      )
                    }
                  />
                  <label>{genre}</label>
                </div>
              ))}
            </div>

            {/* 가격 범위 */}
            <div>
              <label>가격 범위</label>
              <input
                type="range"
                min="0"
                max="50000"
                value={filters.priceRange}
                onChange={(e) => updateFilter('priceRange', e.target.value)}
              />
              <span>₩0 - ₩{Number(filters.priceRange).toLocaleString()}</span>
            </div>

            {/* 출시일 */}
            <div>
              <label>출시일</label>
              <select
                value={filters.releaseDate || 'newest'}
                onChange={(e) => updateFilter('releaseDate', e.target.value)}
              >
                <option value="newest">최신순</option>
                <option value="oldest">오래된순</option>
              </select>
            </div>

            {/* 할인율 */}
            <div>
              <label>할인율</label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.discountRate}
                onChange={(e) => updateFilter('discountRate', e.target.value)}
              />
              <span>0% - {filters.discountRate}%</span>
            </div>

            {/* 지원 언어 */}
            <div>
              <label>지원 언어</label>
              {['영어', '프랑스어', '독일어', '이탈리아어', '일본어', '한국어', '스페인어', '러시아어'].map((lang) => (
                <div key={lang}>
                  <input
                    type="checkbox"
                    value={lang}
                    onChange={(e) =>
                      updateFilter(
                        'selectedLanguages',
                        e.target.checked
                          ? [...filters.selectedLanguages, e.target.value]
                          : filters.selectedLanguages.filter((l) => l !== e.target.value),
                      )
                    }
                  />
                  <label>{lang}</label>
                </div>
              ))}
            </div>

            {/* 이용 나이 */}
            <div>
              <label>이용 나이</label>
              <select
                value={filters.ageRestriction}
                onChange={(e) => updateFilter('ageRestriction', e.target.value)}
              >
                <option value="전체">전체</option>
                <option value="12">12</option>
                <option value="18">18</option>
                <option value="19">19</option>
              </select>
            </div>

            {/* 필터 적용 버튼 */}
            <button onClick={applyFilters}>필터 적용</button>
          </div>

          {/* 기존 게임 목록 */}
          <div className="game-grid">
            {displayedGames.length > 0 ? (
              displayedGames.map((game) => {
                const originalPrice = calculateOriginalPrice(
                  game.price,
                  game.discountRate
                );
                return (
                  <div
                    key={game.appId}
                    className="game-card"
                    onMouseEnter={() => setHoveredGame(game.appId)}
                    onMouseLeave={() => setHoveredGame(null)}
                    onClick={() => handleGameClick(game.appId)} // 페이지 이동 추가
                    style={{ cursor: 'pointer' }} // 클릭 가능한 스타일 추가
                  >
                    <LikeButton
                      appId={game.appId}
                      isLiked={likedGames.has(game.appId)}
                      onToggle={toggleLike}
                    />

                    {hoveredGame === game.appId ? (
                      <video
                        src={game.trailerUrl}
                        className="game-trailer-full"
                        autoPlay
                        loop
                        muted
                      />
                    ) : (
                      <>
                        <img
                          src={game.thumbnailUrl}
                          alt={game.gameName}
                          className="game-thumbnail"
                        />
                        <div className="game-info">
                          <div className="game-name">🎮 {game.gameName}</div>
                          <div className="game-pricing">
                            {game.price === 0 ? (
                              <span className="is-free">무료 게임</span>
                            ) : (
                              <>
                                {game.discountRate > 0 && (
                                  <span className="discount">
                                    -{game.discountRate}%
                                  </span>
                                )}
                                <div className="price-wrapper">
                                  {game.discountRate > 0 && (
                                    <span className="original-price">
                                      ₩{originalPrice.toLocaleString()}
                                    </span>
                                  )}
                                  <span className="current-price">
                                    ₩{game.price.toLocaleString()}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="no-games">조건에 맞는 게임이 없습니다.</p>
            )}
          </div>
        </div>

        <button className="fixed-cart-button" onClick={() => navigate('/cart')}>
          장바구니
        </button>

        {isScrollTopVisible && (
          <button
            className="scroll-to-top"
            onClick={scrollToTop}
            aria-label="맨 위로 가기"
          >
            ⬆️
          </button>
        )}

        {loading && <p className="loading">게임을 불러오는 중...</p>}
        {!hasMore && <p className="end">모든 게임을 확인했습니다!</p>}
      </div>

      <button
        className="cart-button" onClick={handleCartButtonClick} title="장바구니">
        🛒
        {cartItemCount > 0 && (
          <div className="cart-item-count">
            {cartItemCount}
          </div>
        )}
      </button>
    </>
  );
};

export default Category;
 