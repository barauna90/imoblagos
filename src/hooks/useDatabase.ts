import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];

export function useCorretores() {
  const [corretores, setCorretores] = useState<Tables['corretores']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCorretores = async () => {
    try {
      const { data, error } = await supabase
        .from('corretores')
        .select('*')
        .order('nome');

      if (error) throw error;
      setCorretores(data || []);
    } catch (error) {
      console.error('Error fetching corretores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCorretores();
  }, []);

  const createCorretor = async (corretor: Tables['corretores']['Insert']) => {
    const { data, error } = await supabase
      .from('corretores')
      .insert(corretor)
      .select()
      .single();

    if (!error && data) {
      setCorretores(prev => [...prev, data]);
    }
    return { data, error };
  };

  const updateCorretor = async (id: string, updates: Tables['corretores']['Update']) => {
    const { data, error } = await supabase
      .from('corretores')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setCorretores(prev => prev.map(c => c.id === id ? data : c));
    }
    return { data, error };
  };

  const deleteCorretor = async (id: string) => {
    const { error } = await supabase
      .from('corretores')
      .delete()
      .eq('id', id);

    if (!error) {
      setCorretores(prev => prev.filter(c => c.id !== id));
    }
    return { error };
  };

  return {
    corretores,
    loading,
    createCorretor,
    updateCorretor,
    deleteCorretor,
    refetch: fetchCorretores,
  };
}

export function useEmpreendimentos() {
  const [empreendimentos, setEmpreendimentos] = useState<Tables['empreendimentos']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmpreendimentos = async () => {
    try {
      const { data, error } = await supabase
        .from('empreendimentos')
        .select('*')
        .order('nome');

      if (error) throw error;
      setEmpreendimentos(data || []);
    } catch (error) {
      console.error('Error fetching empreendimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpreendimentos();
  }, []);

  const createEmpreendimento = async (empreendimento: Tables['empreendimentos']['Insert']) => {
    const { data, error } = await supabase
      .from('empreendimentos')
      .insert(empreendimento)
      .select()
      .single();

    if (!error && data) {
      setEmpreendimentos(prev => [...prev, data]);
    }
    return { data, error };
  };

  const updateEmpreendimento = async (id: string, updates: Tables['empreendimentos']['Update']) => {
    const { data, error } = await supabase
      .from('empreendimentos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setEmpreendimentos(prev => prev.map(e => e.id === id ? data : e));
    }
    return { data, error };
  };

  const deleteEmpreendimento = async (id: string) => {
    const { error } = await supabase
      .from('empreendimentos')
      .delete()
      .eq('id', id);

    if (!error) {
      setEmpreendimentos(prev => prev.filter(e => e.id !== id));
    }
    return { error };
  };

  return {
    empreendimentos,
    loading,
    createEmpreendimento,
    updateEmpreendimento,
    deleteEmpreendimento,
    refetch: fetchEmpreendimentos,
  };
}

export function useVendas() {
  const [vendas, setVendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVendas = async () => {
    try {
      const { data, error } = await supabase
        .from('vendas')
        .select(`
          *,
          corretor:corretores(nome),
          empreendimento:empreendimentos(nome),
          parcelas(*),
          comissoes(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVendas(data || []);
    } catch (error) {
      console.error('Error fetching vendas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendas();
  }, []);

  const createVenda = async (venda: Tables['vendas']['Insert']) => {
    const { data: vendaData, error: vendaError } = await supabase
      .from('vendas')
      .insert(venda)
      .select()
      .single();

    if (vendaError || !vendaData) {
      return { data: null, error: vendaError };
    }

    // Criar parcelas da entrada
    const parcelas = [];
    const valorParcela = venda.valor_entrada / venda.quantidade_parcelas;
    
    for (let i = 0; i < venda.quantidade_parcelas; i++) {
      const dataVencimento = new Date(venda.data_venda);
      dataVencimento.setMonth(dataVencimento.getMonth() + i);
      
      parcelas.push({
        venda_id: vendaData.id,
        numero_parcela: i + 1,
        valor: valorParcela,
        data_vencimento: dataVencimento.toISOString().split('T')[0],
      });
    }

    const { error: parcelasError } = await supabase
      .from('parcelas')
      .insert(parcelas);

    if (parcelasError) {
      return { data: null, error: parcelasError };
    }

    // Criar comissões (inicialmente sem data prevista)
    const comissoes = [];
    const valorComissaoParcela = venda.valor_comissao_total / venda.quantidade_parcelas;
    
    for (let i = 0; i < venda.quantidade_parcelas; i++) {
      comissoes.push({
        venda_id: vendaData.id,
        parcela_id: '', // Será preenchido depois
        corretor_id: venda.corretor_id,
        valor: valorComissaoParcela,
        data_prevista: new Date().toISOString().split('T')[0], // Placeholder
      });
    }

    await fetchVendas(); // Recarregar dados
    return { data: vendaData, error: null };
  };

  const markParcelaPaga = async (parcelaId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('parcelas')
      .update({ 
        paga: true, 
        data_pagamento: today 
      })
      .eq('id', parcelaId);

    if (!error) {
      // Atualizar data prevista da comissão correspondente
      const dataPrevista = new Date();
      dataPrevista.setDate(dataPrevista.getDate() + 7);
      
      await supabase
        .from('comissoes')
        .update({ 
          data_prevista: dataPrevista.toISOString().split('T')[0] 
        })
        .eq('parcela_id', parcelaId);

      await fetchVendas();
    }
    
    return { error };
  };

  const markComissaoPaga = async (comissaoId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('comissoes')
      .update({ 
        paga: true, 
        data_pagamento: today 
      })
      .eq('id', comissaoId);

    if (!error) {
      await fetchVendas();
    }
    
    return { error };
  };

  return {
    vendas,
    loading,
    createVenda,
    markParcelaPaga,
    markComissaoPaga,
    refetch: fetchVendas,
  };
}