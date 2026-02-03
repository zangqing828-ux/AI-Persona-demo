/**
 * Chat Interface Component
 * RAG-powered AI chat for insights and data exploration
 */

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles, User, Bot, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: DataSource[];
  confidence?: number;
}

export interface DataSource {
  id: string;
  type: 'questionnaire' | 'interview' | 'metric' | 'insight';
  description: string;
  relevanceScore?: number;
  excerpt?: string;
}

export interface RAGQuery {
  query: string;
  selectedText?: string;
  context?: string;
  filters?: {
    personaType?: string;
    segment?: string;
    dateRange?: [Date, Date];
  };
}

export interface RAGResult {
  answer: string;
  sources: Array<{
    document: DataSource;
    similarity: number;
  }>;
  confidence: number;
}

export interface ChatInterfaceProps {
  queryInsights: (query: RAGQuery) => Promise<RAGResult>;
  initialMessage?: string;
  selectedText?: string | null;
}

export function ChatInterface({
  queryInsights,
  initialMessage,
  selectedText,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle initial message or selected text
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleSend(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    if (selectedText && messages.length === 0) {
      setInput(`请解释这段文本: "${selectedText.substring(0, 50)}..."`);
      inputRef.current?.focus();
    }
  }, [selectedText]);

  const handleSend = async (content?: string) => {
    const messageContent = content || input.trim();
    if (!messageContent || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Query RAG engine
      const result = await queryInsights({
        query: messageContent,
        selectedText: selectedText || undefined,
      });

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: result.answer,
        timestamp: new Date(),
        sources: result.sources.map(s => s.document),
        confidence: result.confidence,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: '抱歉，我遇到了一些问题。请稍后再试。',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // Could add toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'bg-gray-100 text-gray-800';
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getSourceTypeIcon = (type: DataSource['type']) => {
    switch (type) {
      case 'questionnaire':
        return '📋';
      case 'interview':
        return '💬';
      case 'metric':
        return '📊';
      case 'insight':
        return '💡';
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI 洞察助手
            </CardTitle>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMessages([])}
              >
                清空对话
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 px-6">
            <div ref={scrollRef} className="space-y-4 py-4">
              {messages.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">开始与 AI 洞察助手对话</p>
                  <p className="text-xs mt-2">询问关于数据、指标或用户洞察的问题</p>
                </div>
              )}

              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 space-y-2">
                      <div
                        className={`rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>

                      {/* Sources (for assistant messages) */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="ml-2 space-y-1">
                          <p className="text-xs text-muted-foreground">参考来源:</p>
                          {message.sources.slice(0, 3).map(source => (
                            <div
                              key={source.id}
                              className="flex items-center gap-2 text-xs p-2 bg-muted/50 rounded"
                            >
                              <span>{getSourceTypeIcon(source.type)}</span>
                              <span className="flex-1 line-clamp-1">{source.description}</span>
                              {source.relevanceScore && (
                                <Badge variant="outline" className="text-xs">
                                  {(source.relevanceScore * 100).toFixed(0)}%
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Message Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {message.confidence && message.role === 'assistant' && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${getConfidenceColor(message.confidence)}`}
                            >
                              置信度: {(message.confidence * 100).toFixed(0)}%
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(message.timestamp), 'HH:mm', { locale: zhCN })}
                          </span>
                        </div>

                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyMessage(message.content)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <ThumbsDown className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入问题，例如: 解释购买意向指标..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            {messages.length === 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSend('总结关键洞察')}
                  disabled={isLoading}
                >
                  总结关键洞察
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSend('分析用户画像差异')}
                  disabled={isLoading}
                >
                  分析用户画像差异
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSend('识别潜在风险')}
                  disabled={isLoading}
                >
                  识别潜在风险
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
