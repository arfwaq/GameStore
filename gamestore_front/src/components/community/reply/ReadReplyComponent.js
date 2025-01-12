import { useState } from "react";
import ModifyReplyComponent from "../reply/ModifyReplyComponent";
import "../css/ReadReplyComponent.css";

const ReadReplyComponent = ({ replyData, fetchReplyData }) => {
  const [selectedReply, setSelectedReply] = useState(null);

  const handleModifyClick = (comRno) => {
    setSelectedReply(comRno);
  };

  return (
      <div className="read-reply-container">
        {replyData && replyData.dtoList && replyData.dtoList.length > 0 ? (
            replyData.dtoList.map((reply) => (
                <div className="reply-item" key={reply.comRno}>
                  {selectedReply === reply.comRno ? (
                      <ModifyReplyComponent
                          comRno={reply.comRno}
                          fetchReplyData={fetchReplyData}
                          currentPage={replyData.current}
                          setSelectedReply={setSelectedReply}
                      />
                  ) : (
                      <div className="reply-content">
                        <p className="reply-id"><strong>번호:</strong> {reply.comRno}</p>
                        <p className="reply-author"><strong>작성자:</strong> {reply.comReplyer}</p>
                        <p className="reply-text"><strong>댓글 내용:</strong> {reply.comReplyText}</p>
                        <p className="reply-date"><strong>작성일:</strong> {reply.regDate}</p>

                        <button
                            className="modify-button2"
                            onClick={() => handleModifyClick(reply.comRno)}
                        >
                          수정
                        </button>
                      </div>
                  )}
                </div>
            ))
        ) : (
            <div className="no-replies">댓글이 없습니다.</div>
        )}
      </div>
  );
};

export default ReadReplyComponent;
