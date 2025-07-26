import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, DollarSign, Clock, Users, Building, CreditCard } from 'lucide-react';
import { useVendas, useCorretores, useEmpreendimentos } from '../hooks/useDatabase';

const Dashboard: React.FC = () => {
  const { vendas, loading: vendasLoading } = useVendas();
  const { corretores, loading: corretoresLoading } = useCorretores();
  const { empreendimentos, loading: empreendimentosLoading } = useEmpreendimentos();

  const loading = vendasLoading || corretoresLoading || empreendimentosLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = useMemo(() => {
    const allComissoes = vendas.flatMap(venda => venda.comissoes || []);
    
    const totalCommissionsPaid = allComissoes
      .filter((comissao: any) => comissao.paga)
      .reduce((sum, comissao: any) => sum + comissao.valor, 0);

    const totalCommissionsPending = allComissoes
      .filter((comissao: any) => comissao.data_prevista && !comissao.paga)
      .reduce((sum, comissao: any) => sum + comissao.valor, 0);

    const totalCommissionsGenerated = vendas.reduce((sum, venda) => sum + venda.valor_comissao_total, 0);

    const totalSales = vendas.length;

    const monthlyRevenue = vendas
      .filter(sale => {
        const saleDate = new Date(sale.created_at);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
      })
      .reduce((sum, sale) => sum + sale.valor_entrada, 0);

    const overdueCommissions = allComissoes.filter((comissao: any) => {
      if (!comissao.data_prevista || comissao.paga) return false;
      return new Date(comissao.data_prevista) < new Date();
    }).length;

    const activeBrokers = corretores.length;

    return {
      totalCommissionsPaid,
      totalCommissionsPending,
      totalCommissionsGenerated,
      totalSales,
      monthlyRevenue,
      overdueCommissions,
      activeBrokers
    };
  }, [vendas, corretores]);

  const brokerStats = useMemo(() => {
    return corretores.map(corretor => {
      const corretorSales = vendas.filter(venda => venda.corretor_id === corretor.id);
      const corretorCommissions = corretorSales.flatMap(venda => venda.comissoes || []);
      
      const commissionsPaid = corretorCommissions
        .filter((comissao: any) => comissao.paga)
        .reduce((sum, comissao: any) => sum + comissao.valor, 0);
      
      const commissionsPending = corretorCommissions
        .filter((comissao: any) => comissao.data_prevista && !comissao.paga)
        .reduce((sum, comissao: any) => sum + comissao.valor, 0);
      
      return {
        corretor,
        salesCount: corretorSales.length,
        commissionsPaid,
        commissionsPending,
        totalCommissions: commissionsPaid + commissionsPending
      };
    }).sort((a, b) => b.totalCommissions - a.totalCommissions);
  }, [vendas, corretores]);

  const empreendimentoStats = useMemo(() => {
    return empreendimentos.map(emp => {
      const empSales = vendas.filter(venda => venda.empreendimento_id === emp.id);
      const totalRevenue = empSales.reduce((sum, venda) => sum + venda.valor_entrada, 0);
      const totalCommissions = empSales.reduce((sum, venda) => sum + venda.valor_comissao_total, 0);
      
      return {
        empreendimento: emp,
        salesCount: empSales.length,
        totalRevenue,
        totalCommissions
      };
    }).sort((a, b) => b.salesCount - a.salesCount);
  }, [vendas, empreendimentos]);

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
          title="Comissões Pagas"
          value={`R$ ${stats.totalCommissionsPaid.toLocaleString('pt-BR')}`}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Comissões Pendentes"
          value={`R$ ${stats.totalCommissionsPending.toLocaleString('pt-BR')}`}
          icon={<Clock className="w-6 h-6 text-white" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Total de Vendas"
          value={stats.totalSales.toString()}
          icon={<BarChart3 className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Receita do Mês"
          value={`R$ ${stats.monthlyRevenue.toLocaleString('pt-BR')}`}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Comissões Geradas"
          value={`R$ ${stats.totalCommissionsGenerated.toLocaleString('pt-BR')}`}
          icon={<CreditCard className="w-6 h-6 text-white" />}
          color="bg-indigo-500"
          subtitle="Total acumulado"
        />
        <StatCard
          title="Corretores Ativos"
          value={stats.activeBrokers.toString()}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-teal-500"
        />
        <StatCard
          title="Empreendimentos"
          value={empreendimentos.length.toString()}
          icon={<Building className="w-6 h-6 text-white" />}
          color="bg-orange-500"
        />
      </div>

      {stats.overdueCommissions > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">
              <span className="font-medium">{stats.overdueCommissions}</span> comissão(ões) em atraso
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance por Corretor */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Performance por Corretor
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {brokerStats.slice(0, 5).map(({ corretor, salesCount, commissionsPaid, commissionsPending }) => (
                <div key={corretor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{corretor.nome}</h4>
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
              {brokerStats.length === 0 && (
                <p className="text-center text-gray-500 py-4">Nenhum corretor com vendas</p>
              )}
            </div>
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
              {empreendimentoStats.slice(0, 5).map(({ empreendimento, salesCount, totalRevenue, totalCommissions }) => (
                <div key={empreendimento.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{empreendimento.nome}</h4>
                    <p className="text-sm text-gray-500">{salesCount} vendas</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">
                      Receita: R$ {totalRevenue.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm font-medium text-purple-600">
                      Comissões: R$ {totalCommissions.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
              {empreendimentoStats.length === 0 && (
                <p className="text-center text-gray-500 py-4">Nenhum empreendimento com vendas</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;