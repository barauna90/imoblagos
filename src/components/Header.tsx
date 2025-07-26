import React from 'react';
import { LogOut, User, Building } from 'lucide-react';
import { useAuth, UserProfile } from '../hooks/useAuth';

interface HeaderProps {
  profile: UserProfile;
}

const Header: React.FC<HeaderProps> = ({ profile }) => {
  const { signOut } = useAuth();
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Building className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema de Comissões
              </h1>
              <p className="text-sm text-gray-500">Gestão de Vendas</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{profile.nome}</p>
                <p className="text-xs text-gray-500">
                  {profile.role === 'admin' ? 'Administrador' : 'Corretor'}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;