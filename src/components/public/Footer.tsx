import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-2">
            <div className="mb-4">
              <div className="text-2xl font-bold tracking-wider">BKAAP</div>
              <div className="text-xs text-green-400 tracking-widest">CONSTRUÇÕES</div>
            </div>
            <p className="text-gray-400 mb-4">
              Construindo com qualidade, confiança e experiência há mais de 15 anos. 
              Transformamos sonhos em realidade.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <span className="text-xl">📘</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <span className="text-xl">📷</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <span className="text-xl">💼</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Sobre
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Portfólio
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Contato
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <a href="mailto:diretoria@bkaap.com.br" className="hover:text-green-400 transition-colors">
                  diretoria@bkaap.com.br
                </a>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📱</span>
                <a href="tel:+5511999999999" className="hover:text-green-400 transition-colors">
                  (11) 99999-9999
                </a>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📍</span>
                <span>São Paulo, SP</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">⏰</span>
                <span>Seg-Sex: 8h-18h</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            © {currentYear} BKAAP Construções. Todos os direitos reservados.
          </p>
          <p className="text-sm mt-2">
            Desenvolvido com 💚 para construir o futuro
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
