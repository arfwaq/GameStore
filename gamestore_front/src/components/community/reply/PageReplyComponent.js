import React, { useEffect, useState } from 'react';
import { getList, prefix, replyList} from "../../../api/communityApi"

// 페이징처리
const PageReplyComponent = ({replyData, movePage}) => {

  return (
    <div className="page-container">
      <div> Pages</div>
      {replyData.prev ? (
        <div
          className="page-putton prev-button"
          onClick={() => movePage(replyData.prevPage)}  // Prev 클릭 시 페이지 변경
        >
          Prev{" "}
        </div>
      ) : (
        <></>
      )}
      {replyData.pageNumList?.map((pageNum) => (
        <div
          key={pageNum}
          className={`page-number ${replyData.current === pageNum ? "selected" : ""}`}
          onClick={() => movePage(pageNum)}  // 페이지 번호 클릭 시 페이지 변경
        >
          {pageNum}
        </div>
      ))}
      {replyData.next ? (
        <div
          className="page-button next-button"
          onClick={() => movePage(replyData.nextPage)}  // Next 클릭 시 페이지 변경
        >
          Next
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default PageReplyComponent;