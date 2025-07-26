import React, { useState } from 'react';
import { X, Save, Building } from 'lucide-react';
import { useEmpreendimentos } from '../hooks/useDatabase';
import { Database } from '../lib/supabase';

type EmpreendimentoType = Database['public']['Tables']['empreendimentos']['Row'];

interface EmpreendimentoFormProps {
  empreendimento?: EmpreendimentoType;
  onClose: () => void;
}

const EmpreendimentoForm: React.FC<EmpreendimentoFormProps> = ({ empreendimento, onClose }) => {
  const { createEmpreendimento, updateEmpreendimento } = useEmpreendimentos();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: empreendimento?.nome || '',
    localizacao: empreendimento?.localizacao || '',
    percentual_comissao: empreendimento?.percentual_comissao || 0,
    valor_minimo: empreendimento?.valor_minimo || 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (empreendimento) {
        await updateEmpreendimento(empreendimento.id, formData);
      } else {
        await createEmpreendimento(formData);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar empreendimento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Building className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              {empreendimento ? 'Editar Empreendimento' : 'Novo Empreendimento'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Empreendimento
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Residencial Jardim das Flores"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Localização
            </label>
            <input
              type="text"
              value={formData.localizacao}
              onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Zona Sul - São Paulo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor Mínimo da Comissão
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">R$</span>
              <input
                type="number"
                value={formData.valor_minimo}
                onChange={(e) => setFormData({ ...formData, valor_minimo: Number(e.target.value) })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1000"
                min="0"
                step="0.01"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Valor total da comissão que será dividido proporcionalmente às parcelas
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Salvando...' : (empreendimento ? 'Atualizar' : 'Salvar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpreendimentoForm;