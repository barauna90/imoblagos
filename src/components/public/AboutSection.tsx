import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sobre a <span className="text-green-600">BKAAP</span>
          </h2>
          <div className="w-24 h-1 bg-green-600 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Placeholder */}
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🏗️</div>
                  <p className="text-gray-600 font-medium">Imagem da empresa</p>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-green-600/10 rounded-2xl -z-10"></div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">
              Excelência em Construção Civil
            </h3>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              A BKAAP é uma empresa especializada em construção civil, com mais de 15 anos de experiência 
              no mercado. Nossa missão é entregar obras de alta qualidade, respeitando prazos e orçamentos, 
              sempre com foco na satisfação total de nossos clientes.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Qualidade Garantida</h4>
                  <p className="text-gray-600">
                    Utilizamos os melhores materiais e técnicas de construção do mercado
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⏱️</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Pontualidade</h4>
                  <p className="text-gray-600">
                    Cumprimos rigorosamente os prazos estabelecidos em contrato
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🤝</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Confiança</h4>
                  <p className="text-gray-600">
                    Transparência total em todas as etapas do projeto
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💼</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Experiência</h4>
                  <p className="text-gray-600">
                    Equipe altamente qualificada com anos de experiência no setor
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Nossa Missão</h4>
            <p className="text-gray-600">
              Construir com excelência, superando expectativas e criando valor duradouro para nossos clientes
            </p>
          </div>

          <div className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
            <div className="text-4xl mb-4">👁️</div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Nossa Visão</h4>
            <p className="text-gray-600">
              Ser referência em construção civil, reconhecida pela qualidade, inovação e compromisso
            </p>
          </div>

          <div className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
            <div className="text-4xl mb-4">⭐</div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Nossos Valores</h4>
            <p className="text-gray-600">
              Ética, transparência, qualidade, respeito ao cliente e compromisso com prazos
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
