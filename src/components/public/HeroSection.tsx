import React from 'react';

interface HeroSectionProps {
  onRequestQuote: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onRequestQuote }) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Animation Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-green-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6TTEyIDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0yNCAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] animate-pulse"></div>
        </div>
      </div>

      {/* Logo Placeholder */}
      <div className="absolute top-8 left-8 z-20">
        <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
          <div className="text-2xl font-bold text-white tracking-wider">BKAAP</div>
          <div className="text-xs text-green-400 tracking-widest">CONSTRUÇÕES</div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
          Construindo com qualidade,<br />
          <span className="text-green-400">confiança e experiência</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto animate-fade-in-delay">
          Transformamos sonhos em realidade com excelência em cada detalhe da sua obra
        </p>

        <button
          onClick={onRequestQuote}
          className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-12 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/50 animate-fade-in-delay-2"
        >
          Solicitar Orçamento
        </button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
          <div className="text-center animate-fade-in-delay-3">
            <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">15+</div>
            <div className="text-gray-300 text-sm md:text-base">Anos de Experiência</div>
          </div>
          <div className="text-center animate-fade-in-delay-3">
            <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">200+</div>
            <div className="text-gray-300 text-sm md:text-base">Obras Concluídas</div>
          </div>
          <div className="text-center animate-fade-in-delay-3">
            <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">100%</div>
            <div className="text-gray-300 text-sm md:text-base">Clientes Satisfeitos</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
