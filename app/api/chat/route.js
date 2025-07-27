import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// POST 요청을 처리하는 함수
export async function POST(req) {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
        return NextResponse.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { type, words } = body;

        // 요청 타입에 따라 분기
        if (type === 'GET_WORD_DETAILS') {
            if (!words || !Array.isArray(words) || words.length === 0) {
                return NextResponse.json({ error: '단어 목록이 필요합니다.' }, { status: 400 });
            }

            const genAI = new GoogleGenerativeAI(geminiApiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            // 여러 단어에 대한 정보를 병렬로 요청
            const promises = words.map(word => {
                const prompt = `'${word}'라는 영어 단어에 대해, 초보자가 이해하기 쉬운 간단한 예문 한 개와 흥미로운 어원을 설명해주세요. 답변 형식은 "예문: [여기에 예문]||어원: [여기에 어원]" 으로 통일해주세요. 다른 설명은 절대 추가하지 마세요.`;
                return model.generateContent(prompt).then(result => {
                    const text = result.response.text();
                    const parts = text.split('||');
                    const example = parts[0]?.replace('예문:', '').trim() || '정보를 찾을 수 없습니다.';
                    const etymology = parts[1]?.replace('어원:', '').trim() || '정보를 찾을 수 없습니다.';
                    return { word, example, etymology };
                });
            });

            const details = await Promise.all(promises);
            return NextResponse.json({ details });

        } else {
            // 다른 타입의 요청은 현재 처리하지 않음
            return NextResponse.json({ error: '잘못된 요청 타입입니다.' }, { status: 400 });
        }

    } catch (error) {
        console.error('API 라우트 에러:', error);
        return NextResponse.json({ error: '메시지 처리 중 오류가 발생했습니다.' }, { status: 500 });
    }
}
