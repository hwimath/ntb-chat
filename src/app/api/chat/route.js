import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// POST 요청을 처리하는 함수
export async function POST(req) {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const appsScriptUrl = process.env.APPS_SCRIPT_URL;

    if (!geminiApiKey) {
        return NextResponse.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { type, payload } = body; // type으로 요청을 구분합니다.

        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        if (type === 'GET_EXPLANATION') {
            // --- 어휘 해설 생성 로직 ---
            const { word } = payload;
            if (!word) {
                return NextResponse.json({ error: '해설을 요청할 단어가 없습니다.' }, { status: 400 });
            }
            const prompt = `'${word}'라는 토익 어휘에 대해, 수험생이 이해하기 쉬운 간단한 예문 한 개와 흥미로운 어원을 설명해주세요. 답변은 다른 말 없이 예문과 어원만 포함해주세요.`;
            const result = await model.generateContent(prompt);
            const explanation = await result.response.text();
            return NextResponse.json({ explanation });

        } else if (type === 'SAVE_RESULT') {
            // --- 결과 저장 로직 ---
            if (!appsScriptUrl) {
                return NextResponse.json({ error: 'Apps Script URL이 설정되지 않았습니다.' }, { status: 500 });
            }
            const { resultText } = payload;
            if (!resultText) {
                return NextResponse.json({ error: '저장할 결과 데이터가 없습니다.' }, { status: 400 });
            }
            
            // Apps Script로 결과 데이터를 그대로 전달합니다.
            await fetch(appsScriptUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resultText }),
            });
            return NextResponse.json({ status: 'success' });

        } else {
            return NextResponse.json({ error: '잘못된 요청 타입입니다.' }, { status: 400 });
        }

    } catch (error) {
        console.error('API 라우트 에러:', error);
        return NextResponse.json({ error: '요청 처리 중 오류가 발생했습니다.' }, { status: 500 });
    }
}
