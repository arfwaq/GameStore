import React, { useEffect, useState } from 'react';
import FaqApi from '../../api/FaqApi';
import { FAQ_CATEGORIES } from './list/FaqCategories';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../util/cookieUtil';
import '../../css/faqcreate.css'; // CSS 파일 import

const FaqCreate = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [categoryId, setCategoryId] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const playerInfo = getCookie('player');

  useEffect(() => {
    if (!playerInfo || !playerInfo.roleNames.includes('ADMIN')) {
      alert('접근 권한이 없습니다. 메인 페이지로 이동합니다.');
      navigate('/support/faq');
    }
  }, [playerInfo, navigate]);

  useEffect(() => {
    console.log(
      '현재 선택된 카테고리:',
      FAQ_CATEGORIES.find((c) => c.id === categoryId)
    );
  }, [categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const faqData = {
      question,
      answer,
      categoryId,
    };

    setLoading(true);
    setError('');

    try {
      const response = await FaqApi.createFaq(faqData);
      console.log('FAQ 생성 성공:', response);
      navigate('/support/faq');
    } catch (error) {
      console.error('FAQ 생성 실패:', error);
      setError('FAQ 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = FAQ_CATEGORIES.filter(
    (category) => category.id !== 1
  );

  return (
    <div className="faq-create-container">
      <h2>FAQ 등록</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="category">카테고리</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => {
              const newCategoryId = parseInt(e.target.value, 10);
              setCategoryId(newCategoryId);
              console.log('Selected categoryId:', newCategoryId);
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
          {loading ? '생성 중...' : 'FAQ 생성'}
        </button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
};

export default FaqCreate;
