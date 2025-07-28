import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// POST 요청을 처리하는 함수
export async function POST(req) {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
        return NextResponse.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    try {
        const { word } = await req.json();

        if (!word) {
            return NextResponse.json({ error: '해설을 요청할 단어가 없습니다.' }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `'${word}'라는 토익 어휘에 대해, 수험생이 이해하기 쉬운 간단한 예문 한 개와 흥미로운 어원을 설명해주세요. 답변은 다른 말 없이 예문과 어원만 포함해주세요.`;
        
        const result = await model.generateContent(prompt);
        const explanation = await result.response.text();
        
        return NextResponse.json({ explanation });

    } catch (error) {
        console.error('API 라우트 에러:', error);
        return NextResponse.json(
            { error: '해설 생성 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
