import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SearchHistoryItem {
  id: string;
  user_id: string;
  search_query: string;
  search_filters: any;
  results_count: number;
  created_at: string;
}

interface SavedSearch {
  id: string;
  user_id: string;
  search_name: string;
  search_query: string;
  search_filters: any;
  created_at: string;
  updated_at: string;
}

export const useSearchHistory = () => {
  const { user } = useAuth();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSearchHistory();
      fetchSavedSearches();
    } else {
      setSearchHistory([]);
      setSavedSearches([]);
      setLoading(false);
    }
  }, [user]);

  const fetchSearchHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching search history:', error);
      } else {
        setSearchHistory(data || []);
      }
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  const fetchSavedSearches = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved searches:', error);
      } else {
        setSavedSearches(data || []);
      }
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSearchToHistory = async (query: string, filters: any = {}, resultsCount: number = 0) => {
    if (!user || !query.trim()) return;

    try {
      const { error } = await supabase
        .from('user_search_history')
        .insert({
          user_id: user.id,
          search_query: query,
          search_filters: filters,
          results_count: resultsCount
        });

      if (error) {
        console.error('Error adding search to history:', error);
      } else {
        await fetchSearchHistory();
      }
    } catch (error) {
      console.error('Error adding search to history:', error);
    }
  };

  const saveSearch = async (name: string, query: string, filters: any = {}) => {
    if (!user || !name.trim() || !query.trim()) return { error: 'Missing required fields' };

    try {
      const { error } = await supabase
        .from('user_saved_searches')
        .insert({
          user_id: user.id,
          search_name: name,
          search_query: query,
          search_filters: filters
        });

      if (error) {
        return { error: error.message };
      }

      await fetchSavedSearches();
      return { error: null };
    } catch (error) {
      return { error: 'Failed to save search' };
    }
  };

  const deleteSavedSearch = async (searchId: string) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('user_saved_searches')
        .delete()
        .eq('user_id', user.id)
        .eq('id', searchId);

      if (error) {
        return { error: error.message };
      }

      await fetchSavedSearches();
      return { error: null };
    } catch (error) {
      return { error: 'Failed to delete search' };
    }
  };

  const clearSearchHistory = async () => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('user_search_history')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        return { error: error.message };
      }

      await fetchSearchHistory();
      return { error: null };
    } catch (error) {
      return { error: 'Failed to clear search history' };
    }
  };

  return {
    searchHistory,
    savedSearches,
    loading,
    addSearchToHistory,
    saveSearch,
    deleteSavedSearch,
    clearSearchHistory,
    refreshHistory: () => {
      fetchSearchHistory();
      fetchSavedSearches();
    }
  };
};