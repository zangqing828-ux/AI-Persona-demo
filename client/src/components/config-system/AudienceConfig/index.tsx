/**
 * Audience Config Component
 * CDP tags and segment rules configuration
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Save, RotateCcw } from 'lucide-react';
import { useConfig } from '@/config-system/hooks/useConfig';
import type { CDPTag, SegmentRule } from '@/config-system/types/project';

export interface AudienceConfigProps {
  industryId?: string;
}

export function AudienceConfig({ }: AudienceConfigProps) {
  const { configs, saveAudienceConfig, resetToDefaults } = useConfig();
  const [customTags, setCustomTags] = useState<CDPTag[]>([]);
  const [segmentRules, setSegmentRules] = useState<SegmentRule[]>([]);

  const handleAddTag = () => {
    const newTag: CDPTag = {
      id: `tag_${Date.now()}`,
      name: '新标签',
      category: '自定义',
      color: '#3b82f6',
      conditions: [],
    };
    setCustomTags([...customTags, newTag]);
  };

  const handleAddSegment = () => {
    const newSegment: SegmentRule = {
      id: `seg_${Date.now()}`,
      name: '新细分',
      tagCombination: 'AND',
      tagIds: [],
    };
    setSegmentRules([...segmentRules, newSegment]);
  };

  const handleSave = async () => {
    if (!configs.audience) return;

    const updatedConfig = {
      ...configs.audience,
      customTags,
      segmentRules,
      targetSegments: segmentRules.map(s => s.id),
    };

    await saveAudienceConfig(updatedConfig);
  };

  const handleReset = async () => {
    await resetToDefaults();
    // Reset local state
    if (configs.audience) {
      setCustomTags(configs.audience.customTags || []);
      setSegmentRules(configs.audience.segmentRules || []);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle>人群筛选配置</CardTitle>
          <CardDescription>
            配置 CDP 标签和人群细分规则
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

      {/* Custom Tags */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">自定义 CDP 标签</CardTitle>
            <Button variant="outline" size="sm" onClick={handleAddTag}>
              <Plus className="w-3 h-3 mr-1" />
              添加标签
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {customTags.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>暂无自定义标签</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {customTags.map((tag) => (
                <div key={tag.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{tag.name}</span>
                      <Badge variant="secondary">{tag.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tag.conditions.length} 条件
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCustomTags(customTags.filter(t => t.id !== tag.id))}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Segment Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">细分规则</CardTitle>
            <Button variant="outline" size="sm" onClick={handleAddSegment}>
              <Plus className="w-3 h-3 mr-1" />
              添加规则
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {segmentRules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>暂无细分规则</p>
            </div>
          ) : (
            <div className="space-y-3">
              {segmentRules.map((segment) => (
                <div key={segment.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{segment.name}</span>
                      <Badge variant="outline">{segment.tagCombination}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {segment.tagIds.length} 个标签
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSegmentRules(segmentRules.filter(s => s.id !== segment.id))}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
