import { useState, useEffect } from "react";
import {putReply, getReply, deleteReply} from "../../../api/communityApi"
import ResultModal from "../../community/ResultModal"

const initState = {
  comRno : 0,
  communityComId : 0,
  comReplyText :'',
  comReplyer:'',
};

const ModifyReplyComponent = ({comRno , fetchReplyData,currentPage, setSelectedReply }) => {
  const [reply, setReply] = useState({ ...initState });
  const[result, setResult]=useState(null); // 모달창 위한 상태값
  const [fetching, setFetching]=useState(false);


  // 댓글 데이터 초기화
  useEffect(() => {
    setFetching(true);
    getReply(comRno).then((data) => {
      setReply(data);
      setFetching(false);
    });
  }, [comRno]);


  // 댓글 내용 변경 시
  const handleChangeReply = (e) => {
    const { name, value } = e.target;
    setReply((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 댓글 수정
  const handleClickModify = () => {
    setFetching(true);
    console.log(reply);
    putReply(reply.comRno, reply) // 댓글 수정 API 호출
      .then((data) => {
        setResult("Modified");
        setFetching(false);
      })
      .catch((error) => {
        console.error("Error modifying reply:", error);
        setFetching(false);
      });
  };

  // 댓글 삭제
  const handleClickDelete = () => {
    setFetching(true);
    deleteReply(reply.comRno) // 댓글 삭제 API 호출
      .then(() => {
        setResult("Deleted");
        setFetching(false);
      })
      .catch((error) => {
        console.error("Error deleting reply:", error);
        setFetching(false);
      });
  };

  //모달 창 닫힐 때
  const closeModal = ()=>{
    if(result==="Modified"){
      setResult(null);
      fetchReplyData(currentPage);
      setSelectedReply(null);
      // 페이지 관련해서 수정 필요할수도.
    } else if (result==="Deleted"){
      fetchReplyData(1);
      setSelectedReply(null);
    }
    setResult(null);
  }

  return (
    <div className="modify-reply-container">
      {fetching && <div>Loading...</div>}

      {result && (
        <ResultModal
          title={result}
          content={result === "Modified" ? "댓글이 수정되었습니다." : "댓글이 삭제되었습니다."}
          callbackFn={closeModal}
        />
      )}

      <div>
        <label>작성자:</label>
        <input
          type="text"
          name="comReplyer"
          value={reply.comReplyer}
          onChange={handleChangeReply}
          disabled
        />
      </div>

      <div>
        <label>댓글 내용:</label>
        <textarea
          name="comReplyText"
          value={reply.comReplyText}
          onChange={handleChangeReply}
        />
      </div>

      <div>
        <button onClick={handleClickModify} className="modify-btn">
          수정
        </button>
        <button onClick={handleClickDelete} className="delete-btn">
          삭제
        </button>
      </div>
    </div>
  );
};

export default ModifyReplyComponent;