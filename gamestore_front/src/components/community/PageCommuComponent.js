import React from "react";
import "././css/PageCommuComponent.css";

const PageCommuComponent = ({ serverData, movePage }) => {
    // serverData가 유효하지 않을 경우 기본 메시지 표시
    if (!serverData) {
        return <div className="page-container">No data available</div>;
    }

    // serverData 내부 값 디스트럭처링
    const { prev, next, prevPage, nextPage, pageNumList, current } = serverData;

    return (
        <div className="page-container">
            <div>Pages</div>

            {/* 이전 버튼 렌더링 */}
            {prev ? (
                <div
                    className="page-button prev-button"
                    onClick={() => movePage({ page: prevPage })}
                >
                    Prev
                </div>
            ) : null}

            {/* 페이지 번호 리스트 렌더링 */}
            {Array.isArray(pageNumList) &&
                pageNumList.map((pageNum) => (
                    <div
                        key={pageNum}
                        className={`page-number ${current === pageNum ? "selected" : ""}`}
                        onClick={() => movePage({ page: pageNum })}
                    >
                        {pageNum}
                    </div>
                ))}

            {/* 다음 버튼 렌더링 */}
            {next ? (
                <div
                    className="page-button next-button"
                    onClick={() => movePage({ page: nextPage })}
                >
                    Next
                </div>
            ) : null}
        </div>
    );
};

export default PageCommuComponent;
