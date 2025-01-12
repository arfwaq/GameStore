import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FaqApi from '../../api/FaqApi';
import { FAQ_CATEGORIES } from './list/FaqCategories';
import { getCookie } from '../../util/cookieUtil'; // 쿠키 유틸리티 임포트
import '../../css/faqcreate.css';

const FaqDetail = () => {
  const { id } = useParams(); // URL 파라미터에서 FAQ id를 가져옴
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [categoryId, setCategoryId] = useState(2); // 기본값 1번 카테고리
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate(); // useNavigate 초기화
  const playerInfo = getCookie('player'); // 사용자 정보 가져오기

  // ADMIN 권한 확인
  useEffect(() => {
    if (!playerInfo || !playerInfo.roleNames.includes('ADMIN')) {
      alert('접근 권한이 없습니다. FAQ 목록 페이지로 이동합니다.');
      navigate('/support/faq'); // 권한이 없으면 FAQ 목록 페이지로 리다이렉트
    }
  }, [playerInfo, navigate]);

  // FAQ 데이터를 수정할 때, 기존 데이터를 불러와서 상태에 설정
  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        const response = await FaqApi.getFaqById(id); // id는 useParams에서 가져옴
        const { question, answer, categoryId } = response;
        setQuestion(question);
        setAnswer(answer);
        setCategoryId(categoryId);
      } catch (error) {
        console.error('FAQ 데이터를 불러오는 데 실패했습니다.', error);
        setError('FAQ 데이터를 불러오는 데 실패했습니다.');
      }
    };
    if (id) {
      fetchFaqData();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const faqData = {
      question,
      answer,
      categoryId, // 수정 시 필요 데이터
    };

    try {
      const response = await FaqApi.updateFaq(id, faqData); // id는 faqId로 매칭
      console.log('FAQ 수정 성공:', response);
      navigate(-1); // 이전 페이지로 이동
    } catch (error) {
      console.error('FAQ 수정 실패:', error);
      setError('FAQ 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // '전체' 카테고리 제외하기
  const filteredCategories = FAQ_CATEGORIES.filter(
    (category) => category.id !== 1
  );

  return (

    <div className="faq-create-container">
      <h2>FAQ 수정</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="category">카테고리</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => {
              const newCategoryId = parseInt(e.target.value, 10);
              setCategoryId(newCategoryId);
            }}
          >
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="question">질문</label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="answer">답변</label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? '수정 중...' : 'FAQ 수정'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FaqDetail;
