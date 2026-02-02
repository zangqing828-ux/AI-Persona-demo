/**
 * 概念测试配置组件
 * 步骤1：上传产品信息，配置测试参数
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Package,
  Upload,
  CheckCircle2,
  Info,
  Percent,
  Scale,
  Leaf,
} from "lucide-react";
import { useIndustryData } from "@/hooks/useIndustryData";

interface Props {
  onComplete: () => void;
}

export default function ConceptTestConfig({ onComplete }: Props) {
  const { products, currentIndustry } = useIndustryData();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
  };

  const selectedProductData = products.find(p => p.id === selectedProduct);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">概念测试配置</h2>
        <p className="text-muted-foreground mt-1">
          选择或上传待测产品，配置测试参数
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                选择待测产品
              </CardTitle>
              <CardDescription>从产品库选择或上传新产品</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Cards */}
              <div
                className="grid gap-4"
                role="radiogroup"
                aria-label="选择测试产品"
              >
                {products.map(product => (
                  <div
                    key={product.id}
                    onClick={() => handleProductSelect(product.id)}
                    role="radio"
                    aria-checked={selectedProduct === product.id}
                    aria-label={`选择 ${product.name}`}
                    tabIndex={0}
                    onKeyDown={e => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleProductSelect(product.id);
                      }
                    }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedProduct === product.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-foreground">
                            {product.name}
                          </h3>
                          {currentIndustry === 'pet-food' && 'targetPet' in product && (
                            <Badge variant="secondary" className="text-xs">
                              {(product as any).targetPet === "猫" ? "🐱 猫粮" : "🐕 狗粮"}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {(product as any).brand} · {(product as any).category} ·{" "}
                          {currentIndustry === 'pet-food' && 'weight' in product
                            ? (product as any).weight
                            : currentIndustry === 'beauty' && 'size' in product
                            ? (product as any).size
                            : ''}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(currentIndustry === 'pet-food' && 'sellingPoints' in product
                            ? (product as any).sellingPoints
                            : currentIndustry === 'beauty' && 'benefits' in product
                            ? (product as any).benefits
                            : []
                          )
                            .slice(0, 3)
                            .map((point: string, idx: number) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                {point}
                              </Badge>
                            ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-primary">
                          ¥{(product as any).price}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {currentIndustry === 'pet-food' && 'weight' in product
                            ? (product as any).weight
                            : currentIndustry === 'beauty' && 'size' in product
                            ? (product as any).size
                            : ''}
                        </p>
                      </div>
                    </div>
                    {selectedProduct === product.id && currentIndustry === 'pet-food' && 'proteinContent' in product && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-2 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                              <Percent className="w-3 h-3" />
                              蛋白质
                            </div>
                            <p className="font-semibold text-foreground">
                              {(product as any).proteinContent}%
                            </p>
                          </div>
                          <div className="p-2 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                              <Scale className="w-3 h-3" />
                              脂肪
                            </div>
                            <p className="font-semibold text-foreground">
                              {(product as any).fatContent}%
                            </p>
                          </div>
                          <div className="p-2 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                              <Leaf className="w-3 h-3" />
                              碳水
                            </div>
                            <p className="font-semibold text-foreground">
                              {(product as any).carbContent}%
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedProduct === product.id && currentIndustry === 'beauty' && 'mainIngredients' in product && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="text-xs text-muted-foreground mb-2">主要成分</div>
                        <div className="flex flex-wrap gap-2">
                          {(product as any).mainIngredients.map((ing: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {ing}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Upload New Product */}
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">上传新产品信息</p>
                <p className="text-xs text-muted-foreground mt-1">
                  支持 Excel、图片、PDF 格式
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Details & Config */}
        <div className="space-y-4">
          {selectedProductData ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    产品详情
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {'mainIngredients' in selectedProductData && (
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        {currentIndustry === 'pet-food' ? '主要原料' : '主要成分'}
                      </Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(selectedProductData as any).mainIngredients.map((ing: string, idx: number) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {ing}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {currentIndustry === 'pet-food' && 'additives' in selectedProductData && (
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        功能添加
                      </Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(selectedProductData as any).additives.map((add: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {add}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {'certifications' in selectedProductData && (
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        认证资质
                      </Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(selectedProductData as any).certifications.map((cert: string, idx: number) => (
                          <Badge
                            key={idx}
                            className="text-xs bg-green-500/10 text-green-600 border-green-500/20"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">测试配置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="testName">测试名称</Label>
                    <Input
                      id="testName"
                      defaultValue={`${selectedProductData.name} 消费者模拟测试`}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="testDesc">测试目标</Label>
                    <Textarea
                      id="testDesc"
                      placeholder="描述本次测试的主要目标..."
                      defaultValue="评估目标客群对新品的购买意向、价格接受度和潜在顾虑"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">请先选择待测产品</p>
              </CardContent>
            </Card>
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={!selectedProduct}
            onClick={onComplete}
          >
            下一步：选择虚拟客群
          </Button>
        </div>
      </div>
    </div>
  );
}
