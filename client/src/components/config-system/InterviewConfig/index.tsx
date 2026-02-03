/**
 * Interview Config Component
 * Main interface for configuring interview questions and rules
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Save, RotateCcw } from 'lucide-react';
import { QuestionEditor } from './QuestionEditor';
import { QuestionLibrary } from './QuestionLibrary';
import { useConfig } from '@/config-system/hooks/useConfig';
import type { InterviewQuestion } from '@/config-system/types/project';

export interface InterviewConfigProps {
  industryId?: string;
}

export function InterviewConfig({ industryId = 'pet-food' }: InterviewConfigProps) {
  const { configs, saveInterviewConfig, resetToDefaults } = useConfig();
  const [questions, setQuestions] = useState<InterviewQuestion[]>(
    configs.interview?.questions || []
  );
  const [activeTab, setActiveTab] = useState('questions');

  const availablePersonaTypes = industryId === 'pet-food'
    ? ['owner', 'pet']
    : ['user'];

  const handleAddQuestion = (question: InterviewQuestion) => {
    setQuestions([...questions, { ...question, order: questions.length }]);
  };

  const handleUpdateQuestion = (index: number, updatedQuestion: InterviewQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!configs.interview) return;

    const updatedConfig = {
      ...configs.interview,
      questions: questions.map((q, i) => ({ ...q, order: i })),
    };

    await saveInterviewConfig(updatedConfig);
  };

  const handleReset = async () => {
    await resetToDefaults();
    if (configs.interview) {
      setQuestions(configs.interview.questions);
    }
  };

  const addNewQuestion = () => {
    const newQuestion: InterviewQuestion = {
      id: `q_${Date.now()}`,
      text: '',
      type: 'single-choice',
      order: questions.length,
      required: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle>访谈配置</CardTitle>
          <CardDescription>
            配置访谈问题模板和对话规则
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            保存配置
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="questions">问题列表</TabsTrigger>
          <TabsTrigger value="templates">模板库</TabsTrigger>
          <TabsTrigger value="rules">对话规则</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={addNewQuestion}>
              <Plus className="w-4 h-4 mr-2" />
              添加问题
            </Button>
          </div>

          {questions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p>暂无问题，请添加或从模板库选择</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <QuestionEditor
                  key={question.id}
                  question={question}
                  onUpdate={(updated) => handleUpdateQuestion(index, updated)}
                  onDelete={() => handleDeleteQuestion(index)}
                  availablePersonaTypes={availablePersonaTypes}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates">
          <QuestionLibrary
            onQuestionSelect={handleAddQuestion}
            industryId={industryId}
          />
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>对话规则配置</CardTitle>
              <CardDescription>
                配置 AI 访谈员的行为和回应风格
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>对话规则配置正在开发中...</p>
                <p className="text-sm mt-2">将支持问候语、追问风格、情感触发等配置</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
