import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [topic, setTopic] = useState(null); // 현재 대화 주제
  const [step, setStep] = useState(0); // 현재 단계 (기본값: 0)

  // 대화 초기화 함수
  const resetChat = () => {
    setTopic(null); // 주제 초기화
    setStep(0); // 단계 초기화
  };

  return (
    <ChatContext.Provider value={{ topic, setTopic, step, setStep, resetChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
