import React, { useState } from 'react';
import { X, Save, Calculator } from 'lucide-react';
import { useCorretores, useEmpreendimentos, useVendas } from '../hooks/useDatabase';

interface SaleFormProps {
  sale?: any;
  onClose: () => void;
}

const SaleForm: React.FC<SaleFormProps> = ({ sale, onClose }) => {
  const { empreendimentos } = useEmpreendimentos();
  const { corretores } = useCorretores();
  const { createVenda } = useVendas();

  const [formData, setFormData] = useState({
    cliente_nome: sale?.cliente_nome || '',
    empreendimento_id: sale?.empreendimento_id || '',
    corretor_id: sale?.corretor_id || '',
    valor_entrada: sale?.valor_entrada || 0,
    quantidade_parcelas: sale?.quantidade_parcelas || 1,
    data_venda: sale?.data_venda || new Date().toISOString().split('T')[0],
    lote: sale?.lote || '',
    quadra: sale?.quadra || ''
  });

  const [loading, setLoading] = useState(false);

  const selectedEmpreendimento = empreendimentos.find(e => e.id === formData.empreendimento_id);
  const commissionPerInstallment = selectedEmpreendimento 
    ? selectedEmpreendimento.valor_minimo / formData.quantidade_parcelas 
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!selectedEmpreendimento) return;

    const vendaData = {
      ...formData,
      valor_comissao_total: selectedEmpreendimento.valor_minimo
    };

    try {
      const { error } = await createVenda(vendaData);
      
      if (!error) {
        onClose();
      } else {
        console.error('Erro ao criar venda:', error);
      }
    } catch (error) {
      console.error('Erro ao criar venda:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {sale ? 'Editar Venda' : 'Nova Venda'}
          </h2>
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
              Nome do Cliente
            </label>
            <input
              type="text"
              value={formData.cliente_nome}
              onChange={(e) => setFormData({ ...formData, cliente_nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empreendimento
            </label>
            <select
              value={formData.empreendimento_id}
              onChange={(e) => setFormData({ ...formData, empreendimento_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecione um empreendimento</option>
              {empreendimentos.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.nome} - R$ {emp.valor_minimo.toLocaleString('pt-BR')} comissão
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Corretor Responsável
            </label>
            <select
              value={formData.corretor_id}
              onChange={(e) => setFormData({ ...formData, corretor_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecione um corretor</option>
              {corretores.map(corretor => (
                <option key={corretor.id} value={corretor.id}>
                  {corretor.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lote
              </label>
              <input
                type="text"
                value={formData.lote}
                onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 15"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quadra
              </label>
              <input
                type="text"
                value={formData.quadra}
                onChange={(e) => setFormData({ ...formData, quadra: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: A"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data da Venda
            </label>
            <input
              type="date"
              value={formData.data_venda}
              onChange={(e) => setFormData({ ...formData, data_venda: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor Total da Entrada
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">R$</span>
              <input
                type="number"
                value={formData.valor_entrada}
                onChange={(e) => setFormData({ ...formData, valor_entrada: Number(e.target.value) })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parcelamento da Entrada
            </label>
            <select
              value={formData.quantidade_parcelas}
              onChange={(e) => setFormData({ ...formData, quantidade_parcelas: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5].map(count => (
                <option key={count} value={count}>
                  {count}x de R$ {formData.valor_entrada > 0 ? (formData.valor_entrada / count).toLocaleString('pt-BR') : '0,00'}
                </option>
              ))}
            </select>
          </div>

          {selectedEmpreendimento && formData.quantidade_parcelas > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center text-blue-700 mb-2">
                <Calculator className="w-4 h-4 mr-2" />
                <span className="font-medium">Resumo da Comissão</span>
              </div>
              <div className="text-sm text-blue-600 space-y-1">
                <p>Comissão total: R$ {selectedEmpreendimento.valor_minimo.toLocaleString('pt-BR')}</p>
                <p>Dividida em {formData.quantidade_parcelas} parcela(s)</p>
                <p className="font-medium">
                  R$ {commissionPerInstallment.toLocaleString('pt-BR')} por parcela
                </p>
              </div>
            </div>
          )}

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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleForm;