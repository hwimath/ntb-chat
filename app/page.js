'use client';

import { useState, useRef, useEffect } from 'react';

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

// --- 단어 목록 ---
const wordList = [
    { en: 'ability', ko: '능력' }, { en: 'accept', ko: '받아들이다' }, { en: 'achieve', ko: '성취하다' },
    { en: 'act', ko: '행동하다' }, { en: 'add', ko: '더하다' }, { en: 'afraid', ko: '두려워하는' },
    { en: 'agree', ko: '동의하다' }, { en: 'allow', ko: '허락하다' }, { en: 'appear', ko: '나타나다' },
    { en: 'arrive', ko: '도착하다' }, { en: 'art', ko: '예술' }, { en: 'ask', ko: '묻다' },
    { en: 'attack', ko: '공격하다' }, { en: 'avoid', ko: '피하다' }, { en: 'base', ko: '기초' },
    { en: 'beautiful', ko: '아름다운' }, { en: 'become', ko: '~이 되다' }, { en: 'begin', ko: '시작하다' },
    { en: 'believe', ko: '믿다' }, { en: 'borrow', ko: '빌리다' }, { en: 'break', ko: '깨뜨리다' },
    { en: 'bring', ko: '가져오다' }, { en: 'build', ko: '짓다' }, { en: 'buy', ko: '사다' },
    { en: 'call', ko: '부르다, 전화하다' }, { en: 'care', ko: '돌봄, 신경쓰다' }, { en: 'carry', ko: '나르다' },
    { en: 'catch', ko: '잡다' }, { en: 'cause', ko: '원인, 야기하다' }, { en: 'change', ko: '바꾸다, 변화' },
    { en: 'choose', ko: '선택하다' }, { en: 'clean', ko: '깨끗한, 청소하다' }, { en: 'close', ko: '닫다, 가까운' },
    { en: 'collect', ko: '모으다' }, { en: 'come', ko: '오다' }, { en: 'common', ko: '흔한, 공통의' },
    { en: 'continue', ko: '계속하다' }, { en: 'cook', ko: '요리하다' }, { en: 'cool', ko: '시원한, 멋진' },
    { en: 'correct', ko: '옳은, 수정하다' }, { en: 'cost', ko: '비용, 비용이 들다' }, { en: 'cover', ko: '덮다' },
    { en: 'create', ko: '창조하다' }, { en: 'cross', ko: '건너다' }, { en: 'cry', ko: '울다' },
    { en: 'cut', ko: '자르다' }, { en: 'dance', ko: '춤추다' }, { en: 'decide', ko: '결정하다' },
    { en: 'deep', ko: '깊은' }, { en: 'delicious', ko: '맛있는' }, { en: 'design', ko: '디자인하다, 디자인' },
    { en: 'develop', ko: '발전시키다' }, { en: 'die', ko: '죽다' }, { en: 'different', ko: '다른' },
    { en: 'difficult', ko: '어려운' }, { en: 'discover', ko: '발견하다' }, { en: 'do', ko: '하다' },
    { en: 'draw', ko: '그리다' }, { en: 'dream', ko: '꿈, 꿈꾸다' }, { en: 'drink', ko: '마시다' },
    { en: 'drive', ko: '운전하다' }, { en: 'drop', ko: '떨어뜨리다' }, { en: 'early', ko: '일찍' },
    { en: 'earth', ko: '지구' }, { en: 'easy', ko: '쉬운' }, { en: 'eat', ko: '먹다' },
    { en: 'effort', ko: '노력' }, { en: 'end', ko: '끝, 끝내다' }, { en: 'enjoy', ko: '즐기다' },
    { en: 'enough', ko: '충분한' }, { en: 'enter', ko: '들어가다' }, { en: 'environment', ko: '환경' },
    { en: 'escape', ko: '탈출하다' }, { en: 'example', ko: '예시' }, { en: 'excite', ko: '흥분시키다' },
    { en: 'excuse', ko: '용서하다, 변명' }, { en: 'expect', ko: '기대하다' }, { en: 'explain', ko: '설명하다' },
    { en: 'face', ko: '얼굴, 직면하다' }, { en: 'fall', ko: '떨어지다, 가을' }, { en: 'famous', ko: '유명한' },
    { en: 'fast', ko: '빠른, 빨리' }, { en: 'feel', ko: '느끼다' }, { en: 'fight', ko: '싸우다' },
    { en: 'fill', ko: '채우다' }, { en: 'find', ko: '찾다' }, { en: 'finish', ko: '끝내다' },
    { en: 'fix', ko: '고치다' }, { en: 'fly', ko: '날다' }, { en: 'follow', ko: '따라가다' },
    { en: 'food', ko: '음식' }, { en: 'forget', ko: '잊다' }, { en: 'free', ko: '자유로운, 무료의' },
    { en: 'friend', ko: '친구' }, { en: 'future', ko: '미래' }, { en: 'get', ko: '얻다' },
    { en: 'give', ko: '주다' }, { en: 'go', ko: '가다' }, { en: 'grow', ko: '자라다' },
    { en: 'guess', ko: '추측하다' }, { en: 'happen', ko: '발생하다' }, { en: 'happy', ko: '행복한' },
    { en: 'have', ko: '가지다' }, { en: 'hear', ko: '듣다' }, { en: 'help', ko: '돕다' },
    { en: 'hold', ko: '잡다' }, { en: 'hope', ko: '희망하다' }, { en: 'hurt', ko: '다치게 하다' },
    { en: 'idea', ko: '생각' }, { en: 'imagine', ko: '상상하다' }, { en: 'important', ko: '중요한' },
    { en: 'interest', ko: '흥미, 이자' }, { en: 'introduce', ko: '소개하다' }, { en: 'invent', ko: '발명하다' },
    { en: 'invite', ko: '초대하다' }, { en: 'join', ko: '참여하다' }, { en: 'jump', ko: '뛰다' },
    { en: 'keep', ko: '유지하다' }, { en: 'know', ko: '알다' }, { en: 'language', ko: '언어' },
    { en: 'laugh', ko: '웃다' }, { en: 'lead', ko: '이끌다' }, { en: 'learn', ko: '배우다' },
    { en: 'leave', ko: '떠나다, 남기다' }, { en: 'lend', ko: '빌려주다' }, { en: 'let', ko: '~하게 하다' },
    { en: 'lie', ko: '눕다, 거짓말하다' }, { en: 'life', ko: '삶, 생명' }, { en: 'like', ko: '좋아하다' },
    { en: 'listen', ko: '듣다' }, { en: 'live', ko: '살다' }, { en: 'look', ko: '보다' },
    { en: 'lose', ko: '잃다' }, { en: 'love', ko: '사랑하다' }, { en: 'make', ko: '만들다' },
    { en: 'mean', ko: '의미하다' }, { en: 'meet', ko: '만나다' }, { en: 'message', ko: '메시지' },
    { en: 'mind', ko: '마음, 꺼리다' }, { en: 'miss', ko: '놓치다, 그리워하다' }, { en: 'move', ko: '움직이다, 이사하다' },
    { en: 'need', ko: '필요하다' }, { en: 'open', ko: '열다' }, { en: 'order', ko: '주문하다, 순서' },
    { en: 'paint', ko: '그리다, 칠하다' }, { en: 'pass', ko: '통과하다' }, { en: 'pay', ko: '지불하다' },
    { en: 'plan', ko: '계획, 계획하다' }, { en: 'play', ko: '놀다, 연주하다' }, { en: 'please', ko: '제발, 기쁘게 하다' },
    { en: 'practice', ko: '연습하다' }, { en: 'prepare', ko: '준비하다' }, { en: 'promise', ko: '약속하다' },
    { en: 'protect', ko: '보호하다' }, { en: 'pull', ko: '당기다' }, { en: 'push', ko: '밀다' },
    { en: 'put', ko: '놓다' }, { en: 'question', ko: '질문' }, { en: 'read', ko: '읽다' },
    { en: 'ready', ko: '준비된' }, { en: 'receive', ko: '받다' }, { en: 'remember', ko: '기억하다' },
    { en: 'repeat', ko: '반복하다' }, { en: 'rest', ko: '휴식하다' }, { en: 'return', ko: '돌아오다, 반납하다' },
    { en: 'ride', ko: '타다' }, { en: 'run', ko: ' 달리다' }, { en: 'save', ko: '구하다, 저축하다' },
    { en: 'say', ko: '말하다' }, { en: 'see', ko: '보다' }, { en: 'sell', ko: '팔다' },
    { en: 'send', ko: '보내다' }, { en: 'share', ko: '공유하다' }, { en: 'show', ko: '보여주다' },
    { en: 'sing', ko: '노래하다' }, { en: 'sit', ko: '앉다' }, { en: 'sleep', ko: '자다' },
    { en: 'speak', ko: '말하다' }, { en: 'spend', ko: '쓰다, 보내다' }, { en: 'stand', ko: '서다' },
    { en: 'start', ko: '시작하다' }, { en: 'stay', ko: '머무르다' }, { en: 'stop', ko: '멈추다' },
    { en: 'study', ko: '공부하다' }, { en: 'swim', ko: '수영하다' }, { en: 'take', ko: '가져가다' },
    { en: 'talk', ko: '이야기하다' }, { en: 'teach', ko: '가르치다' }, { en: 'tell', ko: '말하다' },
    { en: 'think', ko: '생각하다' }, { en: 'throw', ko: '던지다' }, { en: 'touch', ko: '만지다' },
    { en: 'travel', ko: '여행하다' }, { en: 'try', ko: '노력하다, 시도하다' }, { en: 'turn', ko: '돌다' },
    { en: 'understand', ko: '이해하다' }, { en: 'use', ko: '사용하다' }, { en: 'visit', ko: '방문하다' },
    { en: 'wait', ko: '기다리다' }, { en: 'walk', ko: '걷다' }
];

