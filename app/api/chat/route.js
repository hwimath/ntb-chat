import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// POST 요청을 처리하는 함수
export async function POST(req) {
  // .env.local 파일에서 환경 변수를 가져옵니다.
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;

  // API 키나 URL이 없는 경우 에러를 반환합니다.
  if (!geminiApiKey || !appsScriptUrl) {
    return NextResponse.json(
      { error: 'API 키 또는 Apps Script URL이 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  try {
    // 1. 프론트엔드에서 보낸 사용자 메시지를 받습니다.
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: '메시지가 없습니다.' }, { status: 400 });
    }

    // 2. Gemini API를 초기화하고 챗봇 응답을 생성합니다.
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(message);
    const botResponse = await result.response.text();

    // 3. Google Apps Script로 대화 내용을 전송하고 결과를 로그로 남깁니다. (디버깅 강화)
    console.log('--- Google Sheets 저장 시도 ---');
    try {
      const sheetResponse = await fetch(appsScriptUrl, {
        method: 'POST',
        // 헤더 타입을 JSON으로 명확하게 지정합니다.
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage: message,
          botResponse: botResponse,
        }),
      });

      const responseText = await sheetResponse.text();
      console.log('Google Sheets 응답 상태 코드:', sheetResponse.status);
      console.log('Google Sheets 응답 내용:', responseText);

      if (sheetResponse.ok) {
        console.log('저장 성공!');
      } else {
        console.error('저장 실패! 응답 내용을 확인하세요.');
      }
    } catch (sheetError) {
      console.error('Google Sheets로 요청 중 네트워크 오류 발생:', sheetError);
    }
    console.log('--- Google Sheets 저장 시도 끝 ---');


    // 4. 프론트엔드에 챗봇의 응답을 반환합니다.
    return NextResponse.json({ reply: botResponse });

  } catch (error) {
    console.error('API 라우트 에러:', error);
    return NextResponse.json(
      { error: '메시지 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
