import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Project, Media, Budget } from '../types/bkaap';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();

      if (error) throw error;
      await fetchProjects();
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchProjects();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchProjects();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
  };
}

export function useMedia(projectId?: string) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      let query = supabase.from('media').select('*').order('ordem', { ascending: true });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMedia(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [projectId]);

  const addMedia = async (mediaItem: Omit<Media, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('media')
        .insert([mediaItem])
        .select()
        .single();

      if (error) throw error;
      await fetchMedia();
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteMedia = async (id: string) => {
    try {
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchMedia();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const uploadFile = async (file: File, projectId: string, tipo: 'foto' | 'video') => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${projectId}/${Date.now()}.${fileExt}`;
      const filePath = `${tipo}s/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('bkaap-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('bkaap-media')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    media,
    loading,
    error,
    fetchMedia,
    addMedia,
    deleteMedia,
    uploadFile,
  };
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBudgets(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const addBudget = async (budget: Omit<Budget, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert([budget])
        .select()
        .single();

      if (error) throw error;
      await fetchBudgets();
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchBudgets();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    budgets,
    loading,
    error,
    fetchBudgets,
    addBudget,
    deleteBudget,
  };
}
