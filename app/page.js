'use client';

import { useState, useRef, useEffect } from 'react';

// 아이콘 컴포넌트
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white bg-blue-500 rounded-full p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white bg-green-500 rounded-full p-1" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M8 16c0 1.105 .895 2 2 2h4c1.105 0 2 -.895 2 -2" />
        <path d="M12 4m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    </svg>
);


export default function Home() {
  // state 관리
  const [userInput, setUserInput] = useState(''); // 사용자 입력
  const [chatHistory, setChatHistory] = useState([]); // 대화 기록
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  // 스크롤 참조
  const chatContainerRef = useRef(null);

  // 채팅이 업데이트될 때마다 맨 아래로 스크롤
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // 사용자 입력 처리 함수
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // 폼 제출 처리 함수 (API 호출 로직으로 수정)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessageContent = userInput;
    setIsLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', content: userMessageContent }]);
    setUserInput('');

    try {
      // 백엔드 API(/api/chat)에 요청을 보냅니다.
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessageContent }),
      });

      if (!response.ok) {
        // 응답이 실패하면 에러를 처리합니다.
        const errorData = await response.json();
        throw new Error(errorData.error || '알 수 없는 에러가 발생했습니다.');
      }

      const data = await response.json();
      const botResponse = { role: 'bot', content: data.reply };
      setChatHistory(prev => [...prev, botResponse]);

    } catch (error) {
      // 에러 발생 시 채팅창에 에러 메시지를 표시합니다.
      const errorMessage = { role: 'bot', content: `오류: ${error.message}` };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      // 성공하든 실패하든 로딩 상태를 해제합니다.
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">Gemini 챗봇</h1>
        <p className="text-center text-sm text-gray-500">대화 내용은 Google Sheets에 저장됩니다.</p>
      </header>

      {/* 채팅 컨테이너 */}
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((message, index) => (
          <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
            {message.role === 'bot' && <BotIcon />}
            <div className={`p-3 rounded-lg max-w-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === 'user' && <UserIcon />}
          </div>
        ))}
        {/* 로딩 인디케이터 */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <BotIcon />
            <div className="p-3 rounded-lg bg-white text-gray-800 shadow-sm">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 입력 폼 */}
      <footer className="bg-white p-4 shadow-t-md">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder={isLoading ? "답변을 생각하고 있어요..." : "메시지를 입력하세요..."}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
          >
            전송
          </button>
        </form>
      </footer>
    </div>
  );
}
