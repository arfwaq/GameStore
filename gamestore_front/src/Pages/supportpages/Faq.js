import React, { useState, useEffect, useCallback } from 'react';
import FaqApi from '../../api/FaqApi';
import { FAQ_CATEGORIES } from './list/FaqCategories';
import '../../css/Faq.css';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../util/cookieUtil';

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [categoryId, setCategoryId] = useState(1);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFaqs, setSelectedFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null); // 열려 있는 FAQ ID
  const navigate = useNavigate();
  const playerInfo = getCookie('player');
  const pageSize = 10;

  const fetchFaqs = useCallback(async () => {
    try {
      const response =
        categoryId === 1
          ? await FaqApi.getFaqList(page, pageSize)
          : await FaqApi.getFaqsByCategory(categoryId, page, pageSize);
      if (response.content) {
        setFaqs(response.content);
        setTotalPages(response.totalPages);
        setSelectedFaqs([]); // 페이지 변경 시 선택 초기화
      }
    } catch (error) {
      console.error('FAQ 데이터를 불러오는 데 실패했습니다.');
    }
  }, [categoryId, page, pageSize]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleDeleteFaqs = async () => {
    if (selectedFaqs.length === 0) {
      alert('삭제할 FAQ를 선택해주세요.');
      return;
    }
    if (window.confirm('선택한 FAQ를 삭제하시겠습니까?')) {
      try {
        for (const faqId of selectedFaqs) {
          await FaqApi.deleteFaq(faqId);
        }
        alert('FAQ가 성공적으로 삭제되었습니다.');
        fetchFaqs(); // 삭제 후 FAQ 목록 갱신
      } catch (error) {
        console.error('FAQ 삭제 실패:', error);
        alert('FAQ 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleCheckboxChange = (faqId) => {
    setSelectedFaqs((prevSelected) =>
      prevSelected.includes(faqId)
        ? prevSelected.filter((id) => id !== faqId)
        : [...prevSelected, faqId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFaqs.length === faqs.length) {
      setSelectedFaqs([]); // 모두 선택된 상태라면 해제
    } else {
      setSelectedFaqs(faqs.map((faq) => faq.faqId)); // 현재 페이지 FAQ 모두 선택
    }
  };

  const handleToggleAnswer = (faqId) => {
    setOpenFaq(openFaq === faqId ? null : faqId); // 클릭한 FAQ를 토글
  };

  const getCategoryName = (id) => {
    const category = FAQ_CATEGORIES.find((cat) => cat.id === id);
    return category ? category.name : '알 수 없음';
  };

  const transformAnswer = (answer) => {
    const inquireLink = '/support/inquire';
    const regex = /문의하기/g;
    return answer.replace(
      regex,
      `<a href="${inquireLink}" class="inquire-link">문의하기</a>`
    );
  };

  return (
    <div className="faq-container">
      <h2>자주 묻는 질문</h2>
      <div className="faq-categories">
        {FAQ_CATEGORIES.map((category) => (
          <button
            key={category.id}
            className={categoryId === category.id ? 'active' : ''}
            onClick={() => {
              setCategoryId(category.id);
              setPage(0);
            }}
          >
            {category.name}
          </button>
        ))}
      </div>
      {playerInfo?.roleNames.includes('ADMIN') && (
        <div className="admin-actions">
          <button
            onClick={() => navigate('/support/faq/create')}
            className="register-button"
          >
            FAQ 등록
          </button>
          <button
            onClick={handleDeleteFaqs}
            className="delete-button"
            disabled={selectedFaqs.length === 0}
          >
            선택 삭제
          </button>
          <button onClick={handleSelectAll} className="select-all">
            {selectedFaqs.length === faqs.length ? '전체 해제' : '전체 선택'}
          </button>
        </div>
      )}
      <ul className="faq-list">
        {faqs.map((faq) => (
          <li key={faq.faqId} className="faq-item">
            {playerInfo?.roleNames.includes('ADMIN') && (
              <input
                type="checkbox"
                checked={selectedFaqs.includes(faq.faqId)}
                onChange={() => handleCheckboxChange(faq.faqId)}
              />
            )}
            <div
              onClick={() => handleToggleAnswer(faq.faqId)}
              className="faq-question"
            >
              Q. [{getCategoryName(faq.categoryId)}] {faq.question}
            </div>
            {openFaq === faq.faqId && (
              <div
                className="faq-answer"
                dangerouslySetInnerHTML={{
                  __html: transformAnswer(faq.answer),
                }}
              />
            )}
            {playerInfo?.roleNames.includes('ADMIN') && (
              <button
                className="modify-button"
                onClick={() => navigate(`/support/faq/edit/${faq.faqId}`)}
              >
                수정
              </button>
            )}
          </li>
        ))}
      </ul>
      <div className="faq-pagination">
        <button
          className="faq-page-movebutton"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          {'←'}
        </button>
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            className={`faq-page-button ${page === idx ? 'active' : ''}`}
            onClick={() => setPage(idx)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="faq-page-movebutton"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page === totalPages - 1}
        >
          {'→'}
        </button>
      </div>
    </div>
  );
};

export default Faq;
