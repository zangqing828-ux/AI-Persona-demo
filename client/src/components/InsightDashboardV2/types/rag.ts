/**
 * RAG (Retrieval Augmented Generation) Type Definitions
 * Types for frontend RAG implementation
 */

/**
 * Vector document for semantic search
 */
export interface VectorDocument {
  id: string;
  text: string;
  embedding: number[];
  metadata: {
    type: 'survey' | 'interview' | 'metric' | 'insight';
    sourceId: string;
    timestamp: Date;
    sampleSize?: number;
    [key: string]: unknown;
  };
}

/**
 * RAG query with context
 */
export interface RAGQuery {
  query: string;
  selectedText?: string;
  context: string;
  filters?: {
    personaType?: string;
    segment?: string;
    dateRange?: [Date, Date];
    minSampleSize?: number;
  };
}

/**
 * RAG result with sources
 */
export interface RAGResult {
  answer: string;
  sources: Array<{
    type: string;
    id: string;
    text: string;
    relevanceScore: number;
    metadata?: Record<string, unknown>;
  }>;
  confidence: number;
  relatedQuestions?: string[];
  reasoning?: string;
}

/**
 * Text selection for AI interaction
 */
export interface TextSelection {
  text: string;
  startOffset: number;
  endOffset: number;
  elementId?: string;
  context?: string;
}
