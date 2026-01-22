export interface Project {
  id: string;
  nome_obra: string;
  localizacao: string;
  metragem: number;
  status: 'em_andamento' | 'concluido' | 'planejamento';
  descricao: string;
  data_inicio?: string;
  data_conclusao?: string;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  project_id: string;
  tipo: 'foto' | 'video';
  url: string;
  thumbnail_url?: string;
  titulo?: string;
  ordem: number;
  created_at: string;
}

export interface Budget {
  id: string;
  cliente_nome: string;
  cliente_email?: string;
  cliente_telefone?: string;
  custo_m2_com_material: number;
  custo_m2_sem_material: number;
  metragem_total: number;
  valor_entrada: number;
  valor_total_vista: number;
  valor_total_parcelado: number;
  numero_parcelas: number;
  valor_parcela: number;
  data_primeira_parcela: string;
  correcao_tipo: 'INCC' | 'IPCA' | 'Taxa Fixa';
  correcao_percentual?: number;
  observacoes?: string;
  created_at: string;
  created_by: string;
}

export interface BudgetInstallment {
  numero: number;
  data_vencimento: string;
  valor_original: number;
  valor_corrigido: number;
  correcao_aplicada: number;
}

export interface AdminUser {
  id: string;
  email: string;
  nome: string;
  role: 'admin';
  created_at: string;
}
