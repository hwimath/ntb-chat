'use client';

import { useState, useRef, useEffect } from 'react';
import { toeicProblems, grammarSkills } from '../lib/toeicData.js';

// --- 아이콘 컴포넌트 ---
const UserIcon = () => (
    <div className="w-9 h-9 flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center shadow">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    </div>
);

const BotIcon = () => (
    <div className="w-9 h-9 flex-shrink-0 bg-gray-700 rounded-full flex items-center justify-center shadow">
        <span className="text-white text-xs font-bold">NTB</span>
    </div>
);

export default function Home() {
    const [gameState, setGameState] = useState('IDLE');
    const [userId, setUserId] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [stage, setStage] = useState(1);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);

    const chatContainerRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        addBotMessage("안녕하세요! NTB 토익 챌린지에 오신 것을 환영합니다. 먼저 회원님의 아이디를 입력해주세요.");
        setGameState('ASKING_ID');
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);
    
    useEffect(() => {
        if (timeLeft === 0 && gameState === 'IN_QUIZ') {
            handleAnswer(null);
        }
    }, [timeLeft]);

    const addBotMessage = (text, isHtml = false) => {
        setChatHistory(prev => [...prev, { role: 'bot', content: text, isHtml }]);
    };
    
    const addUserMessage = (text) => {
        setChatHistory(prev => [...prev, { role: 'user', content: text }]);
    };

    const startTimer = (duration) => {
        clearInterval(timerRef.current);
        setTimeLeft(duration);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
    };

    const [shuffledProblems, setShuffledProblems] = useState([]);
    const [usedProblemIds, setUsedProblemIds] = useState(new Set());

    // Fisher-Yates shuffle function
    const shuffle = (array) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    useEffect(() => {
        setShuffledProblems(shuffle([...toeicProblems]));
    }, []);

    const startStage = (currentStage) => {
        const newUsedIds = new Set(usedProblemIds);
        
        const availableGrammar = shuffledProblems.filter(p => p.type === 'grammar' && !newUsedIds.has(p.id));
        const availableVocab = shuffledProblems.filter(p => p.type === 'vocab' && !newUsedIds.has(p.id));

        const stageGrammar = availableGrammar.slice(0, 5);
        const stageVocab = availableVocab.slice(0, 5);

        stageGrammar.forEach(q => newUsedIds.add(q.id));
        stageVocab.forEach(q => newUsedIds.add(q.id));
        setUsedProblemIds(newUsedIds);

        let stageQuestions = shuffle([...stageGrammar, ...stageVocab]);
        
        setQuestions(stageQuestions);
        setCurrentQuestionIndex(0);
        setGameState('IN_QUIZ');
        addBotMessage(`좋아요, ${userId}님! **스테이지 ${currentStage}**를 시작하겠습니다. (총 10문제)`);
        setTimeout(() => askQuestion(stageQuestions, 0), 1000);
    };

    const askQuestion = (qs, index) => {
        const q = qs[index];
        const timeLimit = q.type === 'grammar' ? 15 : 30;
        const questionHtml = `
            <div class="p-4 bg-gray-600 rounded-lg">
                <p class="text-xs text-gray-300 mb-2">출처: ${q.source} | 유형: ${q.type === 'grammar' ? '문법' : '어휘'} | 제한시간: ${timeLimit}초</p>
                <p class="font-semibold">${index + 1}. ${q.question}</p>
                <div class="mt-3 space-y-2">
                    ${q.options.map(opt => `<p class="text-sm">${opt}</p>`).join('')}
                </div>
            </div>`;
        addBotMessage(questionHtml, true);
        startTimer(timeLimit);
    };

    const handleAnswer = async (answer) => {
        clearInterval(timerRef.current);
        setIsLoading(true);

        const q = questions[currentQuestionIndex];
        let isCorrect = false;

        if (answer && answer.toUpperCase() === q.answer) {
            setTotalScore(prev => prev + 1);
            isCorrect = true;
        } else {
            setWrongAnswers(prev => [...prev, q]);
        }
        
        let feedbackMessage = `<p class="font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}">${isCorrect ? '정답입니다!' : `오답입니다. (정답: ${q.answer})`}</p>`;
        addBotMessage(feedbackMessage, true);

        if (!isCorrect) {
            if (q.type === 'grammar' && q.skill && grammarSkills[q.skill]) {
                const skillExplanation = `<div class="mt-2 p-3 bg-gray-800 rounded-md text-xs"><p class="font-semibold">[관련 스킬: ${q.skill}]</p><p>${grammarSkills[q.skill]}</p></div>`;
                addBotMessage(skillExplanation, true);
            } else if (q.type === 'vocab') {
                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            type: 'GET_EXPLANATION',
                            payload: { word: q.options.find(opt => opt.startsWith(`(${q.answer})`))?.split(' ')[1] }
                        })
                    });
                    const data = await response.json();
                    if(data.explanation) {
                        const vocabExplanation = `<div class="mt-2 p-3 bg-gray-800 rounded-md text-xs"><p class="font-semibold">[어휘 해설]</p><p>${data.explanation.replace(/\n/g, '<br/>')}</p></div>`;
                        addBotMessage(vocabExplanation, true);
                    }
                } catch (error) { console.error("어휘 해설 로딩 실패:", error); }
            }
        }
        
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
            setTimeout(() => askQuestion(questions, nextIndex), 2500);
        } else {
            setTimeout(() => endStage(), 2500);
        }
        setIsLoading(false);
    };
    
    const endStage = () => {
        if (stage === 1) {
            addBotMessage(`**스테이지 1**이 종료되었습니다. 현재까지 총 ${totalScore}개 정답! \n보다 정확한 실력 평가를 위해 스테이지 2를 진행하시겠습니까? (예/아니오)`);
            setGameState('STAGE_2_PROMPT');
        } else {
            showFinalResults();
        }
    };

    const showFinalResults = async () => {
        setGameState('SHOWING_RESULTS');
        let resultMessage = `**모든 스테이지가 종료되었습니다!**\n\n${userId}님의 최종 점수는 **${totalScore}/20** 입니다.`;
        let challenge;
        let challengeKey;

        if (totalScore <= 10) {
            challenge = "'레벨 C 토익입문1000 챌린지'";
            challengeKey = 'C';
        } else if (totalScore >= 16) {
            challenge = "'레벨 A 최상위3000 챌린지'";
            challengeKey = 'A';
        } else {
            challenge = "'토익영단어1400 챌린지'";
            challengeKey = 'B';
        }
        
        resultMessage += `\n\n${userId}님의 실력에 맞는 **${challenge}**를 추천해 드립니다!`;
        resultMessage += `\n- **순한맛:** 하루 50개 암기 (2개월 과정)\n- **매운맛:** 하루 100개 암기 (1개월 과정)`;
        addBotMessage(resultMessage, true);
        
        try {
            const resultToSave = `[NTB_RESULT]${userId}||${totalScore}/20||${challengeKey}`;
            await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'SAVE_RESULT',
                    payload: { resultText: resultToSave }
                })
            });
        } catch (error) {
            console.error("결과 저장 실패:", error);
        }

        setTimeout(() => {
            addBotMessage("챌린지 참여에 대한 자세한 내용은 아래 링크를 참조해주세요.\n<a href='https://www.ntb307.co.kr' target='_blank' class='text-blue-400 hover:underline'>https://www.ntb307.co.kr</a>", true);
        }, 1500);

        setTimeout(() => {
            addBotMessage("더 쉬운 문법문제를 원하시면 숫자 1, 더 어려운 문법문제를 원하시면 숫자 2, 어휘문제를 원하시면 숫자 3을 입력해 주세요.");
        }, 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentUserInput = userInput.trim();
        if (!currentUserInput || isLoading) return;

        addUserMessage(currentUserInput);
        setUserInput('');

        if (gameState === 'ASKING_ID') {
            setUserId(currentUserInput);
            addBotMessage(`${currentUserInput}님, 반갑습니다! 토익 챌린지를 시작하겠습니다.`);
            setTimeout(() => startStage(1), 1000);
        } else if (gameState === 'IN_QUIZ') {
            await handleAnswer(currentUserInput);
        } else if (gameState === 'STAGE_2_PROMPT') {
            if (['예', '네', 'ㅇ', 'yes'].includes(currentUserInput.toLowerCase())) {
                setStage(2);
                startStage(2);
            } else {
                showFinalResults();
            }
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-800 text-white relative">
            <div className="absolute inset-0 flex items-center justify-center z-0">
                <span className="text-9xl font-extrabold text-white opacity-5 select-none">NTB 토익</span>
            </div>
            <div className="flex flex-col h-full z-10 backdrop-blur-sm bg-black/10">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">NTB 토익 봇</h1>
                    {gameState === 'IN_QUIZ' && (
                        <div className="text-lg font-mono bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center animate-pulse">{timeLeft}</div>
                    )}
                </header>
                <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {chatHistory.map((message, index) => (
                        <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                            {message.role === 'bot' && <BotIcon />}
                            <div className={`p-4 rounded-2xl max-w-2xl shadow-lg ${message.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                                {message.isHtml ? (
                                    <div className="text-sm prose prose-invert prose-p:my-1 prose-a:text-blue-400" dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />') }} />
                                ) : (
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                )}
                            </div>
                            {message.role === 'user' && <UserIcon />}
                        </div>
                    ))}
                    {/* --- 수정된 부분: 로딩 인디케이터 --- */}
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
                <footer className="p-4 border-t border-gray-700">
                    <form onSubmit={handleSubmit} className="flex items-center space-x-4 max-w-4xl mx-auto">
                        <input
                            type="text"
                            value={userInput}
                            // --- 수정된 부분: 오타 수정 ---
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={gameState === 'IN_QUIZ' ? "정답(A, B, C, D)을 입력하세요..." : "여기에 입력하세요..."}
                            className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-white placeholder-gray-400"
                            disabled={isLoading || gameState === 'SHOWING_RESULTS'}
                        />
                        <button
                            type="submit"
                            disabled={!userInput.trim() || isLoading || gameState === 'SHOWING_RESULTS'}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition shadow-lg"
                        >
                            전송
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
}
