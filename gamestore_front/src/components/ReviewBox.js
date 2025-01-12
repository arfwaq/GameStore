import React, { useState, useEffect } from "react";
import {getPagedReviewsByGame, createReview, updateReview, deleteReview, getAverageRatingByGame,} from '../api/reviewApi';
import { decodeNicknameFromJWT, decodeJWT, saveEmailNicknamePair, getNicknameByEmail } from "../util/jwtUtil";
import "../css/ReviewBox.css";

const ReviewBox = ({ appId }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const userEmail = decodeJWT();
  const userNickname = decodeNicknameFromJWT();

  const fetchAverageRating = async () => {
    try {
      const average = await getAverageRatingByGame(appId); // 전체 평균 별점 가져오기
      setAverageRating(average.toFixed(1)); // 소수점 한 자리로 표시
    } catch (error) {
      console.error("Failed to fetch average rating:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await getPagedReviewsByGame(appId, page, 5);

      // 현재 로그인한 사용자의 이메일-닉네임 매핑 저장
      if (userEmail && userNickname) {
        saveEmailNicknamePair(userEmail, userNickname);
      }

      const reviewsWithNicknames = response.content.map((review) => ({
        ...review,
        nickname: review.email === userEmail
          ? userNickname
          : getNicknameByEmail(review.email) || review.email.split('@')[0], // 이메일의 @ 앞부분을 닉네임으로 사용
      }));

      setReviews(reviewsWithNicknames); // 리뷰 데이터 설정
      setTotalPages(response.totalPages); // 페이지 정보 설정
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

// 컴포넌트 로드 시 두 함수 호출
  useEffect(() => {
    fetchReviews();
    fetchAverageRating(); // 전체 평균 별점 가져오기
  }, [page]); // 페이지 변경 시에도 실행

  // 리뷰 작성할 때도 매핑 저장
  const handleReviewSubmit = async () => {
    if (!userEmail || !userNickname) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      // 리뷰 작성 시 이메일-닉네임 매핑 저장
      saveEmailNicknamePair(userEmail, userNickname);

      await createReview({
        appId,
        email: userEmail,
        nickname: userNickname,
        reviewContent: newReview,
        reviewRating: rating,
      });
      setNewReview("");
      setRating(5);
      fetchReviews();
      fetchAverageRating();
    } catch (error) {
      if (error.response && error.response.status === 500) {
        // 백엔드에서 중복 리뷰 예외 처리 응답 시
        alert("댓글은 한 개만 작성 가능합니다.");
    }else{
        console.error("Failed to create review:", error);
        alert("리뷰 작성 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleKeyPressSubmit = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 기본 Enter 동작(줄바꿈) 방지
      handleReviewSubmit();
    }
  };

  const handleReviewUpdate = async (reviewId) => {
    try {
      await updateReview(reviewId, {
        appId,
        reviewContent: editingContent,
        reviewRating: rating,
        nickname: userNickname, // 수정 시에도 닉네임 포함
      });
      setEditingReviewId(null);
      setEditingContent("");
      fetchReviews();
    } catch (error) {
      console.error("Failed to update review:", error);
    }
  };

  const handleKeyPressUpdate = (event, reviewId) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 기본 Enter 동작(줄바꿈) 방지
      handleReviewUpdate(reviewId);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      fetchReviews();
      fetchAverageRating();
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  return (
    <div className="review-box">
      <h3 className="review-title">리뷰 <span className="average-rating">(★ {averageRating})</span></h3>
      <div className="review-list">
        {reviews.map((review) => (
          <div key={review.reviewId} className="review-item">
            <div className="review-header">
              <div className="review-author">
                <span className="review-nickname">{review.nickname}</span>
                <span className="review-rating">★ {review.reviewRating}</span>
              </div>
            </div>
            {editingReviewId === review.reviewId ? (
              <div className="review-edit">
              <textarea
                className="review-textarea"
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                onKeyPress={(e) => handleKeyPressUpdate(e, editingReviewId)}
              />
                <div className="review-actions">
                  <button onClick={() => handleReviewUpdate(review.reviewId)}>완료</button>
                  <button onClick={() => setEditingReviewId(null)}>취소</button>
                </div>
              </div>
            ) : (
              <div className="review-body">
                <p className="review-content">{review.reviewContent}</p>
                {userEmail === review.email && (
                  <div className="review-actions">
                    <button
                      onClick={() => {
                        setEditingReviewId(review.reviewId);
                        setEditingContent(review.reviewContent);
                      }}
                    >
                      수정
                    </button>
                    <button onClick={() => handleReviewDelete(review.reviewId)}>삭제</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`pagination-button ${index === page ? 'active' : ''}`}
            onClick={() => setPage(index)}
            disabled={index === page}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="review-form">
      <textarea
        className="review-textarea"
        value={newReview}
        onChange={(e) => setNewReview(e.target.value)}
        placeholder="리뷰를 작성해주세요..."
        onKeyPress={handleKeyPressSubmit}
      />
        <div className="rating">
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              className={`star ${rating > index ? "selected" : ""}`}
              onClick={() => setRating(index + 1)}
            >★</span>
          ))}
        </div>
        <button className="submit-review-button" onClick={handleReviewSubmit}>리뷰 작성</button>
      </div>
    </div>
  );
  };

export default ReviewBox;