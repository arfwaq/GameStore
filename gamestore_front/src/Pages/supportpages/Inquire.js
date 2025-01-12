import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import inquiryApi from '../../api/InquiryApi';
import styles from '../../css/inquire.module.css';

function Inquire() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // API 호출로 문의 등록
      await inquiryApi.createInquiry(title, content);
      alert('문의가 성공적으로 등록되었습니다.');

      // QnA 페이지로 이동
      navigate('/support/qna');
    } catch (error) {
      console.error('문의 등록 실패:', error.message);
      alert(
        error.message || '문의 등록 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.inqcontainer}>
      <h1>문의 하기</h1>
      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">문의하기</button>
    </form>
  );
}

export default Inquire;
