import React, { useState, useEffect } from 'react';
import answerApi from '../../api/AnswerApi';
import { getCookie } from '../../util/cookieUtil';
import '../../css/answerSection.css';

const AnswerSection = ({ inquiryId }) => {
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [editAnswerId, setEditAnswerId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const playerInfo = getCookie('player');

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const answerList = await answerApi.getAnswersByInquiryId(inquiryId);
        setAnswers(answerList);
      } catch (error) {
        console.error('답변 목록 불러오기 실패:', error);
      }
    };

    fetchAnswers();
  }, [inquiryId]);

  // 답변 추가
  const handleAddAnswer = async () => {
    if (!playerInfo || !playerInfo.roleNames.includes('ADMIN')) {
      alert('답변을 추가할 권한이 없습니다.');
      return;
    }

    if (newAnswer.trim() === '') {
      alert('답변을 작성해주세요.');
      return;
    }

    try {
      const addedAnswer = await answerApi.addAnswer(inquiryId, newAnswer);
      setAnswers([...answers, addedAnswer]);
      setNewAnswer('');
      alert('답변이 성공적으로 추가되었습니다.');
    } catch (error) {
      console.error('답변 추가 실패:', error);
    }
  };

  // 답변 수정
  const handleEditAnswer = async () => {
    if (!playerInfo || !playerInfo.roleNames.includes('ADMIN')) {
      alert('답변을 수정할 권한이 없습니다.');
      return;
    }

    if (editContent.trim() === '') {
      alert('답변을 작성해주세요.');
      return;
    }

    try {
      const updatedAnswer = await answerApi.updateAnswer(
        editAnswerId,
        editContent
      );
      setAnswers((prev) =>
        prev.map((ans) => (ans.id === editAnswerId ? updatedAnswer : ans))
      );
      setEditAnswerId(null);
      setEditContent('');
      alert('답변이 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('답변 수정 실패:', error);
    }
  };

  // 수정 모드 활성화
  const handleEditMode = (answer) => {
    setEditAnswerId(answer.id);
    setEditContent(answer.content);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setEditAnswerId(null);
    setEditContent('');
  };

  // 답변 삭제
  const handleDeleteAnswer = async (answerId) => {
    if (!playerInfo || !playerInfo.roleNames.includes('ADMIN')) {
      alert('답변을 삭제할 권한이 없습니다.');
      return;
    }

    if (window.confirm('정말로 이 답변을 삭제하시겠습니까?')) {
      try {
        await answerApi.deleteAnswer(answerId);
        setAnswers((prev) => prev.filter((ans) => ans.id !== answerId));
        alert('답변이 성공적으로 삭제되었습니다.');
      } catch (error) {
        console.error('답변 삭제 실패:', error);
      }
    }
  };

  return (
    <div className="answer-section">
      <h3>답변 목록</h3>
      <ul className="answer-list">
        {answers.map((answer) => (
          <li key={answer.id}>
            <div className="answer-content">
              <p className="answer-author">운영자: {answer.content}</p>
            </div>
            {playerInfo?.roleNames.includes('ADMIN') && (
              <div className="answer-controls">
                <button onClick={() => handleEditMode(answer)}>수정</button>
                <button onClick={() => handleDeleteAnswer(answer.id)}>
                  삭제
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {playerInfo?.roleNames.includes('ADMIN') && !editAnswerId && (
        <div className="new-answer">
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="답변을 입력해주세요..."
          />
          <button onClick={handleAddAnswer}>답변 추가</button>
        </div>
      )}

      {editAnswerId && (
        <div className="edit-answer">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="답변을 수정해주세요..."
          />
          <div className="button-container">
            <button onClick={handleEditAnswer}>답변 수정</button>
            <button onClick={handleCancelEdit} className="cancel-edit">
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerSection;
