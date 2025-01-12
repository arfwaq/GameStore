import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/ImageSearch.css';

const ImageSearch = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [resultsModal, setResultsModal] = useState(false);
  const [results, setResults] = useState(null);

  const handleImageSearch = async () => {
    if (!file) {
      alert('이미지를 업로드하세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/images/similar-search',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      const probabilities = response.data.probabilities[0].filter(
        (_, index) => index < 11
      );
      const total = probabilities.reduce((acc, val) => acc + val, 0);
      const adjustedProbabilities = probabilities.map((prob) => prob / total);

      setResults({ ...response.data, probabilities: [adjustedProbabilities] });
      setShowModal(false);
      setResultsModal(true);
    } catch (error) {
      console.error('이미지 검색 실패:', error);
      alert('이미지 검색에 실패했습니다.');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
    } else {
      setFilePreview(null);
    }
  };

  const genres = [
    '액션', '전략', '캐주얼', '인디', '시뮬레이션',
    'RPG', '어드벤처', '레이싱', '스포츠', '애니메이션', '유틸리티'
  ];

  const genreImages = {
    액션: '/images/action.png',
    전략: '/images/strategy.png',
    캐주얼: '/images/casual.png',
    인디: '/images/indie.png',
    시뮬레이션: '/images/simulation.png',
    RPG: '/images/rpg.png',
    어드벤처: '/images/adventure.png',
    레이싱: '/images/racing.png',
    스포츠: '/images/sports.png',
    애니메이션: '/images/animation.png',
    유틸리티: '/images/utility.png',
  };

  return (
    <>
      <button className="image-search-button" onClick={() => setShowModal(true)}>
        이미지 검색
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>이미지 검색</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {file && (
              <div className="preview-container">
                <p>선택한 파일: {file.name}</p>
                {filePreview && (
                  <img
                    src={filePreview}
                    alt="미리보기"
                    className="preview-image"
                  />
                )}
              </div>
            )}
            <div className="modal-buttons">
              <button onClick={handleImageSearch} disabled={!file}>
                검색
              </button>
              <button onClick={() => setShowModal(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}

      {resultsModal && results && (
        <div className="modal">
          <div className="modal-content results-modal">
            <h3>이미지 분석에 따른 게임 장르 추천</h3>

            <section className="top-genres">
              <h4>분석 결과에 따른 상위 세개 장르</h4>
              <ul>
                {results.probabilities[0]
                  .map((prob, index) => ({
                    genre: genres[index],
                    prob,
                    image: genreImages[genres[index]],
                  }))
                  .sort((a, b) => b.prob - a.prob)
                  .slice(0, 3)
                  .map((item, index) => (
                    <li key={index}>
                      <button
                        onClick={() => {
                          navigate('/category', {
                            state: { selectedGenre: item.genre },
                          });
                          setResultsModal(false);
                        }}
                      >
                        <img src={item.image} alt={item.genre} />
                        <strong>{item.genre}</strong>: {(item.prob * 100).toFixed(2)}%
                      </button>
                    </li>
                  ))}
              </ul>
            </section>

            <section className="all-genres">
              <h4>장르별 확률:</h4>
              <ul>
                {results.probabilities[0]
                  .slice(0, 11)
                  .map((prob, index) => (
                    <li key={index}>
                      <button
                        onClick={() => {
                          navigate('/category', {
                            state: { selectedGenre: genres[index] },
                          });
                          setResultsModal(false);
                        }}
                      >
                        <img src={genreImages[genres[index]]} alt={genres[index]} />
                        <strong>{genres[index]}</strong>: {(prob * 100).toFixed(2)}%
                      </button>
                    </li>
                  ))}
              </ul>
            </section>

            <button className="close-button" onClick={() => setResultsModal(false)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageSearch;