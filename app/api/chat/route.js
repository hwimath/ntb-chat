import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// POST 요청을 처리하는 함수
export async function POST(req) {
  // .env.local 파일에서 환경 변수를 가져옵니다.
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;

  if (!geminiApiKey || !appsScriptUrl) {
    return NextResponse.json(
      { error: 'API 키 또는 Apps Script URL이 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: '메시지가 없습니다.' }, { status: 400 });
    }

    // --- 프롬프트 개선 ---
    // 챗봇의 역할을 정의하는 시스템 프롬프트를 추가합니다.
    const systemPrompt = "당신은 'NTB 챗봇'입니다. 항상 친절하고 명료한 존댓말로 사용자에게 답변해야 합니다. 사용자의 질문에 대해 깊이 공감하며, 도움이 되는 정보를 제공하는 것을 최우선으로 생각하세요.";
    const fullPrompt = `${systemPrompt}\n\n사용자 질문: ${message}`;
    // --- 프롬프트 개선 끝 ---


    // Gemini API를 초기화하고 챗봇 응답을 생성합니다.
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(fullPrompt); // 수정된 프롬프트를 사용
    const botResponse = await result.response.text();

    // Google Apps Script로 대화 내용을 전송합니다.
    fetch(appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMessage: message,
        botResponse: botResponse,
      }),
    }).catch(err => {
      console.error('Google Sheets 저장 실패:', err);
    });

    // 프론트엔드에 챗봇의 응답을 반환합니다.
    return NextResponse.json({ reply: botResponse });

  } catch (error) {
    console.error('API 라우트 에러:', error);
    return NextResponse.json(
      { error: '메시지 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
