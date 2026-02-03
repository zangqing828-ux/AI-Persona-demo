/**
 * Semantic Highlighter Component
 * Highlights keywords and semantic patterns in text
 */

import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';

export interface SemanticHighlighterProps {
  text: string;
  keywords?: string[];
  maxLength?: number;
}

export function SemanticHighlighter({
  text,
  keywords = [],
  maxLength = 500,
}: SemanticHighlighterProps) {
  // Generate highlighted text
  const { highlightedText, shouldTruncate } = useMemo(() => {
    if (!text) return { highlightedText: '', shouldTruncate: false };

    // Truncate if too long
    let processedText = text;
    let truncated = false;

    if (text.length > maxLength) {
      processedText = text.substring(0, maxLength) + '...';
      truncated = true;
    }

    // If no keywords, return plain text
    if (keywords.length === 0) {
      return { highlightedText: processedText, shouldTruncate: truncated };
    }

    // Escape special regex characters in keywords
    const escapeRegex = (str: string) => {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    // Create regex pattern for all keywords
    const pattern = keywords.map(escapeRegex).join('|');
    const regex = new RegExp(`(${pattern})`, 'gi');

    // Split and highlight
    const parts = processedText.split(regex);

    const highlighted = parts.map((part, index) => {
      if (!part) return null;

      // Check if this part matches any keyword (case-insensitive)
      const isKeyword = keywords.some(
        keyword => keyword.toLowerCase() === part.toLowerCase()
      );

      if (isKeyword) {
        return (
          <Badge
            key={index}
            variant="secondary"
            className="mx-0.5 px-1.5 py-0.5 bg-yellow-100 text-yellow-800 border-yellow-300"
          >
            {part}
          </Badge>
        );
      }

      return <span key={index}>{part}</span>;
    });

    return { highlightedText: highlighted, shouldTruncate: truncated };
  }, [text, keywords, maxLength]);

  if (!text) {
    return <p className="text-muted-foreground italic">无内容</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-base leading-relaxed">{highlightedText}</p>
      {shouldTruncate && (
        <p className="text-xs text-muted-foreground">
          内容已截断（完整长度: {text.length} 字符）
        </p>
      )}
    </div>
  );
}

/**
 * Advanced semantic highlighter with sentiment analysis
 */
export interface SentimentHighlighterProps {
  text: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  sentimentWords?: {
    positive: string[];
    negative: string[];
  };
}

export function SentimentHighlighter({
  text,
  sentiment,
  sentimentWords = {
    positive: ['好', '优秀', '喜欢', '满意', '推荐', '值得', '优秀', '出色'],
    negative: ['差', '不好', '失望', '不满意', '不推荐', '不值得', '糟糕', '问题'],
  },
}: SentimentHighlighterProps) {
  const { highlightedText } = useMemo(() => {
    if (!text) return { highlightedText: '' };

    // Determine which sentiment words to highlight
    const words = sentiment === 'positive' ? sentimentWords.positive : sentimentWords.negative;

    if (!words || words.length === 0) {
      return { highlightedText: text };
    }

    // Create regex pattern
    const pattern = words.map(w => `(${w})`).join('|');
    const regex = new RegExp(pattern, 'gi');

    const parts = text.split(regex);

    const highlighted = parts.map((part, index) => {
      if (!part) return null;

      const isMatch = words.some(word => word.toLowerCase() === part.toLowerCase());

      if (isMatch) {
        const colorClass =
          sentiment === 'positive'
            ? 'bg-green-100 text-green-800 border-green-300'
            : 'bg-red-100 text-red-800 border-red-300';

        return (
          <Badge
            key={index}
            variant="secondary"
            className={`mx-0.5 px-1.5 py-0.5 ${colorClass}`}
          >
            {part}
          </Badge>
        );
      }

      return <span key={index}>{part}</span>;
    });

    return { highlightedText: highlighted };
  }, [text, sentiment, sentimentWords]);

  if (!text) {
    return <p className="text-muted-foreground italic">无内容</p>;
  }

  return <p className="text-base leading-relaxed">{highlightedText}</p>;
}
