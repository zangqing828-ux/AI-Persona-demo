/**
 * useSelection Hook
 * Tracks user text selections for AI interaction
 */

import { useState, useCallback } from 'react';
import type { TextSelection } from '../types/rag';

export function useSelection() {
  const [selection, setSelection] = useState<TextSelection | null>(null);

  const handleTextSelection = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelection(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const text = range.toString();

    if (text.trim().length > 0) {
      const startOffset = range.startOffset;
      const endOffset = range.endOffset;

      setSelection({
        text,
        startOffset,
        endOffset,
        elementId: (event.target as HTMLElement).id,
        context: extractContext(range),
      });
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelection(null);
  }, []);

  return {
    selection,
    handleTextSelection,
    clearSelection,
  };
}

function extractContext(range: Range): string {
  // Extract surrounding context (up to 100 chars before and after)
  const container = range.commonAncestorContainer;
  const fullText = container.textContent || '';
  const startOffset = range.startOffset;
  const endOffset = range.endOffset;

  const contextStart = Math.max(0, startOffset - 100);
  const contextEnd = Math.min(fullText.length, endOffset + 100);

  return fullText.slice(contextStart, contextEnd);
}
