import { useEffect, useState } from "react";
import { replyList } from "../../../api/communityApi";
import AddReplyComponent from "../reply/AddReplyComponent"
import ReadReplyComponent from "../reply/ReadReplyComponent"
import PageReplyComponent from "../reply/PageReplyComponent"


const initState = {
  dtoList:[],
  pageNumList:[],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0
}


const ListReplyComponent = ({ comId }) => {
  const [ replyData, setReplyData] = useState(initState);
  const [ error, setError] = useState("");

  useEffect(() => {
    // 컴포넌트가 마운트될 때 기본적으로 첫 번째 페이지의 댓글 데이터를 가져옴
    fetchReplyData(1);  // 기본적으로 첫 번째 페이지를 로드
  }, [comId]);

  const fetchReplyData = (pageNum) => {
    replyList(comId, pageNum).then(data => {
      console.log(data);
      setReplyData(data);  // 받은 데이터를 상태에 저장
    }).catch(error => {
      setError("댓글을 불러오는 데 실패했습니다.");
      console.error(error);
    });
  };
  const movePage = (pageNum) => {
    fetchReplyData(pageNum);  // 페이지 번호가 변경되면 해당 페이지의 댓글 데이터를 새로 가져옴
  };

  return (
    <div className="list-container">
      {/*{fetching ? <FetchingModal /> : <></>}*/}
      <div>
        <AddReplyComponent comId={comId} fetchReplyData={fetchReplyData}/>
      </div>
      <div>------------------</div>
      <div className="flex flex-wrap mx-auto justify-center p-6">
        <ReadReplyComponent replyData={replyData} fetchReplyData={fetchReplyData}></ReadReplyComponent>
        {/*modifyList를 어디에 넣어야하는지 생각해볼것*/}
      </div>
      <div>------------</div>
      <div>
        <PageReplyComponent
          replyData={replyData}
          movePage={movePage}  // 페이지 변경 핸들러 전달
        ></PageReplyComponent>
      </div>
    </div>


  );

}

export default ListReplyComponent;