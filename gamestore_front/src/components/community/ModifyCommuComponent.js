import { useEffect, useRef, useState } from "react";
import { deleteOne, getOne, putOne, prefix } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../community/ResultModal";
import FetchingModal from "../community/FetchingModal";
import { FaTrash, FaSave, FaList } from "react-icons/fa";
import "./css/ModifyCommuComponent.css"; // Make sure to create this CSS file

const initState = {
    comId: 0,
    comTitle: "",
    writer: "",
    comContent: "",
    uploadFileNames: [],
};

const ModifyCommuComponent = ({ comId }) => {
    const [community, setCommunity] = useState({ ...initState });
    const [result, setResult] = useState(null); // For modal
    const { moveToList, moveToRead } = useCustomMove(); // Navigation functions
    const [fetching, setFetching] = useState(false);
    const uploadRef = useRef();

    useEffect(() => {
        setFetching(true);
        getOne(comId)
            .then((data) => {
                setCommunity(data);
                setFetching(false);
            })
            .catch(() => setFetching(false));
    }, [comId]);

    const handleChangeCommunity = (e) => {
        const { name, value } = e.target;
        setCommunity((prev) => ({ ...prev, [name]: value }));
    };

    const deleteOldImages = (imageName) => {
        const updatedFileNames = community.uploadFileNames.filter(
            (fileName) => fileName !== imageName
        );
        setCommunity((prev) => ({ ...prev, uploadFileNames: updatedFileNames }));
    };

    const handleClickModify = () => {
        const files = uploadRef.current.files;
        const formData = new FormData();

        if (files.length > 0) {
            Array.from(files).forEach((file) => formData.append("files", file));
        }

        Object.keys(community).forEach((key) => {
            if (key !== "uploadFileNames") {
                formData.append(key, community[key]);
            }
        });

        community.uploadFileNames.forEach((fileName) =>
            formData.append("uploadFileNames", fileName)
        );

        setFetching(true);

        putOne(comId, formData)
            .then((data) => {
                console.log("modify result:", data);
                setResult("Modified");
                setFetching(false);
            })
            .catch(() => setFetching(false));
    };

    const handleClickDelete = () => {
        setFetching(true);
        deleteOne(comId)
            .then((data) => {
                console.log("delete result:", data);
                setResult("Deleted");
                setFetching(false);
            })
            .catch(() => setFetching(false));
    };

    const closeModal = () => {
        if (result === "Modified") {
            moveToRead(comId);
        } else if (result === "Deleted") {
            moveToList({ page: 1 });
        }
        setResult(null);
    };

    return (
        <div className="modify-commu-container">
            {fetching && <FetchingModal />}
            {result && (
                <ResultModal
                    title={result}
                    content="Operation was successful."
                    callbackFn={closeModal}
                />
            )}

            <h2 className="header">Edit Post</h2>

            <div className="form-group">
                <label>Post ID:</label>
                <div className="value">{community.comId}</div>
            </div>

            <div className="form-group">
                <label>Author:</label>
                <div className="value">{community.writer}</div>
            </div>

            <div className="form-group">
                <label htmlFor="comTitle">Title:</label>
                <input
                    id="comTitle"
                    name="comTitle"
                    type="text"
                    value={community.comTitle}
                    onChange={handleChangeCommunity}
                    className="input-field"
                />
            </div>

            <div className="form-group">
                <label htmlFor="comContent">Content:</label>
                <textarea
                    id="comContent"
                    name="comContent"
                    value={community.comContent}
                    onChange={handleChangeCommunity}
                    className="textarea-field"
                    rows="4"
                />
            </div>

            <div className="form-group">
                <label>Upload New Files:</label>
                <input ref={uploadRef} type="file" multiple className="file-input" />
            </div>

            <div className="form-group">
                <label>Existing Images:</label>
                <div className="images-list">
                    {community.uploadFileNames.map((imgFile, i) => (
                        <div key={i} className="image-item">
                            <img
                                alt="Uploaded"
                                src={`${prefix}/view/s_${imgFile}`}
                                className="uploaded-image"
                            />
                            <button
                                className="delete-button"
                                onClick={() => deleteOldImages(imgFile)}
                                title="Delete Image"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="actions">
                <button className="action-button delete" onClick={handleClickDelete}>
                    <FaTrash /> Delete
                </button>
                <button className="action-button modify" onClick={handleClickModify}>
                    <FaSave /> Save Changes
                </button>
                <button className="action-button list" onClick={() => moveToList({ page: 1 })}>
                    <FaList /> Back to List
                </button>
            </div>
        </div>
    );
};

export default ModifyCommuComponent;
