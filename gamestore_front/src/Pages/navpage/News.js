// src/Pages/navpage/News.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const News = () => {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [lastSortBy, setLastSortBy] = useState('');

  const observer = useRef();

  // 이미지 URL과 관련 링크 제거 함수 개선
  const cleanContent = (text) => {
    if (!text) return '';

    const patterns = [
      /https?:\/\/\S+?\.(?:png|jpe?g|gif|bmp|webp|svg|ico)\b/gi,
      /'https?:\/\/\S+?\.(?:png|jpe?g|gif|bmp|webp|svg|ico)\b'/gi,
      /"https?:\/\/\S+?\.(?:png|jpe?g|gif|bmp|webp|svg|ico)\b"/gi,
      /\[https?:\/\/\S+?\.(?:png|jpe?g|gif|bmp|webp|svg|ico)\]/gi,
    ];

    let cleanedText = text;
    patterns.forEach((pattern) => {
      cleanedText = cleanedText.replace(pattern, '');
    });

    cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n');
    return cleanedText.trim();
  };

  const lastNewsElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'http://localhost:8080/api/news/list',
          {
            params: {
              sortBy: sortBy,
              order: 'desc',
              page: currentPage - 1,
              size: 10,
            },
          }
        );

        const cleanedContent = response.data.content.map((item) => ({
          ...item,
          contents: cleanContent(item.contents),
        }));

        setNews((prevNews) =>
          currentPage === 1
            ? cleanedContent || []
            : [...(prevNews || []), ...(cleanedContent || [])]
        );
        setHasMore(!response.data.last);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage, sortBy]);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleSortChange = (criteria) => {
    if (criteria !== sortBy) {
      setSortBy(criteria);
      setLastSortBy(criteria);
      setNews([]);
      setCurrentPage(1);
      setHasMore(true);
    }
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          padding: '20px',
          maxWidth: '900px',
          margin: '0 auto',
          color: '#000',
        }}
      >
        <h1
          style={{ textAlign: 'center', color: 'white', marginBottom: '30px' }}
        >
          News List
        </h1>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '30px',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <button
            onClick={() => handleSortChange('createdAt')}
            style={{
              padding: '10px 20px',
              backgroundColor: sortBy === 'createdAt' ? '#0056b3' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            최신순
          </button>
          <button
            onClick={() => handleSortChange('recommends')}
            style={{
              padding: '10px 20px',
              backgroundColor: sortBy === 'recommends' ? '#d39e00' : '#ffc107',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            추천순
          </button>
          <button
            onClick={() => handleSortChange('downvotes')}
            style={{
              padding: '10px 20px',
              backgroundColor: sortBy === 'downvotes' ? '#bd2130' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            비추천순
          </button>
          <button
            onClick={() => handleSortChange('commentCount')}
            style={{
              padding: '10px 20px',
              backgroundColor:
                sortBy === 'commentCount' ? '#0d6efd' : '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            댓글순
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {news.length > 0
            ? news.map((item, index) => (
                <div
                  key={item.id}
                  ref={index === news.length - 1 ? lastNewsElementRef : null}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s',
                    ':hover': {
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <h2
                    style={{
                      color: '#2c3e50',
                      fontSize: '1.5rem',
                      marginBottom: '10px',
                    }}
                  >
                    {item.title}
                  </h2>

                  {item.publishDate && (
                    <p
                      style={{
                        color: '#666',
                        fontSize: '0.9rem',
                        marginBottom: '15px',
                      }}
                    >
                      Published on: {formatDate(item.publishDate)}
                    </p>
                  )}

                  <div
                    style={{
                      color: '#2c3e50',
                      lineHeight: '1.6',
                      marginBottom: '15px',
                      display: '-webkit-box',
                      WebkitLineClamp: '3',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.contents}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '15px',
                      paddingTop: '15px',
                      borderTop: '1px solid #eee',
                    }}
                  >
                    <div style={{ color: '#666' }}>
                      💬 댓글 {item.commentCount || 0} | 👍 추천{' '}
                      {item.recommends || 0} | 👎 비추천 {item.downvotes || 0}
                    </div>

                    <Link
                      to={`/news/${item.id}`}
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        transition: 'background-color 0.2s',
                      }}
                    >
                      자세히 보기
                    </Link>
                  </div>
                </div>
              ))
            : !loading && (
                <p style={{ textAlign: 'center', color: '#666' }}>
                  등록된 뉴스가 없습니다.
                </p>
              )}
        </div>

        {loading && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
            뉴스를 불러오는 중...
          </p>
        )}

        {!hasMore && !loading && news.length > 0 && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
            더 이상 불러올 뉴스가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default News;
