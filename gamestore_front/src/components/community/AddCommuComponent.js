import { useRef, useState } from "react";
import { postAdd } from "../../api/communityApi";
import ResultModal from "../community/ResultModal";
import useCustomMove from "../../hooks/useCustomMove";
import FetchingModal from "../community/FetchingModal";
import "./css/AddCommuComponent.css";
import { useNavigate } from "react-router-dom";
const initState = {
    comTitle: "",
    writer: "",
    comContent: "",
    files: [],
};

/**
 * onClose(옵션): 모달 닫는 함수
 */
const AddCommuComponent = ({ onClose }) => {
    const [community, setCommunity] = useState({ ...initState });
    const uploadRef = useRef();
    const [fetching, setFetching] = useState(false);
    const [result, setResult] = useState(null);

    // useCustomMove: 필요 시 그대로 사용, 등록 완료 후 목록으로 가려면 moveToList 호출
    const { moveToList } = useCustomMove();

    // 인풋 변경
    const handleChangeCommunity = (e) => {
        const { name, value } = e.target;
        setCommunity((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 등록 버튼 클릭


// 리다이렉트를 위해 useNavigate 훅 사용
    const navigate = useNavigate();


    const handleClickAdd = () => {
        const files = uploadRef.current.files;
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        formData.append("comTitle", community.comTitle);
        formData.append("writer", community.writer);
        formData.append("comContent", community.comContent);

        setFetching(true);

        postAdd(formData)
            .then((data) => {
                setFetching(false);
                if (data.result) {
                    setResult(data.result);
                    navigate("/community/list"); // 성공 시 리다이렉트
                } else {
                    setResult("Error");
                }
            })
            .catch((error) => {
                setFetching(false);
                console.error("Error adding community:", error);
                setResult("Error");
            });
    };

    // 등록 성공 모달 닫기
    const closeModal = () => {
        setResult(null);
        // 목록으로 이동할 때
        moveToList({ page: 1 });
        // 모달도 닫고 싶다면
        if (onClose) onClose();
    };

    return (
        <div className="add-commu-container">
            {fetching && <FetchingModal />}
            {result && (
                <ResultModal
                    title="Add Result"
                    content={`New ${result} Added`}
                    callbackFn={closeModal}
                />
            )}

            <div className="form-group">
                <label htmlFor="comTitle" className="form-label">
                    TITLE
                </label>
                <input
                    id="comTitle"
                    className="form-input"
                    name="comTitle"
                    type="text"
                    value={community.comTitle}
                    onChange={handleChangeCommunity}
                />
            </div>

            <div className="form-group">
                <label htmlFor="writer" className="form-label">
                    WRITER
                </label>
                <input
                    id="writer"
                    className="form-input"
                    name="writer"
                    type="text"
                    value={community.writer}
                    onChange={handleChangeCommunity}
                />
            </div>

            <div className="form-group">
                <label htmlFor="comContent" className="form-label">
                    CONTENT
                </label>
                <textarea
                    id="comContent"
                    className="form-textarea"
                    name="comContent"
                    value={community.comContent}
                    onChange={handleChangeCommunity}
                />
            </div>

            <div className="form-group">
                <label htmlFor="files" className="form-label">
                    FILES
                </label>
                <input
                    ref={uploadRef}
                    id="files"
                    className="form-input"
                    type="file"
                    multiple
                />
            </div>

            <div className="button-group">
                <button type="button" className="add-button" onClick={handleClickAdd}>
                    ADD
                </button>
                {/* onClose 버튼 (취소 같은 역할) */}
                {onClose && (
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onClose}
                        style={{ marginLeft: "0.5rem" }}
                    >
                        CANCEL
                    </button>
                )}
            </div>
        </div>
    );
};

export default AddCommuComponent;
