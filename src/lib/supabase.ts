import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  console.error('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
  console.error('The app will continue with mock data, but database features will not work.');
}

export const supabase = createClient(
  supabaseUrl || 'http://localhost:54321', 
  supabaseAnonKey || 'dummy-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          nome: string;
          email: string;
          telefone: string | null;
          role: 'admin' | 'corretor';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nome: string;
          email: string;
          telefone?: string | null;
          role?: 'admin' | 'corretor';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nome?: string;
          email?: string;
          telefone?: string | null;
          role?: 'admin' | 'corretor';
          created_at?: string;
          updated_at?: string;
        };
      };
      corretores: {
        Row: {
          id: string;
          user_id: string | null;
          nome: string;
          email: string;
          telefone: string | null;
          data_contratacao: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          nome: string;
          email: string;
          telefone?: string | null;
          data_contratacao?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          nome?: string;
          email?: string;
          telefone?: string | null;
          data_contratacao?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      empreendimentos: {
        Row: {
          id: string;
          nome: string;
          localizacao: string;
          percentual_comissao: number;
          valor_minimo: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          localizacao: string;
          percentual_comissao: number;
          valor_minimo: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          localizacao?: string;
          percentual_comissao?: number;
          valor_minimo?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      vendas: {
        Row: {
          id: string;
          corretor_id: string;
          empreendimento_id: string;
          cliente_nome: string;
          valor_entrada: number;
          quantidade_parcelas: number;
          data_venda: string;
          lote: string;
          quadra: string;
          valor_comissao_total: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          corretor_id: string;
          empreendimento_id: string;
          cliente_nome: string;
          valor_entrada: number;
          quantidade_parcelas: number;
          data_venda: string;
          lote: string;
          quadra: string;
          valor_comissao_total: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          corretor_id?: string;
          empreendimento_id?: string;
          cliente_nome?: string;
          valor_entrada?: number;
          quantidade_parcelas?: number;
          data_venda?: string;
          lote?: string;
          quadra?: string;
          valor_comissao_total?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      parcelas: {
        Row: {
          id: string;
          venda_id: string;
          numero_parcela: number;
          valor: number;
          data_vencimento: string;
          paga: boolean;
          data_pagamento: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          venda_id: string;
          numero_parcela: number;
          valor: number;
          data_vencimento: string;
          paga?: boolean;
          data_pagamento?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          venda_id?: string;
          numero_parcela?: number;
          valor?: number;
          data_vencimento?: string;
          paga?: boolean;
          data_pagamento?: string | null;
          created_at?: string;
        };
      };
      comissoes: {
        Row: {
          id: string;
          venda_id: string;
          parcela_id: string;
          corretor_id: string;
          valor: number;
          data_prevista: string;
          paga: boolean;
          data_pagamento: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          venda_id: string;
          parcela_id: string;
          corretor_id: string;
          valor: number;
          data_prevista: string;
          paga?: boolean;
          data_pagamento?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          venda_id?: string;
          parcela_id?: string;
          corretor_id?: string;
          valor?: number;
          data_prevista?: string;
          paga?: boolean;
          data_pagamento?: string | null;
          created_at?: string;
        };
      };
    };
  };
}