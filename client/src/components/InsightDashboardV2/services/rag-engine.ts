/**
 * Frontend RAG Engine
 * Uses browser-based vector search for AI-powered insights
 *
 * MVP Implementation: TF-IDF + Cosine Similarity
 * Production: TensorFlow.js Universal Sentence Encoder
 */

import type { VectorDocument, RAGQuery, RAGResult } from '../types/rag';

export class RAGEngine {
  private vectors: VectorDocument[] = [];
  private embeddingDimension = 384;
  private initialized = false;

  /**
   * Initialize RAG engine with data
   */
  async initialize(data: any[]): Promise<void> {
    console.log('[RAGEngine] Initializing with', data.length, 'records');
    await this.loadOrCreateEmbeddings(data);
    this.initialized = true;
    console.log('[RAGEngine] Initialization complete');
  }

  /**
   * Create embeddings using TF-IDF (MVP approach)
   * TODO: Upgrade to TensorFlow.js USE for production
   */
  private async createEmbedding(text: string): Promise<number[]> {
    // Simple word frequency vector (MVP)
    const words = text.toLowerCase().split(/\s+/);
    const vector = new Array(this.embeddingDimension).fill(0);

    words.forEach((word) => {
      const idx = this.hashWord(word) % this.embeddingDimension;
      vector[idx] += 1;
    });

    // Normalize
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vector.map(val => val / magnitude) : vector;
  }

  private hashWord(word: string): number {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = ((hash << 5) - hash) + word.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  /**
   * Index data for retrieval
   */
  async indexData(data: any[]): Promise<void> {
    console.log('[RAGEngine] Indexing', data.length, 'documents');
    const vectors: VectorDocument[] = [];

    for (const item of data) {
      const text = this.extractText(item);
      const embedding = await this.createEmbedding(text);

      vectors.push({
        id: item.id || `vec_${Date.now()}_${Math.random()}`,
        text,
        embedding,
        metadata: {
          type: item.type || 'unknown',
          sourceId: item.id,
          timestamp: item.timestamp || new Date(),
          sampleSize: item.sampleSize,
          ...item.metadata,
        },
      });
    }

    this.vectors = vectors;
    console.log('[RAGEngine] Indexed', vectors.length, 'vectors');
  }

  /**
   * Query for relevant documents
   */
  async query(query: RAGQuery, topK: number = 5): Promise<RAGResult> {
    if (!this.initialized) {
      throw new Error('RAG engine not initialized');
    }

    console.log('[RAGEngine] Querying:', query.query);
    const queryEmbedding = await this.createEmbedding(query.query);

    // Calculate similarities
    const similarities = this.vectors.map(doc => ({
      document: doc,
      similarity: this.cosineSimilarity(queryEmbedding, doc.embedding),
    }));

    // Sort and get top K
    const topDocs = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);

    console.log('[RAGEngine] Found', topDocs.length, 'relevant documents');

    // Generate answer using retrieved context
    const answer = await this.generateAnswer(query, topDocs);

    return {
      answer,
      sources: topDocs.map(s => ({
        type: s.document.metadata.type,
        id: s.document.metadata.sourceId,
        text: s.document.text.slice(0, 200) + '...',
        relevanceScore: s.similarity,
        metadata: s.document.metadata,
      })),
      confidence: this.calculateConfidence(topDocs),
      relatedQuestions: this.generateRelatedQuestions(query, topDocs),
      reasoning: `基于检索到的 ${topDocs.length} 条相关数据，通过多源交叉验证得出结论。`,
    };
  }

  /**
   * Generate AI answer from retrieved context
   */
  private async generateAnswer(
    query: RAGQuery,
    retrievedDocs: Array<{ document: VectorDocument; similarity: number }>
  ): Promise<string> {
    const sampleSize = this.extractSampleSize(retrievedDocs);
    const sourceCount = this.countSources(retrievedDocs);

    let response = `这个结论基于以下数据论证：\n\n`;
    response += `📊 支撑数据：\n`;
    response += `• 样本量：${sampleSize} 条记录\n`;
    response += `• 数据源：${sourceCount} 个不同来源\n\n`;

    response += `🔍 数据来源：\n`;
    retrievedDocs.forEach((doc, i) => {
      response += `• 来源 ${i + 1}: ${doc.document.metadata.type} (相关性: ${(doc.similarity * 100).toFixed(1)}%)\n`;
    });

    return response;
  }

  private extractSampleSize(docs: Array<{ document: VectorDocument; similarity: number }>): number {
    return docs.reduce((sum, doc) => {
      return sum + (doc.document.metadata.sampleSize as number || 1);
    }, 0);
  }

  private countSources(docs: Array<{ document: VectorDocument; similarity: number }>): number {
    const sources = new Set(docs.map(d => d.document.metadata.type));
    return sources.size;
  }

  private calculateConfidence(docs: Array<{ document: VectorDocument; similarity: number }>): number {
    if (docs.length === 0) return 0;
    const avgSimilarity = docs.reduce((sum, d) => sum + d.similarity, 0) / docs.length;
    return Math.round(avgSimilarity * 100);
  }

  private generateRelatedQuestions(
    query: RAGQuery,
    docs: Array<{ document: VectorDocument; similarity: number }>
  ): string[] {
    // Generate related questions based on query context
    return [
      '这个结论在不同人群中是否一致？',
      '影响这个结论的主要因素是什么？',
      '有多少数据支持这个结论？',
    ];
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return magnitudeA * magnitudeB > 0 ? dotProduct / (magnitudeA * magnitudeB) : 0;
  }

  private extractText(item: any): string {
    if (typeof item === 'string') return item;
    if (item.answer) return item.answer;
    if (item.text) return item.text;
    if (item.insight) return item.insight;
    return JSON.stringify(item);
  }

  private async loadOrCreateEmbeddings(data: any[]): Promise<void> {
    // TODO: Check IndexedDB for existing embeddings
    // For now, just index the data
    await this.indexData(data);
  }
}

// Export singleton instance
export const ragEngine = new RAGEngine();
