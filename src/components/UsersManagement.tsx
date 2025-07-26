import React, { useState } from 'react';
import { Plus, Edit, Trash2, User, Shield } from 'lucide-react';
import { useCorretores } from '../hooks/useDatabase';
import { useAuth } from '../hooks/useAuth';
import UserForm from './UserForm';
import { Database } from '../lib/supabase';

type CorretorType = Database['public']['Tables']['corretores']['Row'];

const UsersManagement: React.FC = () => {
  const { corretores, deleteCorretor, loading } = useCorretores();
  const { profile } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingCorretor, setEditingCorretor] = useState<CorretorType | undefined>();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleEdit = (corretor: CorretorType) => {
    setEditingCorretor(corretor);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCorretor(undefined);
  };

  const handleDelete = async (corretor: CorretorType) => {
    if (window.confirm(`Tem certeza que deseja excluir o corretor ${corretor.nome}?`)) {
      await deleteCorretor(corretor.id);
    }
  };

  const CorretorCard: React.FC<{ corretor: CorretorType }> = ({ corretor }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{corretor.nome}</h3>
            <p className="text-sm text-gray-500">{corretor.email}</p>
            {corretor.telefone && (
              <p className="text-sm text-gray-500">{corretor.telefone}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            Corretor
          </span>
          
          <button
            onClick={() => handleEdit(corretor)}
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleDelete(corretor)}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Gestão de Corretores</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Corretor
        </button>
      </div>

      <div className="space-y-6">
        {profile?.role === 'admin' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="font-medium text-blue-900">Administrador</h3>
            </div>
            <div className="text-sm text-blue-700">
              <p>{profile.nome}</p>
              <p>{profile.email}</p>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            <span>Corretores ({corretores.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {corretores.map(corretor => (
              <CorretorCard key={corretor.id} corretor={corretor} />
            ))}
            {corretores.length === 0 && (
              <div className="col-span-full text-center py-8">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum corretor cadastrado</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Cadastrar primeiro corretor
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <UserForm
          corretor={editingCorretor}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default UsersManagement;