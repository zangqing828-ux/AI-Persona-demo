/**
 * Selection Tracker Component
 * Tracks user text selections and provides quick actions
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TextCursor, Sparkles, Copy, Trash2 } from 'lucide-react';

export interface TextSelection {
  id: string;
  text: string;
  context?: string;
  timestamp: Date;
  source?: {
    type: 'questionnaire' | 'interview' | 'metric' | 'insight';
    id: string;
  };
}

export interface SelectionTrackerProps {
  onSelection?: (selection: TextSelection) => void;
  onClear?: () => void;
  maxSelections?: number;
}

export function SelectionTracker({
  onSelection,
  onClear,
  maxSelections = 10,
}: SelectionTrackerProps) {
  const [selections, setSelections] = useState<TextSelection[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const selectionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Track text selection across the document
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();

      if (!selectedText || selectedText.length < 3) {
        return;
      }

      // Debounce selection
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }

      selectionTimeoutRef.current = setTimeout(() => {
        const newSelection: TextSelection = {
          id: `sel_${Date.now()}`,
          text: selectedText,
          context: getContext(),
          timestamp: new Date(),
        };

        addSelection(newSelection);

        // Clear selection after processing
        selection?.removeAllRanges();
      }, 300);
    };

    const handleMouseUp = () => {
      setIsSelecting(true);
      handleSelection();
      setTimeout(() => setIsSelecting(false), 100);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleSelection);
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }
    };
  }, []);

  // Get surrounding context for selected text
  const getContext = (): string => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return '';

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;

    // Get parent element if container is a text node
    const element = container.nodeType === Node.TEXT_NODE
      ? container.parentElement
      : container as HTMLElement;

    return element?.textContent?.substring(0, 200) || '';
  };

  const addSelection = useCallback((selection: TextSelection) => {
    setSelections(prev => {
      // Check for duplicates
      const exists = prev.some(s => s.text === selection.text);
      if (exists) return prev;

      // Add new selection
      const updated = [selection, ...prev];

      // Limit max selections
      if (updated.length > maxSelections) {
        return updated.slice(0, maxSelections);
      }

      // Notify parent
      onSelection?.(selection);

      return updated;
    });
  }, [maxSelections, onSelection]);

  const removeSelection = useCallback((id: string) => {
    setSelections(prev => prev.filter(s => s.id !== id));
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, []);

  const clearAll = useCallback(() => {
    setSelections([]);
    onClear?.();
  }, [onClear]);

  return (
    <div className="space-y-4">
      {/* Selection Indicator */}
      {isSelecting && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
          <TextCursor className="w-4 h-4" />
          <span>检测到文本选择...</span>
        </div>
      )}

      {/* Selections List */}
      {selections.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TextCursor className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">选中的文本 ({selections.length})</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                <Trash2 className="w-3 h-3 mr-1" />
                清除全部
              </Button>
            </div>

            <div className="space-y-3">
              {selections.map(selection => (
                <div
                  key={selection.id}
                  className="group relative p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2 mb-1">
                        {selection.text}
                      </p>
                      {selection.context && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {selection.context}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {selection.text.length} 字符
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {selection.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(selection.text)}
                        title="复制"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeSelection(selection.id)}
                        title="删除"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  选择文本后可触发 AI 洞察分析
                </p>
                <Button size="sm" disabled={selections.length === 0}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  生成洞察 ({selections.length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {selections.length === 0 && !isSelecting && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <TextCursor className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">在页面上选择文本以开始分析</p>
              <p className="text-xs mt-2">选中的文本将自动显示在这里</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
