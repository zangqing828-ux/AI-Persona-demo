/**
 * useRAGInsights Hook
 * Provides RAG-powered insights functionality
 */

import { useState, useEffect } from 'react';
import { ragEngine } from '../services/rag-engine';
import type { RAGQuery, RAGResult } from '../types/rag';

export function useRAGInsights(data: any[]) {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    initialize();
  }, [data]);

  async function initialize() {
    try {
      setLoading(true);
      setError(null);
      await ragEngine.initialize(data);
      setInitialized(true);
    } catch (err) {
      setError(err as Error);
      console.error('[useRAGInsights] Initialization failed:', err);
    } finally {
      setLoading(false);
    }
  }

  async function queryInsights(query: RAGQuery): Promise<RAGResult | null> {
    if (!initialized) {
      throw new Error('RAG engine not initialized');
    }

    try {
      setLoading(true);
      const result = await ragEngine.query(query);
      return result;
    } catch (err) {
      setError(err as Error);
      console.error('[useRAGInsights] Query failed:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    initialized,
    loading,
    error,
    queryInsights,
  };
}
