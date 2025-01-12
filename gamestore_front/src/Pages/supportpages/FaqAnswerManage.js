import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FaqApi from '../../api/FaqApi'; // FaqApi 임포트

const FaqAnswerManage = () => {
  const { id } = useParams(); // URL에서 id 파라미터 가져오기
  const [faq, setFaq] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);

  // FAQ 상세 조회
  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const faqDetail = await FaqApi.getFaqDetail(id);
        setFaq(faqDetail);
        setAnswer(faqDetail.answer || '');
      } catch (error) {
        console.error('FAQ 상세 정보를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchFaq();
  }, [id]);

  const handleSaveAnswer = async () => {
    const updatedFaq = { ...faq, answer };
    try {
      await FaqApi.updateFaq(id, updatedFaq);
      alert('답변이 저장되었습니다.');
    } catch (error) {
      console.error('FAQ 답변을 저장하는 데 실패했습니다.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>FAQ 답변 관리</h2>
      <h3>{faq.title}</h3>
      <p>{faq.content}</p>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="답변을 입력하세요"
      />
      <button onClick={handleSaveAnswer}>답변 저장</button>
    </div>
  );
};

export default FaqAnswerManage;
