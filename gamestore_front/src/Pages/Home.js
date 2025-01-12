import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import "../css/home.css";
import { useNavigate } from "react-router-dom";
import { getFilteredGames } from "../api/todoApi"; // 게임 데이터 API 호출

import { getCartItems as getGameCartItems } from "../api/cartApi"; // 장바구니 API 가져오기
import EqCartApi from "../api/EqCartApi"; // 장비 카트 API

import "../image/Frame 18.png";
import news1 from "../image/news1.png"; // 정적으로 임포트한 뉴스 이미지
import news2 from "../image/new2.jpg";
import news3 from "../image/new3.png"
import news4 from "../image/new4.jpg";
import news5 from "../image/new5.png"
import news6 from "../image/new6.png";
import instagramlogo from "../image/Instagram logo.png";
import twitterlogo from "../image/Twitter_logo.png";
import youtubelogo from "../image/youtube logo 05.png";
import axios from "axios";
import gamelogo from "../image/gamelogo.png"

const Home = () => {
    const navigate = useNavigate();

    const [allGames, setAllGames] = useState([]);
    const [newGames, setNewGames] = useState([]);
    const [saleGames, setSaleGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [news, setNews] = useState([]); // 뉴스 데이터를 저장할 상태
    const [cartItemCount, setCartItemCount] = useState(0); // 카트 아이템 갯수


    const [featuredGames, setFeaturedGames] = useState([]);
    const [selectedFeaturedGame, setSelectedFeaturedGame] = useState(null);
    const sliderRef = useRef(null);

// 뉴스 이미지
    const newsImages = [news1, news2, news3, news4, news5, news6];


    // 할인필터링
    const calculateOriginalPrice = (price, discountRate) => {
        return discountRate > 0 ? Math.round(price / (1 - discountRate / 100)) : price;
    };

    //게임 가져옴
    const loadAllGames = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await getFilteredGames();
            if (response && response.length > 0) {
                setAllGames(response);
                filterNewGames(response);
                filterSaleGames(response);

                // recommendations 높은 순으로, trailerUrl이 존재하는 게임 중 상위 6개 가져오기
                const topRecommendedGames = [...response]
                    .filter((game) => game.trailerUrl) // trailerUrl이 null이 아닌 게임만 필터링
                    .sort((a, b) => b.recommendations - a.recommendations) // recommendations 기준 내림차순 정렬
                    .slice(216, 300); // 상위 6개 추출
                setFeaturedGames(topRecommendedGames);
                setSelectedFeaturedGame(topRecommendedGames[0]); // 첫 번째 게임 선택
            }
        } catch (error) {
            console.error("게임 데이터를 불러오지 못했습니다:", error.message);
        } finally {
            setLoading(false);
        }
    };

    // 뉴스 데이터를 가져오는 함수
    const loadNews = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/news/list", {
                params: {
                    sortBy: "createdAt", // 최신순 정렬
                    order: "desc",
                    page: 0,
                    size: 6, // 최대 6개 뉴스 가져오기
                },
            });
            setNews(response.data.content || []);
        } catch (error) {
            console.error("뉴스 데이터를 가져오지 못했습니다:", error.message);
        }
    };
