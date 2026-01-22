-- BKAAP Construction Company Database Schema

-- Projects table (Portfolio)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_obra TEXT NOT NULL,
  localizacao TEXT NOT NULL,
  metragem DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('em_andamento', 'concluido', 'planejamento')),
  descricao TEXT,
  data_inicio DATE,
  data_conclusao DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media table (Photos and Videos)
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('foto', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  titulo TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budgets table (Orçamentos)
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_nome TEXT NOT NULL,
  cliente_email TEXT,
  cliente_telefone TEXT,
  custo_m2_com_material DECIMAL(10, 2) NOT NULL,
  custo_m2_sem_material DECIMAL(10, 2) NOT NULL,
  metragem_total DECIMAL(10, 2) NOT NULL,
  valor_entrada DECIMAL(12, 2) NOT NULL,
  valor_total_vista DECIMAL(12, 2) NOT NULL,
  valor_total_parcelado DECIMAL(12, 2) NOT NULL,
  numero_parcelas INTEGER NOT NULL,
  valor_parcela DECIMAL(12, 2) NOT NULL,
  data_primeira_parcela DATE NOT NULL,
  correcao_tipo TEXT NOT NULL CHECK (correcao_tipo IN ('INCC', 'IPCA', 'Taxa Fixa')),
  correcao_percentual DECIMAL(5, 2),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Admin users (extending Supabase auth)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_project_id ON media(project_id);
CREATE INDEX IF NOT EXISTS idx_budgets_created_by ON budgets(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Row Level Security (RLS) Policies

-- Projects: Public read, admin write
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by everyone" 
  ON projects FOR SELECT 
  USING (true);

CREATE POLICY "Projects are insertable by admins" 
  ON projects FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Projects are updatable by admins" 
  ON projects FOR UPDATE 
  USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Projects are deletable by admins" 
  ON projects FOR DELETE 
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Media: Public read, admin write
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Media are viewable by everyone" 
  ON media FOR SELECT 
  USING (true);

CREATE POLICY "Media are insertable by admins" 
  ON media FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Media are updatable by admins" 
  ON media FOR UPDATE 
  USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Media are deletable by admins" 
  ON media FOR DELETE 
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Budgets: Admin only
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Budgets are viewable by admins" 
  ON budgets FOR SELECT 
  USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Budgets are insertable by admins" 
  ON budgets FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Budgets are updatable by admins" 
  ON budgets FOR UPDATE 
  USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Budgets are deletable by admins" 
  ON budgets FOR DELETE 
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Admin users: Admin only
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users are viewable by admins" 
  ON admin_users FOR SELECT 
  USING (auth.uid() IN (SELECT id FROM admin_users));
