// src/Pages/navpage/NewsDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import jwtAxios, { decodeJWT } from '../../util/jwtUtil';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewsDetails = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const navigate = useNavigate();
  const userEmail = decodeJWT();

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

  const fetchNewsDetails = async () => {
    setLoading(true);
    try {
      const response = await jwtAxios.get(
        `http://localhost:8080/api/news/${id}`
      );
      console.log('원본 내용:', response.data.contents);

      const cleanedContents = cleanContent(response.data.contents);
      console.log('이미지 URL 제거 후 내용:', cleanedContents);

      const fetchedNews = {
        title: response.data.title,
        contents: cleanedContents,
        publish_date: response.data.publish_date,
        hasUpvoted: response.data.hasUpvoted || false,
        hasDownvoted: response.data.hasDownvoted || false,
        recommends: response.data.recommends || 0,
        downvotes: response.data.downvotes || 0,
      };
      setNewsItem(fetchedNews);
    } catch (err) {
      console.error('뉴스 상세 정보를 가져오는 중 오류 발생:', err);
      setError('뉴스 상세 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (page = 0) => {
    setCommentLoading(true);
    try {
      const response = await jwtAxios.get(
        `http://localhost:8080/api/comments/news/${id}`,
        {
          params: { page, size: 5, sort: 'createdAt,desc' },
        }
      );
      const fetchedComments = response.data.content.map((comment) => ({
        ...comment,
        hasUpvoted: comment.hasUpvoted || false,
        hasDownvoted: comment.hasDownvoted || false,
      }));
      setComments(fetchedComments);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (err) {
      console.error('댓글을 가져오는 중 오류 발생:', err);
      setError('댓글을 불러오는 데 실패했습니다.');
    } finally {
      setCommentLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsDetails();
    fetchComments(0);
  }, [id]);

  const handleNewsToggle = async (action) => {
    if (!userEmail) {
      alert('로그인이 필요합니다.');
      toast.info('로그인이 필요합니다.');
      navigate('/player/login');
      return;
    }

    if (action === 'like' && newsItem.hasUpvoted) {
      toast.warning('이미 추천하셨습니다.');
      return;
    }
    if (action === 'dislike' && newsItem.hasDownvoted) {
      toast.warning('이미 비추천하셨습니다.');
      return;
    }

    setActionLoading(true);

    try {
      const response = await jwtAxios.patch(
        `http://localhost:8080/api/news/${id}/${
          action === 'like' ? 'recommend' : 'downvote'
        }`
      );

      if (response.status === 200) {
        console.log('추천/비추천 응답 데이터:', response.data);
        await fetchNewsDetails();
        toast.success(
          `${
            action === 'like' ? '추천' : '비추천'
          }이 성공적으로 반영되었습니다.`
        );
      }
    } catch (err) {
      console.error(
        `${action === 'like' ? '추천' : '비추천'} 중 오류 발생:`,
        err
      );
      toast.error(
        `${
          action === 'like' ? '추천' : '비추천'
        }에 실패했습니다. 다시 시도해주세요.`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentContent.trim()) {
      toast.warning('댓글 내용을 입력하세요.');
      return;
    }

    if (!userEmail) {
      toast.info('로그인이 필요합니다.');
      alert('로그인이 필요합니다.');
      navigate('/player/login');
      return;
    }

    setCommentSubmitting(true);

    try {
      await jwtAxios.post(`http://localhost:8080/api/comments/news/${id}`, {
        username: userEmail,
        content: commentContent,
      });
      setCommentContent('');
      toast.success('댓글이 성공적으로 작성되었습니다.');
      fetchComments(currentPage);
    } catch (err) {
      console.error('댓글 작성 중 오류 발생:', err);
      toast.error('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleViewAllComments = () => {
    navigate(`/comments/${id}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchComments(newPage);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  useEffect(() => {
    console.log('현재 뉴스 아이템 상태:', newsItem);
  }, [newsItem]);

  if (loading) return <div>뉴스 상세 정보를 불러오는 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Navbar />
      <div
        className="news-details-container"
        style={{
          maxWidth: '800px',
          margin: '20px auto',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <div
          className="news-content"
          style={{
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
          }}
        >
          <h1
            style={{
              fontSize: '2rem',
              color: '#333',
              marginBottom: '15px',
            }}
          >
            {newsItem?.title}
          </h1>

          <p
            style={{
              color: '#666',
              fontSize: '0.9rem',
              marginBottom: '20px',
            }}
          >
            발행일: {formatDate(newsItem?.publish_date)}
          </p>

          <div
            style={{
              color: '#333',
              lineHeight: '1.8',
              fontSize: '1.1rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              marginBottom: '30px',
            }}
          >
            {newsItem?.contents}
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '30px',
            }}
          >
            <button
              onClick={() => handleNewsToggle('like')}
              disabled={newsItem.hasUpvoted || actionLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: newsItem.hasUpvoted ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor:
                  newsItem.hasUpvoted || actionLoading
                    ? 'not-allowed'
                    : 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              {actionLoading && !newsItem.hasUpvoted
                ? '👍 추천 중...'
                : `👍 좋아요 (${newsItem.recommends || 0})`}
            </button>

            <button
              onClick={() => handleNewsToggle('dislike')}
              disabled={newsItem.hasDownvoted || actionLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: newsItem.hasDownvoted ? '#6c757d' : '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor:
                  newsItem.hasDownvoted || actionLoading
                    ? 'not-allowed'
                    : 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              {actionLoading && !newsItem.hasDownvoted
                ? '👎 비추천 중...'
                : `👎 싫어요 (${newsItem.downvotes || 0})`}
            </button>
          </div>
        </div>

        <div className="comments-section" style={{ marginTop: '30px' }}>
          <h2
            style={{
              fontSize: '1.5rem',
              color: '#333',
              marginBottom: '20px',
            }}
          >
            댓글
          </h2>

          <div className="comment-form" style={{ marginBottom: '30px' }}>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 작성하세요...( 댓글을 작성하려면 로그인이 필요합니다. )"
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                marginBottom: '10px',
                minHeight: '100px',
                resize: 'vertical',
              }}
            />
            <button
              onClick={handleAddComment}
              disabled={commentSubmitting}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: commentSubmitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              {commentSubmitting ? '제출 중...' : '댓글 작성'}
            </button>
          </div>

          {commentLoading ? (
            <p>댓글을 불러오는 중...</p>
          ) : (
            <div className="comments-list">
              {comments.length > 0 ? (
                <>
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      style={{
                        padding: '15px',
                        borderBottom: '1px solid #eee',
                        marginBottom: '15px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                      }}
                    >
                      <div
                        style={{
                          color: '#1a73e8', // 작성자 이름 색상을 파란색으로 변경
                          fontWeight: 'bold',
                          marginBottom: '8px',
                          fontSize: '0.95rem',
                        }}
                      >
                        사용자 : {comment.username}
                      </div>
                      <div
                        style={{
                          color: 'black', // 댓글 내용 색상을 진한 회색으로 변경
                          marginBottom: '8px',
                          lineHeight: '1.5',
                        }}
                      >
                        댓글내용 : {comment.content}
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: '#66b',
                        }}
                      >
                        작성일: {formatDate(comment.createdAt)}
                        {comment.updatedAt && (
                          <span>
                            {' '}
                            | 수정일: {formatDate(comment.updatedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {totalPages > 1 && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '20px',
                        padding: '10px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        flexWrap: 'wrap',
                      }}
                    >
                      {/* 첫 페이지로 이동 */}
                      <button
                        onClick={() => handlePageChange(0)}
                        disabled={currentPage === 0}
                        style={{
                          padding: '8px 16px',
                          backgroundColor:
                            currentPage === 0 ? '#e9ecef' : '#0d6efd',
                          color: currentPage === 0 ? '#6c757d' : 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                          fontWeight: '500',
                          minWidth: '70px',
                        }}
                      >
                        ≪ 처음
                      </button>

                      {/* 이전 그룹으로 이동 */}
                      <button
                        onClick={() =>
                          handlePageChange(
                            Math.max(0, Math.floor((currentPage - 5) / 5) * 5)
                          )
                        }
                        disabled={currentPage < 5}
                        style={{
                          padding: '8px 16px',
                          backgroundColor:
                            currentPage < 5 ? '#e9ecef' : '#0d6efd',
                          color: currentPage < 5 ? '#6c757d' : 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: currentPage < 5 ? 'not-allowed' : 'pointer',
                          fontWeight: '500',
                          minWidth: '70px',
                        }}
                      >
                        ＜ 이전
                      </button>

                      {/* 페이지 번호 버튼들 */}
                      {[
                        ...Array(
                          Math.min(
                            5,
                            totalPages - Math.floor(currentPage / 5) * 5
                          )
                        ),
                      ].map((_, idx) => {
                        const pageNum = Math.floor(currentPage / 5) * 5 + idx;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            style={{
                              padding: '8px 12px',
                              backgroundColor:
                                currentPage === pageNum ? '#0d6efd' : 'white',
                              color:
                                currentPage === pageNum ? 'white' : '#0d6efd',
                              border: '1px solid #0d6efd',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              minWidth: '40px',
                              fontWeight:
                                currentPage === pageNum ? '600' : '400',
                            }}
                          >
                            {pageNum + 1}
                          </button>
                        );
                      })}

                      {/* 다음 그룹으로 이동 */}
                      <button
                        onClick={() =>
                          handlePageChange(
                            Math.min(
                              totalPages - 1,
                              Math.ceil((currentPage + 1) / 5) * 5
                            )
                          )
                        }
                        disabled={
                          Math.floor(currentPage / 5) ===
                          Math.floor((totalPages - 1) / 5)
                        }
                        style={{
                          padding: '8px 16px',
                          backgroundColor:
                            Math.floor(currentPage / 5) ===
                            Math.floor((totalPages - 1) / 5)
                              ? '#e9ecef'
                              : '#0d6efd',
                          color:
                            Math.floor(currentPage / 5) ===
                            Math.floor((totalPages - 1) / 5)
                              ? '#6c757d'
                              : 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor:
                            Math.floor(currentPage / 5) ===
                            Math.floor((totalPages - 1) / 5)
                              ? 'not-allowed'
                              : 'pointer',
                          fontWeight: '500',
                          minWidth: '70px',
                        }}
                      >
                        다음 ＞
                      </button>

                      {/* 마지막 페이지로 이동 */}
                      <button
                        onClick={() => handlePageChange(totalPages - 1)}
                        disabled={currentPage === totalPages - 1}
                        style={{
                          padding: '8px 16px',
                          backgroundColor:
                            currentPage === totalPages - 1
                              ? '#e9ecef'
                              : '#0d6efd',
                          color:
                            currentPage === totalPages - 1
                              ? '#6c757d'
                              : 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor:
                            currentPage === totalPages - 1
                              ? 'not-allowed'
                              : 'pointer',
                          fontWeight: '500',
                          minWidth: '70px',
                        }}
                      >
                        마지막 ≫
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p
                  style={{
                    textAlign: 'center',
                    color: '#666',
                    marginTop: '20px',
                  }}
                >
                  댓글이 없습니다.
                </p>
              )}
            </div>
          )}

          <button
            onClick={handleViewAllComments}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '100%',
              transition: 'background-color 0.2s',
            }}
          >
            모든 댓글 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;
