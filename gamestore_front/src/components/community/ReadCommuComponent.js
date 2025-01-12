import { useCallback, useEffect, useState } from "react";
import { getOne, prefix } from "../../api/communityApi";
import { useNavigate, useSearchParams, createSearchParams } from "react-router-dom";
import useCustomMove from "../../hooks/useCustomMove";
import "./css/ReadCommuComponent.css";
import FetchingModal from "../community/FetchingModal";
import ListReplyComponent from "../community/reply/ListReplyComponent";
import { decodeNicknameFromJWT } from "../../util/jwtUtil"; // 쿠키에서 이메일을 추출하는 유틸리티 함수

const initState = {
    comId: 0,
    comTitle: "",
    comContent: "",
    writer: "",
    modDate: null,
    regDate: null,
    uploadFileNames: [],
};

const ReadCommuComponent = ({ comId }) => {
    const [community, setCommunity] = useState(initState);
    const [fetching, setFetching] = useState(false);
    const [email, setEmail] = useState(""); // 이메일 상태 추가
    const navigate = useNavigate();
    const [queryParams] = useSearchParams();

    // `comId`를 파싱하면서 기본값 설정
    const parsedComId = comId ? parseInt(comId, 10) : null;

    const page = queryParams.get("page") ? parseInt(queryParams.get("page")) : 1;
    const size = queryParams.get("size") ? parseInt(queryParams.get("size")) : 10;
    const queryStr = createSearchParams({ page, size }).toString();

    const { moveToList, moveToModify } = useCustomMove();

    // 이메일 로드
    useEffect(() => {
        const userEmail = decodeNicknameFromJWT(); // 쿠키에서 이메일 추출
        if (userEmail) {
            setEmail(userEmail); // 이메일 설정
        } else {
            setEmail("guest@example.com"); // 기본값 설정
        }
    }, []);

    // 데이터 로드
    useEffect(() => {
        if (!parsedComId) {
            console.error("Invalid comId");
            return;
        }

        setFetching(true);
        getOne(parsedComId)
            .then((data) => {
                setCommunity(data || initState);
                setFetching(false);
            })
            .catch((error) => {
                console.error("Error fetching data", error);
                setCommunity(initState);
                setFetching(false);
            });
    }, [parsedComId]);

    // 로딩 중 상태
    if (fetching) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="read-commu-container">
            <div className="post-header">
                {/* 왼쪽 영역: 제목을 로그인된 사용자의 이메일로 변경 */}
                <div className="header-left">
                    <h2>{email}</h2>
                </div>

                {/* 오른쪽 영역: 작성자, 날짜 */}
                <div className="header-right">
                    <p className="writer">By {community.writer}</p>
                    <p className="date">Date: {community.regDate || "N/A"}</p>
                </div>
            </div>

            <div className="post-content">
                <p>{community.comContent}</p>
                {community.uploadFileNames?.length > 0 ? (
                    <div className="images-container">
                        {community.uploadFileNames.map((imgFile, i) => (
                            <img
                                alt="community"
                                key={i}
                                className="post-image"
                                src={`${prefix}/view/${imgFile}`}
                            />
                        ))}
                    </div>
                ) : (
                    <p>No images available.</p>
                )}
            </div>

            <div className="post-actions">
                <button className="action-button" onClick={() => moveToModify(parsedComId)}>
                    Modify
                </button>
                <button className="action-button" onClick={moveToList}>
                    List
                </button>
            </div>

            <div className="comments-section">
                <h3>Comments</h3>
                <ListReplyComponent comId={comId} />
            </div>
        </div>
    );
};

export default ReadCommuComponent;
