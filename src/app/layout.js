import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata = {
  title: 'NTB Chatbot - 대화의 미래',
  description: 'AI 기반 챗봇 솔루션으로 비즈니스의 가치를 높이세요.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans bg-off-white text-charcoal antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
