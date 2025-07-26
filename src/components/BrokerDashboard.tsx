import React, { useMemo } from 'react';
import { DollarSign, Clock, TrendingUp, Calendar, CreditCard, Building } from 'lucide-react';
import { useVendas, useCorretores, useEmpreendimentos } from '../hooks/useDatabase';
import { useAuth } from '../hooks/useAuth';

const BrokerDashboard: React.FC = () => {
  const { vendas, loading: vendasLoading } = useVendas();
  const { corretores, loading: corretoresLoading } = useCorretores();
  const { empreendimentos, loading: empreendimentosLoading } = useEmpreendimentos();
  const { profile } = useAuth();

  const loading = vendasLoading || corretoresLoading || empreendimentosLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const brokerStats = useMemo(() => {
    if (!profile) return null;

    const corretor = corretores.find(c => c.user_id === profile.user_id);
    if (!corretor) return null;

    const corretorSales = vendas.filter(venda => venda.corretor_id === corretor.id);
    const allCommissions = corretorSales.flatMap(venda => venda.comissoes || []);
    
    const totalCommissionsPaid = allCommissions
      .filter((comissao: any) => comissao.paga)
      .reduce((sum, comissao: any) => sum + comissao.valor, 0);

    const totalCommissionsPending = allCommissions
      .filter((comissao: any) => comissao.data_prevista && !comissao.paga)
      .reduce((sum, comissao: any) => sum + comissao.valor, 0);

    const totalSales = corretorSales.length;

    const thisMonthSales = corretorSales.filter(venda => {
      const saleDate = new Date(venda.created_at);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });

    const upcomingCommissions = allCommissions.filter((comissao: any) => {
      if (!comissao.data_prevista || comissao.paga) return false;
      const dueDate = new Date(comissao.data_prevista);
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      return dueDate >= today && dueDate <= nextWeek;
    });

    const overdueCommissions = allCommissions.filter((comissao: any) => {
      if (!comissao.data_prevista || comissao.paga) return false;
      return new Date(comissao.data_prevista) < new Date();
    });

    return {
      totalCommissionsPaid,
      totalCommissionsPending,
      totalSales,
      thisMonthSales: thisMonthSales.length,
      upcomingCommissions,
      overdueCommissions
    };
  }, [vendas, profile, corretores]);

  const recentTransactions = useMemo(() => {
    if (!profile) return [];
    
    const corretor = corretores.find(c => c.user_id === profile.user_id);
    if (!corretor) return [];

    const corretorSales = vendas.filter(venda => venda.corretor_id === corretor.id);
    const allTransactions = corretorSales.flatMap(venda => 
      (venda.comissoes || []).map((comissao: any) => ({
        ...comissao,
        clientName: venda.cliente_nome,
        empreendimentoName: empreendimentos.find(e => e.id === venda.empreendimento_id)?.nome || 'N/A',
        saleId: venda.id
      }))
    );
    
    return allTransactions
      .sort((a, b) => {
        if (a.data_pagamento && b.data_pagamento) {
          return new Date(b.data_pagamento).getTime() - new Date(a.data_pagamento).getTime();
        }
        if (a.data_prevista && b.data_prevista) {
          return new Date(b.data_prevista).getTime() - new Date(a.data_prevista).getTime();
        }
        return 0;
      })
      .slice(0, 8);
  }, [vendas, profile, empreendimentos, corretores]);

  const empreendimentoPerformance = useMemo(() => {
    if (!profile) return [];
    
    const corretor = corretores.find(c => c.user_id === profile.user_id);
    if (!corretor) return [];

    const corretorSales = vendas.filter(venda => venda.corretor_id === corretor.id);
    const empStats = empreendimentos.map(emp => {
      const empSales = corretorSales.filter(venda => venda.empreendimento_id === emp.id);
      const empCommissions = empSales.flatMap(venda => venda.comissoes || []);
      
      const paid = empCommissions.filter((c: any) => c.paga).reduce((sum, c: any) => sum + c.valor, 0);
      const pending = empCommissions.filter((c: any) => c.data_prevista && !c.paga).reduce((sum, c: any) => sum + c.valor, 0);
      
      return {
        empreendimento: emp,
        salesCount: empSales.length,
        commissionsPaid: paid,
        commissionsPending: pending,
        total: paid + pending
      };
    }).filter(stat => stat.salesCount > 0)
      .sort((a, b) => b.total - a.total);
    
    return empStats;
  }, [vendas, profile, empreendimentos, corretores]);

  if (!brokerStats) return null;

  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Comissões Recebidas"
          value={`R$ ${brokerStats.totalCommissionsPaid.toLocaleString('pt-BR')}`}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Comissões Pendentes"
          value={`R$ ${brokerStats.totalCommissionsPending.toLocaleString('pt-BR')}`}
          icon={<Clock className="w-6 h-6 text-white" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Total de Vendas"
          value={brokerStats.totalSales.toString()}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Vendas este Mês"
          value={brokerStats.thisMonthSales.toString()}
          icon={<Calendar className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
      </div>

      {/* Alertas */}
      <div className="space-y-3">
        {brokerStats.overdueCommissions.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="font-medium text-red-900">Comissões em Atraso</h3>
            </div>
            <div className="space-y-2">
              {brokerStats.overdueCommissions.slice(0, 3).map(commission => {
                const sale = vendas.find(v => (v.comissoes || []).some((c: any) => c.id === commission.id));
                return (
                  <div key={commission.id} className="flex justify-between items-center text-sm">
                    <span className="text-red-700">{sale?.cliente_nome} - Comissão</span>
                    <span className="font-medium text-red-900">
                      R$ {commission.valor.toLocaleString('pt-BR')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {brokerStats.upcomingCommissions.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="font-medium text-blue-900">Comissões a Receber (próximos 7 dias)</h3>
            </div>
            <div className="space-y-2">
              {brokerStats.upcomingCommissions.slice(0, 3).map(commission => {
                const sale = vendas.find(v => (v.comissoes || []).some((c: any) => c.id === commission.id));
                return (
                  <div key={commission.id} className="flex justify-between items-center text-sm">
                    <span className="text-blue-700">{sale?.cliente_nome} - Comissão</span>
                    <span className="font-medium text-blue-900">
                      R$ {commission.valor.toLocaleString('pt-BR')} - {commission.data_prevista ? new Date(commission.data_prevista).toLocaleDateString('pt-BR') : 'N/A'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Extrato de Comissões */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Extrato de Comissões
            </h3>
            <p className="text-sm text-gray-500">Suas últimas transações</p>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {transaction.clientName} - Comissão
                      </h4>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          R$ {transaction.valor.toLocaleString('pt-BR')}
                        </p>
                        {transaction.paga ? (
                          <p className="text-xs text-green-600">
                            Pago em {transaction.data_pagamento ? new Date(transaction.data_pagamento).toLocaleDateString('pt-BR') : 'N/A'}
                          </p>
                        ) : transaction.data_prevista ? (
                          <p className={`text-xs ${new Date(transaction.data_prevista) < new Date() ? 'text-red-600' : 'text-yellow-600'}`}>
                            Prev: {new Date(transaction.data_prevista).toLocaleDateString('pt-BR')}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500">Aguardando entrada</p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{transaction.empreendimentoName}</p>
                    <div className="flex items-center mt-2">
                      {transaction.paga ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Pago
                        </span>
                      ) : transaction.data_prevista ? (
                        new Date(transaction.data_prevista) < new Date() ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Em Atraso
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pendente
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Aguardando
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {recentTransactions.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                Nenhuma transação encontrada
              </div>
            )}
          </div>
        </div>

        {/* Performance por Empreendimento */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Performance por Empreendimento
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {empreendimentoPerformance.map(({ empreendimento, salesCount, commissionsPaid, commissionsPending }) => (
                <div key={empreendimento.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                   <h4 className="font-medium text-gray-900">{empreendimento.nome}</h4>
                    <p className="text-sm text-gray-500">{salesCount} vendas</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      Pagas: R$ {commissionsPaid.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm font-medium text-yellow-600">
                      Pendentes: R$ {commissionsPending.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
              {empreendimentoPerformance.length === 0 && (
                <p className="text-center text-gray-500 py-4">Nenhuma venda realizada</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerDashboard;