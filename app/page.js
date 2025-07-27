'use client';

import { useState, useRef, useEffect } from 'react';

// --- 디자인 개선: 아이콘 컴포넌트 수정 ---
const UserIcon = () => (
  <div className="w-9 h-9 flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center shadow">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  </div>
);

// "NTB봇" 텍스트 아이콘
const BotIcon = () => (
  <div className="w-9 h-9 flex-shrink-0 bg-gray-700 rounded-full flex items-center justify-center shadow">
    <span className="text-white text-xs font-bold">NTB</span>
  </div>
);
// --- 디자인 개선 끝 ---

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessageContent = userInput;
    setIsLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', content: userMessageContent }]);
    setUserInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessageContent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '알 수 없는 에러가 발생했습니다.');
      }

      const data = await response.json();
      const botResponse = { role: 'bot', content: data.reply };
      setChatHistory(prev => [...prev, botResponse]);

    } catch (error) {
      const errorMessage = { role: 'bot', content: `오류: ${error.message}` };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // --- 디자인 개선: 전체 레이아웃 및 색상 변경 ---
    <div className="flex flex-col h-screen bg-gray-800 text-white relative">
      {/* NTB 워터마크 */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
          <span className="text-9xl font-extrabold text-white opacity-5 select-none">NTB</span>
      </div>
      
      <div className="flex flex-col h-full z-10 backdrop-blur-sm bg-black/10">
        {/* 헤더 */}
        <header className="p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-center">NTB 챗봇</h1>
        </header>

        {/* 채팅 컨테이너 */}
        <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {chatHistory.map((message, index) => (
            <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'bot' && <BotIcon />}
              <div className={`p-4 rounded-2xl max-w-xl shadow-lg ${message.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && <UserIcon />}
            </div>
          ))}
          {/* 로딩 인디케이터 */}
          {isLoading && (
            <div className="flex items-start gap-4">
              <BotIcon />
              <div className="p-4 rounded-2xl bg-gray-700 shadow-lg">
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
        <footer className="p-4 border-t border-gray-700">
          <form onSubmit={handleSubmit} className="flex items-center space-x-4 max-w-4xl mx-auto">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={isLoading ? "답변을 생각하고 있어요..." : "메시지를 입력하세요..."}
              className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-white placeholder-gray-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition shadow-lg"
            >
              전송
            </button>
          </form>
        </footer>
      </div>
    </div>
    // --- 디자인 개선 끝 ---
  );
}