//게임필터
    const filterNewGames = (games) => {
        const sorted = [...games].sort(
            (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );
        setNewGames(sorted.slice(0, 20));
    };

    const filterSaleGames = (games) => {
        const filtered = games.filter((g) => g.discountRate > 0);
        setSaleGames(filtered.slice(0, 6));
    };

    useEffect(() => {
        loadAllGames();
        loadNews();
    }, []);

    const handleScroll = (direction) => {
        const container = sliderRef.current;
        const scrollDistance = 308;

        if (direction === "left") {
            container.scrollBy({ left: -scrollDistance, behavior: "smooth" });
        } else if (direction === "right") {
            container.scrollBy({ left: scrollDistance, behavior: "smooth" });
        }
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


    //장바구니 버튼
    const handleCartButtonClick = () => {
        navigate("/cart"); // 장바구니 페이지로 이동
    };
    
    return (
        <>
            <Navbar/>
            <div className="home_container">
                <section className="home_banner-wrapper">
                    <div className="home_banner">
                        <div className="home_banner-bg">
                            {selectedFeaturedGame && selectedFeaturedGame.trailerUrl ? (
                                <video
                                    src={selectedFeaturedGame.trailerUrl}
                                    className="home_banner-video"
                                    autoPlay
                                    muted
                                    loop
                                />
                            ) : (
                                <div className="home_banner-image"/>
                            )}
                        </div>

                        <div className="home_banner-overlay">
                            <div className="home_banner-content">
                                <h1>
                                    {selectedFeaturedGame
                                        ? selectedFeaturedGame.gameName
                                        : "LOCKDOWN Protocol"}
                                </h1>
                                <p>
                                    {selectedFeaturedGame && selectedFeaturedGame.gameDescription
                                        ? selectedFeaturedGame.gameDescription
                                        : "왜 못가져옴 real-time action and communication (3 to 8 players)."}
                                </p>

                                <button
                                    className="home_more-btn"
                                    onClick={() => navigate(`/games/${selectedFeaturedGame?.appId}`)}
                                >
                                    더보기 >
                                </button>
                            </div>
                        </div>

                        <div className="home_banner-thumbnails-container">
                            <button
                                className="slider-button left"
                                onClick={() => handleScroll("left")}
                            >
                                ◀
                            </button>
                            <div className="home_banner-thumbnails" ref={sliderRef}>
                                {featuredGames.length > 0 ? (
                                    featuredGames.map((game) => (
                                        <div
                                            key={game.appId}
                                            className="home_banner-thumbnail"
                                            onClick={() => setSelectedFeaturedGame(game)}
                                        >
                                            <img src={game.thumbnailUrl} alt={game.gameName}/>
                                        </div>
                                    ))
                                ) : (
                                    <p>로딩 중이거나 데이터가 없습니다.</p>
                                )}
                            </div>
                            <button
                                className="slider-button right"
                                onClick={() => handleScroll("right")}
                            >
                                ▶
                            </button>
                        </div>
                    </div>
                </section>

            </div>

            {/*    중간시작  */}
            <div className="home_second_all">
                <section className="home_new-arrivals">
                    <h2>새로운 게임을 발견하세요</h2>
                    <div className="home_game-grid">
                        {newGames.map((game) => (
                            <div key={game.appId} className="home_game-card"
                                 onClick={() => navigate(`/games/${game.appId}`)}>
                                <img src={game.thumbnailUrl} alt={game.gameName} className="home_game-image"/>
                                <div className="home_game-info">
                                    <h3>{game.gameName}</h3>
                                    <p>{game.gameDescription.slice(0, 50)}...</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // 부모 클릭 이벤트 방지
                                            navigate(`/games/${game.appId}`);
                                        }}
                                        className="home_game-btn"
                                    >
                                        상점에서 보기
                                    </button>
                                </div>
                            </div>

                        ))}
                    </div>
                </section>
            </div>
            {/*베너 넣기 여기에*/}
            <div className="home_banner-middle">
                <img
                    src={require("../image/Frame 18.png")} // 이미지 삽입
                    alt="중간 베너"
                    className="home_banner-middle-img"
                />
            </div>


            {/*할인*/}
            <div className="home_discount_game">
                <section className="discount-section">
                    <h2>인기 할인 게임</h2>
                    <div className="discount-game-grid">
                        {allGames
                            .filter((game) => game.discountRate > 0 && game.appId) // 할인률 > 0이고 appId가 존재하는 경우
                            .sort((a, b) => b.recommendations - a.recommendations) // 추천 순위 기준 내림차순 정렬
                            .slice(0, 20) // 상위 20개로 변경
                            .map((game, index) => (
                                <div key={game.appId} className="discount-game-card"
                                     onClick={() => navigate(`/games/${game.appId}`)}>
                                    <img src={game.thumbnailUrl} alt={game.gameName}
                                         className="discount-game-thumbnail"/>
                                    <div className="discount-game-info">
                                        <div className="discount-game-title">🎮 {game.gameName}</div>
                                        <div className="discount-game-pricing">
                                            <span className="discount-rate">-{game.discountRate}%</span>
                                            <div className="price-wrapper">
                            <span className="original-price">
                                ₩{calculateOriginalPrice(game.price, game.discountRate).toLocaleString()}
                            </span>
                                                <span className="current-price">₩{game.price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                </section>
            </div>


            {/* 뉴스 */}

            <div className="home_news_update">
                <section className="news-section">
                    <h2>새롭게 알려드립니다</h2>
                    <div className="news-grid">
                        {news.map((item, index) => (
                            <div key={item.id || index} className="news-card">
                                <div
                                    className="news-thumbnail"
                                    style={{
                                        backgroundImage: `url(${newsImages[index % newsImages.length]})`,
                                    }} // 뉴스 이미지 순환
                                />
                                <div className="news-content">
                                    <h3>{item.title}</h3>
                                    <p>{item.updatedAt}</p>

                                    {/* 더보기 버튼 추가 */}
                                    <button
                                        className="news-read-more-btn"
                                        onClick={() => navigate(`/news/${item.id}`)} // 고유 식별자를 사용한 경로로 이동
                                    >
                                        더보기 >
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="home_footer">
                <div className="footer-content">
                    {/* 로고 및 카피라이트 */}
                    <div className="footer-logo-section">
                        <div className="footer-logo">
                            <img src= {gamelogo }alt="Company Logo" className="footer-logo-image"/>
                        </div>
                        <p>&copy; 2024 YourCompany. All rights reserved.</p>
                        <p>
                            All trademarks are property of their respective owners in the US and other countries.
                            <br/>
                            VAT included in all prices where applicable.
                        </p>
                    </div>

                    {/* 정책 및 약관 링크 */}
                    <div className="footer-links">
                        <a href="#">Privacy Policy</a> |
                        <a href="#">Legal</a> |
                        <a href="#">Refunds</a> |
                        <a href="#">Cookies</a>
                    </div>

                    {/* 소셜 아이콘 및 추가 링크 */}
                    <div className="footer-bottom">
                        <ul className="footer-icons">
                            <li><a href="#"> <img src={youtubelogo} alt="YouTube"/></a></li>
                            <li><a href="#"> <img src={instagramlogo} alt="Instagram"/></a></li>
                            <li><a href="#"><img src={twitterlogo} alt="Twitter"/></a></li>
                        </ul>
                        <ul className="footer-social-links">
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Jobs</a></li>
                            <li><a href="#">Distribution</a></li>
                            <li><a href="#">Support</a></li>
                            <li><a href="#">Gift Cards</a></li>
                            <li><a href="#">Community</a></li>
                            <li><a href="#">@YourCompany</a></li>
                        </ul>
                    </div>
                </div>
            </footer>

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

export default Home;