import { User, Empreendimento, Sale, EntryInstallment, CommissionInstallment } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Sistema',
    email: 'admin@empresa.com',
    password: 'admin123',
    role: 'admin',
    phone: '(11) 99999-9999',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@empresa.com',
    password: 'joao123',
    role: 'broker',
    phone: '(11) 98888-8888',
    createdAt: '2024-01-02'
  },
  {
    id: '3',
    name: 'Maria Santos',
    email: 'maria@empresa.com',
    password: 'maria123',
    role: 'broker',
    phone: '(11) 97777-7777',
    createdAt: '2024-01-03'
  },
  {
    id: '4',
    name: 'Pedro Oliveira',
    email: 'pedro@empresa.com',
    password: 'pedro123',
    role: 'broker',
    phone: '(11) 96666-6666',
    createdAt: '2024-01-04'
  }
];

export const mockEmpreendimentos: Empreendimento[] = [
  {
    id: '1',
    name: 'Residencial Jardim das Flores',
    location: 'Zona Sul - São Paulo',
    fixedCommission: 1000,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Condomínio Vista Verde',
    location: 'Alphaville - Barueri',
    fixedCommission: 1500,
    createdAt: '2024-01-02'
  },
  {
    id: '3',
    name: 'Loteamento Bosque Real',
    location: 'Granja Viana - Cotia',
    fixedCommission: 800,
    createdAt: '2024-01-03'
  },
  {
    id: '4',
    name: 'Vila dos Ipês',
    location: 'Zona Oeste - São Paulo',
    fixedCommission: 1200,
    createdAt: '2024-01-04'
  }
];

// Função auxiliar para criar parcelas de entrada
const createEntryInstallments = (totalValue: number, installmentsCount: number, startDate: string): EntryInstallment[] => {
  const installmentValue = totalValue / installmentsCount;
  const installments: EntryInstallment[] = [];
  
  for (let i = 0; i < installmentsCount; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);
    
    installments.push({
      id: `entry-${Date.now()}-${i}`,
      installmentNumber: i + 1,
      value: installmentValue,
      dueDate: dueDate.toISOString().split('T')[0],
      isPaid: i === 0, // primeira parcela já paga
      paidDate: i === 0 ? dueDate.toISOString().split('T')[0] : undefined
    });
  }
  
  return installments;
};

// Função auxiliar para criar parcelas de comissão
const createCommissionInstallments = (totalCommission: number, installmentsCount: number, entryInstallments: EntryInstallment[]): CommissionInstallment[] => {
  const commissionPerInstallment = totalCommission / installmentsCount;
  const installments: CommissionInstallment[] = [];
  
  entryInstallments.forEach((entryInstallment, index) => {
    let dueDate: string | undefined;
    
    if (entryInstallment.isPaid && entryInstallment.paidDate) {
      const commissionDue = new Date(entryInstallment.paidDate);
      commissionDue.setDate(commissionDue.getDate() + 7);
      dueDate = commissionDue.toISOString().split('T')[0];
    }
    
    installments.push({
      id: `commission-${Date.now()}-${index}`,
      installmentNumber: index + 1,
      value: commissionPerInstallment,
      dueDate,
      isPaid: index === 0, // primeira comissão já paga
      paidDate: index === 0 && dueDate ? dueDate : undefined,
      entryInstallmentId: entryInstallment.id
    });
  });
  
  return installments;
};

export const mockSales: Sale[] = [
  {
    id: '1',
    clientName: 'Carlos Mendes',
    empreendimentoId: '1',
    brokerId: '2',
    totalEntryValue: 50000,
    installmentsCount: 2,
    entryInstallments: createEntryInstallments(50000, 2, '2024-01-15'),
    commissionInstallments: [],
    totalCommissionValue: 1000,
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    clientName: 'Ana Costa',
    empreendimentoId: '2',
    brokerId: '3',
    totalEntryValue: 75000,
    installmentsCount: 3,
    entryInstallments: createEntryInstallments(75000, 3, '2024-01-20'),
    commissionInstallments: [],
    totalCommissionValue: 1500,
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    clientName: 'Roberto Lima',
    empreendimentoId: '3',
    brokerId: '2',
    totalEntryValue: 60000,
    installmentsCount: 1,
    entryInstallments: createEntryInstallments(60000, 1, '2024-01-25'),
    commissionInstallments: [],
    totalCommissionValue: 800,
    createdAt: '2024-01-20'
  }
];

// Criar comissões para as vendas mockadas
mockSales.forEach(sale => {
  sale.commissionInstallments = createCommissionInstallments(
    sale.totalCommissionValue,
    sale.installmentsCount,
    sale.entryInstallments
  );
});