import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import qnaApi from '../../api/QnaApi';
import { getCookie } from '../../util/cookieUtil';
import '../../css/qna.css';

const Qna = () => {
  const [inquiries, setInquiries] = useState([]); // 문의 목록 상태
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  const [isAdmin, setIsAdmin] = useState(false); // ADMIN 여부 확인 상태
  const navigate = useNavigate();

  const buttonRange = 10; // 한 번에 표시할 페이지 버튼 수

  useEffect(() => {
    const fetchInquiries = async () => {
      const playerInfo = getCookie('player');
      if (!playerInfo) {
        alert('로그인 후 이용 가능합니다.');
        navigate('/login');
        return;
      }

      setIsAdmin(playerInfo.roleNames.includes('ADMIN')); // ADMIN 여부 설정

      try {
        let response;
        if (playerInfo.roleNames.includes('ADMIN')) {
          response = await qnaApi.getAllInquiries(currentPage); // ADMIN: 전체 문의 가져오기
        } else {
          response = await qnaApi.getMyInquiries(playerInfo.email, currentPage); // USER: 내 문의 가져오기
        }

        setInquiries(response.content); // Page 객체의 content에 문의 목록이 있음
        setTotalPages(response.totalPages); // 총 페이지 수 설정
      } catch (error) {
        console.error('문의 목록 조회 실패:', error);
      }
    };

    fetchInquiries();
  }, [currentPage, navigate]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage); // 페이지 변경
    }
  };

  // 현재 페이지 범위 계산
  const startPage = Math.floor(currentPage / buttonRange) * buttonRange; // 시작 페이지
  const endPage = Math.min(startPage + buttonRange - 1, totalPages - 1); // 종료 페이지

  const handleInquiryClick = (id) => {
    // 특정 문의 상세 페이지로 이동
    navigate(`/support/qna/${id}`);
  };

  return (
    <div className="qna-container">
      <div>
        {/* 제목 변경: ADMIN 여부에 따라 */}
        <h2 class="qna-title">
          {isAdmin ? '요청 받은 문의 목록' : '내가 요청한 문의 목록'}
        </h2>
        {inquiries.length > 0 ? (
          <ul className="qna-list">
            {inquiries.map((inquiry) => (
              <li key={inquiry.id} className="qna-item">
                <button
                  className="qna-button"
                  onClick={() => handleInquiryClick(inquiry.id)}
                >
                  {isAdmin
                    ? `${inquiry.playerEmail}(${inquiry.playerNickname}) : ${inquiry.title}`
                    : inquiry.title}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-inquiries">등록된 문의가 없습니다.</p>
        )}
        {/* 페이지 네이션 */}
        <div className="qna-pagination">
          <button
            className="qna-pagination-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            {'←'}
          </button>
          {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
            <button
              key={index}
              className={`qna-pagination-button ${
                currentPage === startPage + index ? 'active' : ''
              }`}
              onClick={() => handlePageChange(startPage + index)}
            >
              {startPage + index + 1}
            </button>
          ))}
          <button
            className="qna-pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            {'→'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Qna;
