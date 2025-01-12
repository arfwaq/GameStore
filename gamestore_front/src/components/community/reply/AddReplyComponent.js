import { useState } from "react";
import { postAddReply } from "../../../api/communityApi";
import ResultModal from "../../community/ResultModal";
import "../css/AddReplyComponent.css";

const initState = {
  communityComId: 0,
  comReplyText: "",
  comReplyer: "",
};

const AddReplyComponent = ({ comId, fetchReplyData }) => {
  const [reply, setReply] = useState({ ...initState, communityComId: comId });
  const [fetching, setFetching] = useState(false);
  const [result, setResult] = useState(null);

  const handleChangeReply = (e) => {
    setReply({
      ...reply,
      [e.target.name]: e.target.value,
    });
  };

  const handleClickAdd = () => {
    const replyData = {
      communityComId: reply.communityComId,
      comReplyText: reply.comReplyText,
      comReplyer: reply.comReplyer,
    };
    setFetching(true);
    postAddReply(replyData)
        .then((data) => {
          setResult(data.result ? "Success" : "Error");
          if (data.result) {
            fetchReplyData(1);
          }
          setFetching(false);
        })
        .catch(() => {
          setResult("Error");
          setFetching(false);
        });
  };

  const closeModal = () => {
    setResult(null);
    fetchReplyData(1);
  };

  return (
      <div className="add-reply-container">
        {result && (
            <ResultModal
                title={result === "Success" ? "댓글 등록 성공" : "댓글 등록 실패"}
                content={
                  result === "Success"
                      ? "댓글이 성공적으로 등록되었습니다."
                      : "댓글 등록 중 문제가 발생했습니다."
                }
                callbackFn={closeModal}
            />
        )}

        <div className="form-group">
          <label htmlFor="communityComId">번호</label>
          <input
              id="communityComId"
              name="communityComId"
              type="number"
              value={comId}
              disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="comReplyer">작성자</label>
          <input
              id="comReplyer"
              name="comReplyer"
              type="text"
              value={reply.comReplyer}
              onChange={handleChangeReply}
          />
        </div>


        <div className="form-group">
          <label htmlFor="comReplyText">내용</label>
          <input
              id="comReplyText"
              name="comReplyText"
              type="text"
              value={reply.comReplyText}
              onChange={handleChangeReply}
          />
        </div>

        <div className="button-container">
          <button onClick={handleClickAdd}>ADD</button>
        </div>
      </div>
  );
};

export default AddReplyComponent;
