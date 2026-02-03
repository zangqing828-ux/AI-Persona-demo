/**
 * Question Editor Component
 * Allows editing of individual interview questions
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { X, Plus, GripVertical } from 'lucide-react';
import type { InterviewQuestion } from '@/config-system/types/project';

export interface QuestionEditorProps {
  question: InterviewQuestion;
  onUpdate: (question: InterviewQuestion) => void;
  onDelete: () => void;
  availablePersonaTypes?: string[];
}

export function QuestionEditor({
  question,
  onUpdate,
  onDelete,
  availablePersonaTypes = [],
}: QuestionEditorProps) {
  const [options, setOptions] = useState<string[]>(question.options || []);

  const handleFieldUpdate = (field: keyof InterviewQuestion, value: any) => {
    onUpdate({
      ...question,
      [field]: value,
    });
  };

  const addOption = () => {
    const newOptions = [...options, `选项 ${options.length + 1}`];
    setOptions(newOptions);
    handleFieldUpdate('options', newOptions);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    handleFieldUpdate('options', newOptions);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    handleFieldUpdate('options', newOptions);
  };

  const showOptions = ['single-choice', 'multiple-choice'].includes(question.type);

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
            <Input
              value={question.text}
              onChange={(e) => handleFieldUpdate('text', e.target.value)}
              placeholder="输入问题..."
              className="flex-1"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>问题类型</Label>
            <Select
              value={question.type}
              onValueChange={(value) => handleFieldUpdate('type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-choice">单选题</SelectItem>
                <SelectItem value="multiple-choice">多选题</SelectItem>
                <SelectItem value="open-ended">开放题</SelectItem>
                <SelectItem value="rating">评分题</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>目标人设</Label>
            <Select
              value={question.targetPersonaType}
              onValueChange={(value) => handleFieldUpdate('targetPersonaType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="全部人设" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部人设</SelectItem>
                {availablePersonaTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {showOptions && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>选项</Label>
              <Button variant="outline" size="sm" onClick={addOption}>
                <Plus className="w-3 h-3 mr-1" />
                添加选项
              </Button>
            </div>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline" className="shrink-0">{index + 1}</Badge>
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`选项 ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                    disabled={options.length <= 1}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch
              checked={question.required}
              onCheckedChange={(checked) => handleFieldUpdate('required', checked)}
            />
            <Label>必填</Label>
          </div>

          {question.type !== 'open-ended' && (
            <div className="flex-1">
              <Label>评分权重: {question.scoringWeight || 0}</Label>
              <Slider
                value={[question.scoringWeight || 0]}
                onValueChange={([value]) => handleFieldUpdate('scoringWeight', value)}
                max={1}
                step={0.1}
                className="mt-2"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