export default function Home() {
    // --- 상태 관리 변수들 ---
    const [gameState, setGameState] = useState('IDLE'); // IDLE, ASKING_ID, ASKING_QUIZ_TYPE, IN_QUIZ, SHOWING_RESULTS
    const [userId, setUserId] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [quizType, setQuizType] = useState(''); // 'KO_TO_EN' or 'EN_TO_KO'
    
    // 퀴즈 관련 상태
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState([]);

    const chatContainerRef = useRef(null);

    // --- useEffect Hooks ---
    useEffect(() => {
        addBotMessage("안녕하세요! NTB 영단어 챌린지에 오신 것을 환영합니다. 먼저 회원님의 아이디를 알려주시겠어요?");
        setGameState('ASKING_ID');
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    // --- 챗봇 메시지 추가 헬퍼 함수 ---
    const addBotMessage = (text) => {
        setChatHistory(prev => [...prev, { role: 'bot', content: text }]);
    };

    // --- 퀴즈 로직 함수들 ---
    const startQuiz = () => {
        const shuffled = [...wordList].sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, 10);
        setQuestions(selectedQuestions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setWrongAnswers([]);
        setGameState('IN_QUIZ');
        const quizStartMessage = quizType === 'KO_TO_EN' 
            ? `좋아요, ${userId}님! 지금부터 10개의 단어 퀴즈를 시작하겠습니다. 제가 뜻을 알려드리면, 해당하는 영어 단어를 입력해주세요.`
            : `좋아요, ${userId}님! 지금부터 10개의 단어 퀴즈를 시작하겠습니다. 제가 영어 단어를 보여드리면, 해당하는 뜻을 입력해주세요.`;
        addBotMessage(quizStartMessage);
        setTimeout(() => askQuestion(selectedQuestions, 0), 1000);
    };

    const askQuestion = (qs, index) => {
        const questionText = quizType === 'KO_TO_EN' ? qs[index].ko : qs[index].en;
        addBotMessage(`문제 ${index + 1}: "${questionText}"`);
    };

    const checkAnswer = (userAnswer) => {
        const currentQuestion = questions[currentQuestionIndex];
        const correctAnswer = quizType === 'KO_TO_EN' ? currentQuestion.en : currentQuestion.ko;
        
        if (userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
            setScore(prev => prev + 1);
            addBotMessage("정답입니다! 🎉");
        } else {
            setWrongAnswers(prev => [...prev, currentQuestion]);
            addBotMessage(`아쉬워요. 정답은 "${correctAnswer}" 입니다.`);
        }

        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
            setTimeout(() => askQuestion(questions, nextIndex), 1000);
        } else {
            setGameState('SHOWING_RESULTS');
            setTimeout(() => showResults(userAnswer), 1000);
        }
    };

    const showResults = async (lastUserAnswer) => {
        setIsLoading(true);
        addBotMessage(`퀴즈가 모두 끝났습니다, ${userId}님! 결과를 알려드릴게요...`);

        // 마지막 문제 채점 반영
        let finalScore = score;
        const lastQuestion = questions[questions.length - 1];
        const lastCorrectAnswer = quizType === 'KO_TO_EN' ? lastQuestion.en : lastQuestion.ko;
        if(lastUserAnswer.toLowerCase().trim() === lastCorrectAnswer.toLowerCase().trim()){
            // checkAnswer에서 score가 이미 반영되었으므로, 여기서는 중복 계산하지 않음
        }

        let resultMessage = `총 10문제 중 ${score}개를 맞추셨어요! 정말 잘하셨습니다.`;
        if (wrongAnswers.length === 0) {
            resultMessage += "\n\n모든 문제를 맞추다니, 정말 대단해요! 완벽한 실력입니다. 👍";
            addBotMessage(resultMessage);
        } else {
            resultMessage += `\n\n아쉽게 틀린 ${wrongAnswers.length}개의 단어를 함께 복습해볼까요?`;
            addBotMessage(resultMessage);
            
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        type: 'GET_WORD_DETAILS', 
                        words: wrongAnswers.map(w => w.en) 
                    }),
                });
                const data = await response.json();
                if (data.details) {
                    data.details.forEach(detail => {
                        const detailMessage = `**${detail.word}**\n- **예문:** ${detail.example}\n- **어원:** ${detail.etymology}`;
                        addBotMessage(detailMessage);
                    });
                }
            } catch (error) {
                addBotMessage("틀린 단어의 상세 정보를 가져오는 데 실패했어요. 다시 시도해주세요.");
            }
        }
        
        setTimeout(() => {
            addBotMessage(`오늘도 정말 수고 많으셨습니다! 꾸준히 도전하는 ${userId}님의 모습이 정말 멋져요. 다음에 또 만나요! 챌린지를 다시 시작하려면 '다시 시작'이라고 입력해주세요.`);
            setGameState('IDLE');
        }, 1000);
        
        setIsLoading(false);
    };

    // --- 폼 제출 핸들러 ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentUserInput = userInput.trim();
        if (!currentUserInput || isLoading) return;

        setChatHistory(prev => [...prev, { role: 'user', content: currentUserInput }]);
        setUserInput('');

        if (currentUserInput.toLowerCase() === '다시 시작') {
            setGameState('IDLE');
            setChatHistory([]);
            setTimeout(() => {
                addBotMessage("안녕하세요! NTB 영단어 챌린지에 오신 것을 환영합니다. 먼저 회원님의 아이디를 알려주시겠어요?");
                setGameState('ASKING_ID');
            }, 500);
            return;
        }

        switch (gameState) {
            case 'ASKING_ID':
                setUserId(currentUserInput);
                addBotMessage(`${currentUserInput}님, 반갑습니다! 어떤 방식으로 퀴즈를 풀어보시겠어요? '한글' 또는 '영어'를 입력해주세요.\n(한글: 뜻을 보고 영어 단어 맞추기 / 영어: 영어 단어를 보고 뜻 맞추기)`);
                setGameState('ASKING_QUIZ_TYPE');
                break;
            case 'ASKING_QUIZ_TYPE':
                if (currentUserInput.includes('한글')) {
                    setQuizType('KO_TO_EN');
                    addBotMessage('좋아요! 뜻을 보고 영어 단어를 맞추는 퀴즈를 준비할게요. 준비되시면 "시작"이라고 입력해주세요.');
                    setGameState('IDLE');
                } else if (currentUserInput.includes('영어')) {
                    setQuizType('EN_TO_KO');
                    addBotMessage('좋아요! 영어 단어를 보고 뜻을 맞추는 퀴즈를 준비할게요. 준비되시면 "시작"이라고 입력해주세요.');
                    setGameState('IDLE');
                } else {
                    addBotMessage("죄송해요, 잘 이해하지 못했어요. '한글' 또는 '영어' 중에서 선택해서 다시 입력해주세요.");
                }
                break;
            case 'IN_QUIZ':
                setIsLoading(true);
                checkAnswer(currentUserInput);
                setIsLoading(false);
                break;
            default: // IDLE, SHOWING_RESULTS 상태
                if (currentUserInput.toLowerCase() === '시작' && userId && quizType) {
                    startQuiz();
                } else {
                    addBotMessage("챌린지를 시작하려면 먼저 아이디와 퀴즈 타입을 선택해야 해요. '다시 시작'을 입력해서 처음부터 진행해주세요.");
                }
                break;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-800 text-white relative">
            <div className="absolute inset-0 flex items-center justify-center z-0">
                <span className="text-9xl font-extrabold text-white opacity-5 select-none">NTB</span>
            </div>
            <div className="flex flex-col h-full z-10 backdrop-blur-sm bg-black/10">
                <header className="p-4 border-b border-gray-700">
                    <h1 className="text-2xl font-bold text-center">NTB 챗봇</h1>
                </header>
                <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {chatHistory.map((message, index) => (
                        <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                            {message.role === 'bot' && <BotIcon />}
                            <div className={`p-4 rounded-2xl max-w-xl shadow-lg ${message.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                                <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                            </div>
                            {message.role === 'user' && <UserIcon />}
                        </div>
                    ))}
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
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={isLoading ? "답변을 확인하고 있어요..." : "여기에 입력하세요..."}
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
    );
}
