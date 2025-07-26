import React, { useState } from 'react';
import { Plus, Edit, Trash2, Building, MapPin, DollarSign } from 'lucide-react';
import { useEmpreendimentos } from '../hooks/useDatabase';
import EmpreendimentoForm from './EmpreendimentoForm';
import { Database } from '../lib/supabase';

type EmpreendimentoType = Database['public']['Tables']['empreendimentos']['Row'];

const EmpreendimentosManagement: React.FC = () => {
  const { empreendimentos, deleteEmpreendimento, loading } = useEmpreendimentos();
  const [showForm, setShowForm] = useState(false);
  const [editingEmpreendimento, setEditingEmpreendimento] = useState<EmpreendimentoType | undefined>();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleEdit = (empreendimento: EmpreendimentoType) => {
    setEditingEmpreendimento(empreendimento);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEmpreendimento(undefined);
  };

  const handleDelete = async (empreendimento: EmpreendimentoType) => {
    if (window.confirm(`Tem certeza que deseja excluir o empreendimento ${empreendimento.nome}?`)) {
      await deleteEmpreendimento(empreendimento.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Gestão de Empreendimentos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Empreendimento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {empreendimentos.map(empreendimento => (
          <div key={empreendimento.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Building className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{empreendimento.nome}</h3>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(empreendimento)}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(empreendimento)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {empreendimento.localizacao}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="font-medium text-green-600">
                    R$ {empreendimento.valor_minimo.toLocaleString('pt-BR')}
                  </span>
                  <span className="ml-1">por venda</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Criado em {new Date(empreendimento.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        ))}

        {empreendimentos.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum empreendimento cadastrado</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Cadastrar primeiro empreendimento
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <EmpreendimentoForm
          empreendimento={editingEmpreendimento}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default EmpreendimentosManagement;