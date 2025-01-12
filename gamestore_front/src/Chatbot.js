import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useChat } from './ChatContext'; // ChatContext 사용
import { useNavigate } from 'react-router-dom';
import '../src/css/chatstyle.css';

// 모든 요청에 쿠키를 포함하도록 설정
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://127.0.0.1:5001';

const Chatbot = () => {
  const navigate = useNavigate();
  const { topic, setTopic, step, setStep, resetChat } = useChat(); // 주제와 단계 관리
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  // 메시지 추가 함수
  const addMessage = (sender, text) => {
    if (Array.isArray(text)) {
      // 배열 형태의 메시지를 처리
      text.forEach((item) => {
        setMessages((prev) => [...prev, { sender, text: item }]);
      });
    } else {
      // 일반 메시지 처리
      setMessages((prev) => [...prev, { sender, text }]);
    }
  };
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (!userInput.trim()) return; // 빈 입력 방지
    addMessage('user', userInput); // 사용자 메시지 추가
    setIsLoading(true); // 로딩 상태 활성화

    try {
      const response = await axios.post('/chat', {
        message: userInput,
        topic, // 현재 주제 전달
        step, // 현재 단계 전달
      });

      if (response.data.newTopic) {
        // 새로운 주제로 전환
        setTopic(response.data.newTopic);
        setStep(0); // 새로운 주제 시작 단계로 이동
        addMessage('bot', response.data.response);
      } else if (response.data.resetChat) {
        // 대화 흐름 초기화
        resetChat();
        addMessage('bot', '대화를 초기화했습니다. 무엇을 도와드릴까요?');
      } else if (Array.isArray(response.data.response)) {
        // 응답이 배열인 경우 각각 개별 메시지로 추가
        console.log('응답 데이터:', response.data.response);
        response.data.response.forEach((msg) => {
          addMessage('bot', msg);
        });
      } else {
        addMessage('bot', response.data.response); // 일반 응답
      }
    } catch (error) {
      addMessage('bot', '에러가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false); // 로딩 상태 비활성화
      setUserInput(''); // 입력 초기화
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 기본 엔터 키 동작 방지
      handleSend();
    }
  };

  // 주제 및 초기화 관리
  useEffect(() => {
    if (topic === null) {
      // 초기 메시지
      setMessages([
        {
          sender: 'bot',
          text: '안녕하세요! 게임스토어의 챗봇입니다! 무엇을 도와드릴까요?',
        },
        {
          sender: 'bot',
          text: '대화가 가능한 주제는 게임,커뮤니티,문의,뉴스가 있습니다!',
        },
      ]);
    }
  }, [topic]);

  return (
    <div>
      <button onClick={toggleChatbot} className="chatbot-toggle-button"
              style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 1000,width:'50px'
                ,borderRadius:'50%', backgroundColor:'#4caf50' ,borderStyle:'none',height:'50px'
      }}>
        💬
      </button>
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <strong>챗봇</strong>
            <button onClick={toggleChatbot}>✖</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbot-message ${msg.sender}`}>
                <div className={`chatbot-message-bubble ${msg.sender}`}>
                  {typeof msg.text === 'object' && msg.text.text ? (
                    // `text`와 `link`를 포함한 객체 처리
                    msg.text.link ? (
                      <button
                        onClick={() => navigate(msg.text.link)}
                        className="chatbot-link"
                      >
                        {msg.text.text}
                      </button>
                    ) : (
                      // 링크가 없는 일반 텍스트 처리
                      <span>{msg.text.text}</span>
                    )
                  ) : typeof msg.text === 'string' ? (
                    // 일반 텍스트 처리
                    msg.text
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <div className="chatbot-input-container">
            <input
              type="text"
              ref={inputRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress} // 엔터 키 이벤트 추가
              placeholder="메시지를 입력하세요..."
              className="chatbot-input"
            />
            <button
              onClick={handleSend}
              className="chatbot-send-button"
              disabled={isLoading || !userInput.trim()} // 로딩 중 또는 빈 입력 시 버튼 비활성화
            >
              {isLoading ? '전송 중...' : '전송'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
