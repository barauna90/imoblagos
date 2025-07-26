import React from 'react';
import { useAuth } from './hooks/useAuth';
import { useCorretores, useEmpreendimentos, useVendas } from './hooks/useDatabase';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BrokerDashboard from './components/BrokerDashboard';
import SalesTable from './components/SalesTable';
import UsersManagement from './components/UsersManagement';
import EmpreendimentosManagement from './components/EmpreendimentosManagement';
import { BarChart3, FileText, Users, Building } from 'lucide-react';

const Navigation: React.FC<{ 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  userRole: 'admin' | 'corretor';
}> = ({ 
  activeTab, 
  setActiveTab,
  userRole
}) => {

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'sales', label: 'Vendas', icon: FileText },
    { id: 'users', label: 'Corretores', icon: Users },
    { id: 'empreendimentos', label: 'Empreendimentos', icon: Building }
  ];

  const brokerTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'sales', label: 'Minhas Vendas', icon: FileText }
  ];

  const tabs = userRole === 'admin' ? adminTabs : brokerTabs;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

const MainApp: React.FC = () => {
  const { profile, loading } = useAuth();
  const [activeTab, setActiveTab] = React.useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando sistema...</p>
          <p className="mt-2 text-sm text-gray-500">Verificando autenticação</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return profile.role === 'admin' ? <Dashboard /> : <BrokerDashboard />;
      case 'sales':
        return <SalesTable />;
      case 'users':
        return profile.role === 'admin' ? <UsersManagement /> : null;
      case 'empreendimentos':
        return profile.role === 'admin' ? <EmpreendimentosManagement /> : null;
      default:
        return profile.role === 'admin' ? <Dashboard /> : <BrokerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header profile={profile} />
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        userRole={profile.role}
      />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
};

function App() {
  return (
    <MainApp />
  );
}

export default App;