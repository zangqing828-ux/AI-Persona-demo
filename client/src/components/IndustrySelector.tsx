/**
 * Industry Selector Component
 * Allows users to switch between different industry configurations
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface Industry {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

const INDUSTRIES: Industry[] = [
  {
    id: 'pet-food',
    name: '宠物食品',
    description: '人宠双视角AI模拟',
    icon: '🐾',
  },
  {
    id: 'beauty',
    name: '美妆护肤',
    description: '消费者购买决策模拟',
    icon: '💄',
  },
];

interface IndustrySelectorProps {
  currentIndustry?: string;
  onIndustryChange?: (industryId: string) => void;
  className?: string;
}

export function IndustrySelector({
  currentIndustry = 'pet-food',
  onIndustryChange,
  className = '',
}: IndustrySelectorProps) {
  const selectedIndustry = INDUSTRIES.find((i) => i.id === currentIndustry);

  const handleSelect = (industryId: string) => {
    // Save to localStorage
    localStorage.setItem('current-industry', industryId);

    // Trigger callback if provided
    if (onIndustryChange) {
      onIndustryChange(industryId);
    }

    // Reload page to apply new industry
    window.location.reload();
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground">行业:</span>
      <Select value={currentIndustry} onValueChange={handleSelect}>
        <SelectTrigger className="w-[200px]">
          <SelectValue>
            {selectedIndustry?.icon} {selectedIndustry?.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {INDUSTRIES.map((industry) => (
            <SelectItem key={industry.id} value={industry.id}>
              <div className="flex items-center gap-2">
                {industry.icon && <span>{industry.icon}</span>}
                <div className="flex flex-col">
                  <span className="font-medium">{industry.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {industry.description}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface IndustryHeaderProps {
  currentIndustry?: string;
}

export function IndustryHeader({ currentIndustry = 'pet-food' }: IndustryHeaderProps) {
  const industry = INDUSTRIES.find((i) => i.id === currentIndustry);

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {industry?.icon && <span className="text-2xl">{industry.icon}</span>}
        <div>
          <h1 className="text-2xl font-bold">AI {industry?.name}消费者模拟</h1>
          <p className="text-sm text-muted-foreground">{industry?.description}</p>
        </div>
      </div>
      <IndustrySelector currentIndustry={currentIndustry} />
    </div>
  );
}
