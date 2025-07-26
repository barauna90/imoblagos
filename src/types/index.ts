export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'broker';
  phone?: string;
  createdAt: string;
}

export interface Empreendimento {
  id: string;
  name: string;
  location: string;
  fixedCommission: number; // valor fixo da comissão total
  createdAt: string;
}

export interface EntryInstallment {
  id: string;
  installmentNumber: number;
  value: number;
  dueDate: string;
  isPaid: boolean;
  paidDate?: string;
}

export interface CommissionInstallment {
  id: string;
  installmentNumber: number;
  value: number;
  dueDate?: string; // 7 dias após pagamento da entrada correspondente
  isPaid: boolean;
  paidDate?: string;
  entryInstallmentId: string; // vincula à parcela da entrada
}

export interface Sale {
  id: string;
  clientName: string;
  empreendimentoId: string;
  brokerId: string;
  totalEntryValue: number;
  installmentsCount: number;
  entryInstallments: EntryInstallment[];
  commissionInstallments: CommissionInstallment[];
  totalCommissionValue: number;
  createdAt: string;
}

export interface DashboardStats {
  totalCommissionsPaid: number;
  totalCommissionsPending: number;
  totalCommissionsGenerated: number;
  totalSales: number;
  monthlyRevenue: number;
}

export interface FilterOptions {
  month?: string;
  brokerId?: string;
  empreendimentoId?: string;
  status?: 'all' | 'paid' | 'pending' | 'overdue';
}

export interface BrokerPerformance {
  brokerId: string;
  brokerName: string;
  totalSales: number;
  totalCommissionsPaid: number;
  totalCommissionsPending: number;
  monthlyData: {
    month: string;
    sales: number;
    commissions: number;
  }[];
}