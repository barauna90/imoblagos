import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Sale, Empreendimento, FilterOptions, EntryInstallment, CommissionInstallment } from '../types';
import { mockUsers, mockSales, mockEmpreendimentos } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  sales: Sale[];
  empreendimentos: Empreendimento[];
  filters: FilterOptions;
  setCurrentUser: (user: User | null) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addEmpreendimento: (empreendimento: Omit<Empreendimento, 'id' | 'createdAt'>) => void;
  updateEmpreendimento: (id: string, updates: Partial<Empreendimento>) => void;
  deleteEmpreendimento: (id: string) => void;
  addSale: (sale: Omit<Sale, 'id' | 'createdAt' | 'entryInstallments' | 'commissionInstallments'>) => void;
  updateSale: (id: string, updates: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
  markEntryInstallmentPaid: (saleId: string, installmentId: string) => void;
  markCommissionInstallmentPaid: (saleId: string, installmentId: string) => void;
  setFilters: (filters: FilterOptions) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [empreendimentos, setEmpreendimentos] = useState<Empreendimento[]>(mockEmpreendimentos);
  const [filters, setFilters] = useState<FilterOptions>({});

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const addEmpreendimento = (empData: Omit<Empreendimento, 'id' | 'createdAt'>) => {
    const newEmpreendimento: Empreendimento = {
      ...empData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setEmpreendimentos(prev => [...prev, newEmpreendimento]);
  };

  const updateEmpreendimento = (id: string, updates: Partial<Empreendimento>) => {
    setEmpreendimentos(prev => prev.map(emp => 
      emp.id === id ? { ...emp, ...updates } : emp
    ));
  };

  const deleteEmpreendimento = (id: string) => {
    setEmpreendimentos(prev => prev.filter(emp => emp.id !== id));
  };

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
        isPaid: false,
        paidDate: undefined
      });
    }
    
    return installments;
  };

  const createCommissionInstallments = (totalCommission: number, installmentsCount: number, entryInstallments: EntryInstallment[]): CommissionInstallment[] => {
    const commissionPerInstallment = totalCommission / installmentsCount;
    const installments: CommissionInstallment[] = [];
    
    entryInstallments.forEach((entryInstallment, index) => {
      installments.push({
        id: `commission-${Date.now()}-${index}`,
        installmentNumber: index + 1,
        value: commissionPerInstallment,
        dueDate: undefined,
        isPaid: false,
        paidDate: undefined,
        entryInstallmentId: entryInstallment.id
      });
    });
    
    return installments;
  };

  const addSale = (saleData: Omit<Sale, 'id' | 'createdAt' | 'entryInstallments' | 'commissionInstallments'>) => {
    const entryInstallments = createEntryInstallments(
      saleData.totalEntryValue,
      saleData.installmentsCount,
      new Date().toISOString().split('T')[0]
    );

    const commissionInstallments = createCommissionInstallments(
      saleData.totalCommissionValue,
      saleData.installmentsCount,
      entryInstallments
    );

    const newSale: Sale = {
      ...saleData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      entryInstallments,
      commissionInstallments
    };
    
    setSales(prev => [...prev, newSale]);
  };

  const updateSale = (id: string, updates: Partial<Sale>) => {
    setSales(prev => prev.map(sale => 
      sale.id === id ? { ...sale, ...updates } : sale
    ));
  };

  const deleteSale = (id: string) => {
    setSales(prev => prev.filter(sale => sale.id !== id));
  };

  const markEntryInstallmentPaid = (saleId: string, installmentId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const commissionDueDate = new Date();
    commissionDueDate.setDate(commissionDueDate.getDate() + 7);
    
    setSales(prev => prev.map(sale => {
      if (sale.id !== saleId) return sale;
      
      const updatedEntryInstallments = sale.entryInstallments.map(installment =>
        installment.id === installmentId
          ? { ...installment, isPaid: true, paidDate: today }
          : installment
      );

      const updatedCommissionInstallments = sale.commissionInstallments.map(commission => {
        if (commission.entryInstallmentId === installmentId) {
          return {
            ...commission,
            dueDate: commissionDueDate.toISOString().split('T')[0]
          };
        }
        return commission;
      });

      return {
        ...sale,
        entryInstallments: updatedEntryInstallments,
        commissionInstallments: updatedCommissionInstallments
      };
    }));
  };

  const markCommissionInstallmentPaid = (saleId: string, installmentId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setSales(prev => prev.map(sale => {
      if (sale.id !== saleId) return sale;
      
      const updatedCommissionInstallments = sale.commissionInstallments.map(installment =>
        installment.id === installmentId
          ? { ...installment, isPaid: true, paidDate: today }
          : installment
      );

      return {
        ...sale,
        commissionInstallments: updatedCommissionInstallments
      };
    }));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      sales,
      empreendimentos,
      filters,
      setCurrentUser,
      addUser,
      updateUser,
      deleteUser,
      addEmpreendimento,
      updateEmpreendimento,
      deleteEmpreendimento,
      addSale,
      updateSale,
      deleteSale,
      markEntryInstallmentPaid,
      markCommissionInstallmentPaid,
      setFilters
    }}>
      {children}
    </AppContext.Provider>
  );
};