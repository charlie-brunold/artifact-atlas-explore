
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Collection {
  id: string;
  user_id: string;
  artifact_id: number;
  artifact_title: string;
  artifact_accession_number: string | null;
  collection_name: string;
  notes: string | null;
  created_at: string;
}

export const useCollections = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCollections();
    } else {
      setCollections([]);
      setLoading(false);
    }
  }, [user]);

  const fetchCollections = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_collections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching collections:', error);
      } else {
        setCollections(data || []);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCollection = async (artifact: any, collectionName = 'My Bookmarks', notes = '') => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('user_collections')
        .insert({
          user_id: user.id,
          artifact_id: artifact.id,
          artifact_title: artifact.title,
          artifact_accession_number: artifact.accessionNumber,
          collection_name: collectionName,
          notes
        });

      if (error) {
        return { error: error.message };
      }

      await fetchCollections();
      return { error: null };
    } catch (error) {
      return { error: 'Failed to add to collection' };
    }
  };

  const removeFromCollection = async (artifactId: number) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('user_collections')
        .delete()
        .eq('user_id', user.id)
        .eq('artifact_id', artifactId);

      if (error) {
        return { error: error.message };
      }

      await fetchCollections();
      return { error: null };
    } catch (error) {
      return { error: 'Failed to remove from collection' };
    }
  };

  const isInCollection = (artifactId: number) => {
    return collections.some(item => item.artifact_id === artifactId);
  };

  return {
    collections,
    loading,
    addToCollection,
    removeFromCollection,
    isInCollection,
    refreshCollections: fetchCollections
  };
};
