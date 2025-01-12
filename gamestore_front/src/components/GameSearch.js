import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from "../components/Navbar"

const GameSearch = () => {
  const [searchParams] = useSearchParams(); // URL에서 쿼리 파라미터 가져오기
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const [suggestions, setSuggestions] = useState([]); // 자동완성 데이터
  const [games, setGames] = useState([]); // 검색 결과 상태
  const [cachedResults, setCachedResults] = useState({}); // 검색 캐시
  const [cachedSuggestions, setCachedSuggestions] = useState({}); // 자동완성 캐시
  const navigate = useNavigate(); // 페이지 이동

  useEffect(() => {
    const query = searchParams.get('query'); // URL 쿼리 파라미터 가져오기
    if (query) {
      setSearchTerm(query);
      fetchGames(query); // 검색 실행
    }
  }, [searchParams]);

  const fetchGames = async (query) => {
    if (cachedResults[query]) {
      setGames(cachedResults[query]);
      return;
    }

    try {
      const response = await axios.get(
        'http://localhost:8080/api/games/search',
        {
          params: { query },
        }
      );
      setGames(response.data);
      setCachedResults((prevCache) => ({
        ...prevCache,
        [query]: response.data,
      }));
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const fetchSuggestions = async (keyword) => {
    if (cachedSuggestions[keyword]) {
      setSuggestions(cachedSuggestions[keyword]);
      return;
    }

    try {
      if (!keyword.trim()) {
        setSuggestions([]);
        return;
      }

      const response = await axios.get(
        'http://localhost:8080/api/games/autocomplete',
        {
          params: { keyword },
        }
      );
      setSuggestions(response.data);
      setCachedSuggestions((prevCache) => ({
        ...prevCache,
        [keyword]: response.data,
      }));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleInputChange = (e) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);
    fetchSuggestions(keyword);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    fetchGames(suggestion);
  };

  const handleGameClick = (appId) => {
    navigate(`/games/${appId}`);
  };

  return (
    <>
    <Navbar/>
    <div
      style={{ maxWidth: '600px', margin: '20px auto', textAlign: 'center' }}
    >
      <h1>Search Games</h1>
      <input
        type="text"
        placeholder="Enter game title"
        value={searchTerm}
        onChange={handleInputChange}
        style={{
          padding: '10px',
          width: '80%',
          marginBottom: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
        }}
      />
      <button
        onClick={() => fetchGames(searchTerm)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Search
      </button>
      {suggestions.length > 0 && (
        <ul
          style={{
            listStyleType: 'none',
            padding: 0,
            marginTop: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            backgroundColor: '#f9f9f9',
            maxHeight: '150px',
            overflowY: 'auto',
            textAlign: 'left',
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                borderBottom: '1px solid #ddd',
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: '20px' }}>
        {games.length > 0 ? (
          <ul style={{listStyle:"none"}}>
            {games.map((game) => (
              <li
                key={game.appId}
                style={{
                  marginBottom: '10px',
                  cursor: 'pointer',
                  border: '1px solid #ddd',
                  padding: '10px',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9',
                }}
                onClick={() => handleGameClick(game.appId)}
              >
                <img
                  src={game.thumbnailUrl}
                  alt={game.gameName}
                  style={{
                    width: '100px',
                    height: '100px',
                    marginRight: '10px',
                  }}
                />
                <div>
                  <h3 style={{color:"black"}}>{game.gameName}</h3>
                  <p  style={{color:"black"}}>{game.gameDescription}</p>
                  <p>
                    Price: {game.price ? `₩${game.price}` : 'Free'} | Release
                    Date: {game.releaseDate || 'Unknown'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No games found</p>
        )}
      </div>
    </div>
    </>
  );
};

export default GameSearch;
