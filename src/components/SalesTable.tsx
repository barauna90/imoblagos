import React, { useState, useMemo } from 'react';
import { Edit, Trash2, Check, DollarSign, Filter, Plus, Download, CreditCard, Calendar } from 'lucide-react';
import { useVendas, useCorretores, useEmpreendimentos } from '../hooks/useDatabase';
import { useAuth } from '../hooks/useAuth';
import SaleForm from './SaleForm';

const SalesTable: React.FC = () => {
  const { vendas, markParcelaPaga, markComissaoPaga, loading } = useVendas();
  const { corretores } = useCorretores();
  const { empreendimentos } = useEmpreendimentos();
  const { profile } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [editingSale, setEditingSale] = useState<any>();
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSale, setExpandedSale] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({});

  const filteredSales = useMemo(() => {
    let filtered = vendas;

    // Filter by broker if current user is broker
    if (profile?.role === 'corretor') {
      const corretor = corretores.find(c => c.user_id === profile.user_id);
      if (corretor) {
        filtered = filtered.filter(sale => sale.corretor_id === corretor.id);
      }
    }

    // Apply admin filters
    if (filters.month) {
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.created_at);
        return saleDate.toISOString().slice(0, 7) === filters.month;
      });
    }

    if (filters.corretorId) {
      filtered = filtered.filter(sale => sale.corretor_id === filters.corretorId);
    }

    if (filters.empreendimentoId) {
      filtered = filtered.filter(sale => sale.empreendimento_id === filters.empreendimentoId);
    }

    if (filters.status && filters.status !== 'all') {
      switch (filters.status) {
        case 'paid':
          filtered = filtered.filter(sale => 
            sale.comissoes?.every((c: any) => c.paga) || false
          );
          break;
        case 'pending':
          filtered = filtered.filter(sale => 
            sale.comissoes?.some((c: any) => c.data_prevista && !c.paga) || false
          );
          break;
        case 'overdue':
          filtered = filtered.filter(sale => 
            sale.comissoes?.some((c: any) => {
              if (!c.data_prevista || c.paga) return false;
              return new Date(c.data_prevista) < new Date();
            }) || false
          );
          break;
      }
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [vendas, profile, filters, corretores]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getOverallStatus = (sale: any) => {
    const comissoes = sale.comissoes || [];
    const allCommissionsPaid = comissoes.every((c: any) => c.paga);
    const hasOverdueCommissions = comissoes.some((c: any) => {
      if (!c.data_prevista || c.paga) return false;
      return new Date(c.data_prevista) < new Date();
    });
    const hasPendingCommissions = comissoes.some((c: any) => c.data_prevista && !c.paga);

    if (allCommissionsPaid) {
      return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Finalizado</span>;
    }
    
    if (hasOverdueCommissions) {
      return <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Em Atraso</span>;
    }

    if (hasPendingCommissions) {
      return <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Pendente</span>;
    }

    return <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">Aguardando</span>;
  };

  const getCorretorName = (corretorId: string) => {
    return corretores.find(c => c.id === corretorId)?.nome || 'N/A';
  };

  const getEmpreendimentoName = (empreendimentoId: string) => {
    return empreendimentos.find(emp => emp.id === empreendimentoId)?.nome || 'N/A';
  };

  const handleEdit = (sale: any) => {
    setEditingSale(sale);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSale(undefined);
  };

  const exportToPDF = () => {
    const data = filteredSales.map(sale => ({
      cliente: sale.cliente_nome,
      empreendimento: getEmpreendimentoName(sale.empreendimento_id),
      corretor: getCorretorName(sale.corretor_id),
      entrada: sale.valor_entrada,
      comissao: sale.valor_comissao_total,
      parcelas: sale.quantidade_parcelas
    }));
    
    console.log('Exportando para PDF:', data);
    alert('Funcionalidade de exportação PDF será implementada');
  };

  const toggleExpanded = (saleId: string) => {
    setExpandedSale(expandedSale === saleId ? null : saleId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {profile?.role === 'admin' ? 'Todas as Vendas' : 'Minhas Vendas'}
        </h2>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Venda
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
              <input
                type="month"
                value={filters.month || ''}
                onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

           {profile?.role === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Corretor</label>
                <select
                 value={filters.corretorId || ''}
                 onChange={(e) => setFilters({ ...filters, corretorId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos os corretores</option>
                 {corretores.map(corretor => (
                   <option key={corretor.id} value={corretor.id}>{corretor.nome}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Empreendimento</label>
              <select
                value={filters.empreendimentoId || ''}
                onChange={(e) => setFilters({ ...filters, empreendimentoId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os empreendimentos</option>
                {empreendimentos.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status || 'all'}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="paid">Finalizados</option>
                <option value="pending">Pendentes</option>
                <option value="overdue">Em Atraso</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setFilters({})}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Limpar filtros
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empreendimento
                </th>
                {profile?.role === 'admin' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Corretor
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entrada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comissão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <React.Fragment key={sale.id}>
                  <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleExpanded(sale.id)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{sale.cliente_nome}</div>
                        <div className="text-sm text-gray-500">
                          Lote {sale.lote}, Quadra {sale.quadra}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getEmpreendimentoName(sale.empreendimento_id)}
                    </td>
                    {profile?.role === 'admin' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getCorretorName(sale.corretor_id)}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        R$ {sale.valor_entrada.toLocaleString('pt-BR')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {sale.parcelas?.filter((p: any) => p.paga).length || 0}/{sale.quantidade_parcelas} pagas
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        R$ {sale.valor_comissao_total.toLocaleString('pt-BR')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {sale.comissoes?.filter((c: any) => c.paga).length || 0}/{sale.quantidade_parcelas} pagas
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getOverallStatus(sale)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(sale);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {expandedSale === sale.id && (
                    <tr>
                      <td colSpan={profile?.role === 'admin' ? 6 : 5} className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Parcelas da Entrada */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                              <CreditCard className="w-4 h-4 mr-2" />
                              Parcelas da Entrada
                            </h4>
                            <div className="space-y-2">
                              {(sale.parcelas || []).map((parcela: any) => (
                                <div key={parcela.id} className="flex items-center justify-between p-3 bg-white rounded border">
                                  <div>
                                    <span className="text-sm font-medium">
                                      {parcela.numero_parcela}ª parcela
                                    </span>
                                    <div className="text-xs text-gray-500">
                                      Venc: {new Date(parcela.data_vencimento).toLocaleDateString('pt-BR')}
                                    </div>
                                    <div className="text-sm font-medium text-green-600">
                                      R$ {parcela.valor.toLocaleString('pt-BR')}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {parcela.paga ? (
                                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                        Pago em {parcela.data_pagamento ? new Date(parcela.data_pagamento).toLocaleDateString('pt-BR') : 'N/A'}
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() => markParcelaPaga(parcela.id)}
                                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                                        title="Marcar como pago"
                                      >
                                        <Check className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Parcelas da Comissão */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                              <DollarSign className="w-4 h-4 mr-2" />
                              Parcelas da Comissão
                            </h4>
                            <div className="space-y-2">
                              {(sale.comissoes || []).map((comissao: any) => (
                                <div key={comissao.id} className="flex items-center justify-between p-3 bg-white rounded border">
                                  <div>
                                    <span className="text-sm font-medium">
                                      Comissão {comissao.id.slice(-4)}
                                    </span>
                                    {comissao.data_prevista && (
                                      <div className="text-xs text-gray-500">
                                        Prev: {new Date(comissao.data_prevista).toLocaleDateString('pt-BR')}
                                      </div>
                                    )}
                                    <div className="text-sm font-medium text-blue-600">
                                      R$ {comissao.valor.toLocaleString('pt-BR')}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {comissao.paga ? (
                                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                        Pago em {comissao.data_pagamento ? new Date(comissao.data_pagamento).toLocaleDateString('pt-BR') : 'N/A'}
                                      </span>
                                    ) : comissao.data_prevista ? (
                                      <button
                                        onClick={() => markComissaoPaga(comissao.id)}
                                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                                        title="Marcar comissão como paga"
                                      >
                                        <DollarSign className="w-4 h-4" />
                                      </button>
                                    ) : (
                                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                        Aguardando entrada
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={profile?.role === 'admin' ? 6 : 5} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma venda encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <SaleForm
          sale={editingSale}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default SalesTable;