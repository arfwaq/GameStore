import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // useParams로 URL 파라미터 받아오기
import qnaApi from '../../api/QnaApi'; // qnaApi 모듈 import
import AnswerSection from './AnswerSection';
import { getCookie } from '../../util/cookieUtil'; // 권한 확인을 위한 getCookie import
import styles from '../../css/qnadetail.module.css';

function QnaDetail() {
  const { id } = useParams(); // URL에서 id 파라미터를 받아옴
  const navigate = useNavigate(); //프로그래밍적 이동에 사용
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // ADMIN 여부 확인

  useEffect(() => {
    const playerInfo = getCookie('player');
    if (playerInfo && playerInfo.roleNames.includes('ADMIN')) {
      setIsAdmin(true);
    }
  }, []); // 컴포넌트가 마운트될 때 권한 확인

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const data = await qnaApi.getInquiryById(id); // ID로 문의 데이터 가져오기
        setInquiry(data); // 가져온 데이터 저장
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        alert('문의 상세 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchInquiry();
  }, [id]); // id가 변경될 때마다 다시 데이터 가져오기

  const handleEdit = () => {
    navigate(`/support/qna/edit/${id}`); // 수정 페이지로 이동
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        await qnaApi.deleteInquiry(id); // API통해 삭제 요청
        alert('문의 삭제 완료');
        navigate('/support/qna'); // 삭제 후 목록 페이지로 이동
      } catch (error) {
        console.error('삭제 실패:', error);
        alert('문의 삭제 실패.');
      }
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }
  if (!inquiry) {
    return <div>문의 데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.qnaDetailContainer}>
      <h2>문의 상세 보기</h2>
      <div>
        <h3>제목 : {inquiry.title}</h3>
        <p>문의 내용 : {inquiry.content}</p>
      </div>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => navigate('/support/qna')}
          className={styles.listButton}
        >
          목록
        </button>

        {!isAdmin && (
          <div className={styles.actionButtons}>
            <button onClick={handleEdit} className={styles.actionButton}>
              수정
            </button>
            <button onClick={handleDelete} className={styles.actionButton}>
              삭제
            </button>
          </div>
        )}
      </div>
      <AnswerSection inquiryId={id} />
    </div>
  );
}

export default QnaDetail;
