/*
  # Criar usuário administrador

  1. Novo usuário
    - Email: admin@empresa.com
    - Senha: admin123
    - Role: admin

  2. Segurança
    - Usuário será criado na tabela auth.users
    - Profile será criado automaticamente via trigger
    - Role será definido como 'admin'

  3. Observações
    - Este script deve ser executado apenas uma vez
    - O usuário poderá fazer login imediatamente após a criação
*/

-- Inserir usuário na tabela auth.users do Supabase
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@empresa.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"nome": "Administrador do Sistema", "role": "admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- O profile será criado automaticamente pelo trigger handle_new_user
-- Mas vamos garantir que existe um profile com role admin
DO $$
DECLARE
  user_uuid uuid;
BEGIN
  -- Buscar o ID do usuário recém-criado
  SELECT id INTO user_uuid 
  FROM auth.users 
  WHERE email = 'admin@empresa.com' 
  LIMIT 1;

  -- Inserir ou atualizar o profile
  INSERT INTO public.profiles (
    user_id,
    nome,
    email,
    role,
    created_at,
    updated_at
  ) VALUES (
    user_uuid,
    'Administrador do Sistema',
    'admin@empresa.com',
    'admin',
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    nome = 'Administrador do Sistema',
    email = 'admin@empresa.com',
    role = 'admin',
    updated_at = NOW();

  -- Inserir na tabela user_roles para garantir permissões
  INSERT INTO public.user_roles (
    user_id,
    role,
    created_at
  ) VALUES (
    user_uuid,
    'admin',
    NOW()
  )
  ON CONFLICT (user_id, role) DO NOTHING;

END $$;