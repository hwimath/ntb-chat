import { Bot, BrainCircuit, Zap, ArrowRight, ShieldCheck, LifeBuoy } from 'lucide-react';

export default function Page() {
  const features = [
    {
      icon: <BrainCircuit size={28} className="text-accent" />,
      title: "AI 기반 대화 엔진",
      description: "최첨단 AI 기술을 활용하여 고객의 의도를 정확하게 파악하고 자연스러운 대화를 제공합니다.",
    },
    {
      icon: <Zap size={28} className="text-accent" />,
      title: "손쉬운 연동",
      description: "복잡한 과정 없이 몇 줄의 코드만으로 기존 웹사이트나 앱에 손쉽게 챗봇을 통합할 수 있습니다.",
    },
    {
      icon: <ShieldCheck size={28} className="text-accent" />,
      title: "강력한 보안",
      description: "모든 대화 내용은 안전하게 암호화되며, 고객의 데이터를 최우선으로 보호합니다.",
    },
     {
      icon: <LifeBuoy size={28} className="text-accent" />,
      title: "24/7 고객 지원",
      description: "시간과 장소에 구애받지 않고, 24시간 내내 고객의 문의에 신속하게 응답하여 만족도를 높입니다.",
    },
  ];

  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full px-6 sm:px-10 md:px-16 py-6">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Bot size={28} className="text-charcoal" />
            <span className="text-xl font-semibold tracking-tight">NTB Chatbot</span>
          </div>
          <a
            href="#"
            className="hidden md:flex items-center gap-2 bg-charcoal text-off-white px-5 py-2.5 rounded-full text-sm font-medium transition-transform hover:scale-105"
          >
            <span>지금 시작하기</span>
            <ArrowRight size={16} />
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-grow flex items-center w-full px-6 sm:px-10 md:px-16 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-charcoal leading-tight">
              대화의 미래, <br />
              <span className="text-accent">지능적으로</span> 해결하다
            </h1>
            <p className="max-w-md text-lg text-charcoal/70 leading-relaxed">
              NTB 챗봇은 단순한 응답을 넘어, 고객과 진정으로 소통합니다. 비즈니스의 가치를 높이는 가장 확실한 선택을 경험해 보세요.
            </p>
            <a
              href="#"
              className="flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-full text-base font-medium transition-transform hover:scale-105 shadow-lg shadow-accent/20"
            >
              <span>무료로 시작하기</span>
              <ArrowRight size={20} />
            </a>
          </div>
          <div className="w-full h-80 lg:h-full bg-gray-200 rounded-2xl flex items-center justify-center overflow-hidden">
             <img 
                src="https://images.unsplash.com/photo-1558126319-c9feecbf59ee?q=80&w=2532&auto=format&fit=crop" 
                alt="AI Chatbot conversation illustration" 
                className="w-full h-full object-cover opacity-80"
                style={{filter: 'grayscale(30%) sepia(20%)'}}
              />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-white px-6 sm:px-10 md:px-16 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">핵심 기능</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-charcoal/60">
              NTB 챗봇이 제공하는 강력하고 직관적인 기능들을 만나보세요.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-off-white p-8 rounded-2xl flex flex-col gap-4">
                {feature.icon}
                <h3 className="text-xl font-semibold text-charcoal">{feature.title}</h3>
                <p className="text-charcoal/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full px-6 sm:px-10 md:px-16 py-10">
        <div className="max-w-7xl mx-auto text-center text-charcoal/50 text-sm">
          <p>&copy; {new Date().getFullYear()} NTB Chatbot. All Rights Reserved.</p>
        </div>
      </footer>
    </main>
  );
}
