import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import qnaApi from '../../api/QnaApi';
import styles from '../../css/inquireedit.module.css';

function QnaModify() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const inquiry = await qnaApi.getInquiryById(id);
        setTitle(inquiry.title);
        setContent(inquiry.content);
      } catch (error) {
        console.error('문의 데이터 불러오기 실패:', error);
        alert('문의 데이터를 불러오는데 실패했습니다.');
        navigate('/support/qna');
      } finally {
        setLoading(false);
      }
    };

    fetchInquiry();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await qnaApi.updateInquiry(id, { title, content });
      alert('문의 성공적으로 수정');
      navigate(`/support/qna/${id}`);
    } catch (error) {
      console.error('문의 수정 실패:', error);
      alert('문의 수정에 실패.다시 시도해주세요.');
    }
  };
  if (loading) {
    return <div>로딩 중...</div>;
  }
  return (
    <div className={styles.inqcontainer}>
      <h2>문의 수정</h2>
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <input
            type="text"
            id="title"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <textarea
            id="content"
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className={styles.buttongroup}>
          <button type="submit">저장</button>
          <button type="button" onClick={() => navigate(`/support/qna/${id}`)}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default QnaModify;
