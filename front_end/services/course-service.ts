/**
 * 课程服务层
 * 提供课程数据的获取接口，当前使用 mock 数据
 * TODO: 替换为真实 API 调用
 */

import { Course, CourseSection, GetCourseResponse, GetCourseSectionResponse } from '@/types/course';

/** Mock 课程数据常量 */
const MOCK_COURSE: Course = {
  id: 'course-001',
  title: '金融风险管理基础',
  description: '全面了解金融风险管理的核心概念和实践方法',
  sections: [
    {
      id: 'section-001',
      title: '第一章：风险管理基础',
      slug: 'chapter-1-fundamentals',
      order: 1,
      content: `# 第一章：风险管理基础

## 什么是风险管理？

风险管理是识别、分析和应对可能影响组织目标实现的不确定性的过程。在金融领域，风险管理尤为重要。

### 关键定义

**风险（Risk）**：在给定的时间内，由于不确定性因素的存在，导致实际结果与预期结果之间产生差异的可能性。

**风险管理（Risk Management）**：通过识别、量化和管理风险，使组织能够以可接受的成本实现其目标的过程。

## 风险管理的三个核心支柱

1. **识别（Identification）** - 发现和列举所有可能的风险
2. **分析（Analysis）** - 评估风险的概率和影响
3. **应对（Response）** - 制定和实施应对策略

## 风险管理框架

风险管理通常遵循以下步骤：

\`\`\`python
def risk_management_process():
    # 步骤1：确定风险偏好
    risk_appetite = define_risk_appetite()
    
    # 步骤2：识别风险
    identified_risks = identify_risks()
    
    # 步骤3：分析风险
    analyzed_risks = analyze_risks(identified_risks)
    
    # 步骤4：应对风险
    responses = develop_responses(analyzed_risks)
    
    # 步骤5：监控和报告
    monitor_and_report(responses)
\`\`\`

## 风险的分类

| 风险类型 | 定义 | 示例 |
|--------|------|------|
| 市场风险 | 由市场价格变化引起 | 股票、汇率风险 |
| 信用风险 | 借方无法履行义务 | 违约风险 |
| 流动性风险 | 无法及时转换为现金 | 资产低流动性 |
| 操作风险 | 内部流程、人员或系统失败 | 欺诈、系统故障 |

## 数学表示

风险可以用数学模型表示。最简单的方法是使用方差：

$$\\text{Risk} = \\sigma^2 = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})^2$$

其中：
- $\\sigma^2$ 是方差（风险度量）
- $x_i$ 是各个结果
- $\\bar{x}$ 是平均值
- $n$ 是观测数量

## 总结

风险管理是现代金融的基石。通过系统的方法论和工具，我们可以更好地识别和应对风险，从而保护资产和实现目标。`,
      children: [],
    },
    {
      id: 'section-002',
      title: '第二章：市场风险管理',
      slug: 'chapter-2-market-risk',
      order: 2,
      content: `# 第二章：市场风险管理

## 市场风险概述

市场风险是指由于市场价格变动（如利率、汇率、股票价格等）导致资产或负债价值变化的风险。

### 市场风险的类型

#### 1. 利率风险
利率风险是由于利率变化而导致的资产或负债价值变化的风险。

例如，如果你持有一个10年期、票面利率为4%的债券，而市场利率上升到5%，你的债券价值就会下降。

#### 2. 股票风险
股票风险来自股票价格的波动性。可以通过 beta 值来衡量：

$$r_i = r_f + \\beta_i(r_m - r_f)$$

其中：
- $r_i$ 是资产 $i$ 的预期回报率
- $r_f$ 是无风险利率
- $\\beta_i$ 是资产 $i$ 的 beta 值
- $r_m$ 是市场平均回报率

#### 3. 汇率风险
对于进出口企业或国际投资者，汇率变动会直接影响收益。

## 市场风险的衡量

### Value at Risk (VaR)

VaR 是衡量市场风险的最常用指标，定义为：在给定的时间段和置信水平下，资产组合可能最大损失的估计值。

举例：
- 投资组合 VaR(95%) = $100,000，表示在95%的置信水平下，日最大损失不超过 $100,000

### Expected Shortfall (ES)

ES 是 VaR 的补充指标，表示在损失超过 VaR 时的平均损失水平。

## 市场风险管理策略

\`\`\`javascript
class MarketRiskManager {
  constructor(portfolio) {
    this.portfolio = portfolio;
  }
  
  calculateVaR(confidenceLevel = 0.95) {
    // 计算 Value at Risk
    return this.portfolio.calculatePercentile(confidenceLevel);
  }
  
  hedgeInterestRateRisk() {
    // 使用利率互换对冲
    return this.portfolio.swapInterestRate();
  }
  
  diversify() {
    // 多元化投资组合
    return this.portfolio.optimizeAllocation();
  }
}
\`\`\`

## 实际案例分析

假设一个投资组合包含：
- 60% 股票（beta = 1.2）
- 40% 债券（beta = 0.3）

组合的 beta 值 = 0.6 × 1.2 + 0.4 × 0.3 = 0.84

这意味着当市场上升10%时，该组合预期上升8.4%。`,
      children: [],
    },
    {
      id: 'section-003',
      title: '第三章：信用风险评估',
      slug: 'chapter-3-credit-risk',
      order: 3,
      content: `# 第三章：信用风险评估

## 信用风险的定义

信用风险是借款人或交易对手无法履行其财务义务的风险。这是金融机构（特别是银行）面临的最大风险之一。

## 信用风险的来源

### 1. 违约风险（Default Risk）
借款人在约定日期无法偿还债务的风险。

### 2. 信用等级下降风险（Downgrade Risk）
企业信用评级下降导致债券价值下跌的风险。

### 3. 利差扩大风险（Spread Risk）
由于市场情绪变化，信用利差扩大的风险。

## 信用评分模型

### Altman Z-Score

Altman Z-Score 用于预测企业破产概率：

$$Z = 1.2X_1 + 1.4X_2 + 3.3X_3 + 0.6X_4 + 1.0X_5$$

其中：
- $X_1$ = 营运资本 / 总资产
- $X_2$ = 留存收益 / 总资产
- $X_3$ = EBIT / 总资产
- $X_4$ = 权益市值 / 总负债
- $X_5$ = 销售收入 / 总资产

**解释**：
- Z > 2.99：低破产风险
- 1.81 < Z < 2.99：灰色区域
- Z < 1.81：高破产风险

## 信用风险管理工具

### 1. 信用评级
由专业机构（如标普、穆迪）提供的企业信用评级。

### 2. 信用衍生品
- **信用违约互换（CDS）**：对冲信用风险的工具
- **担保债券凭证（CDO）**：信用风险的证券化产品

### 3. 贷款损失准备金
银行根据预期损失提取的准备金。

\`\`\`python
class CreditRiskAssessment:
    def __init__(self, company_financials):
        self.financials = company_financials
    
    def calculate_altman_z_score(self):
        """计算 Altman Z-Score"""
        x1 = self.get_working_capital_ratio()
        x2 = self.get_retained_earnings_ratio()
        x3 = self.get_ebit_ratio()
        x4 = self.get_equity_debt_ratio()
        x5 = self.get_sales_asset_ratio()
        
        z_score = (1.2 * x1 + 1.4 * x2 + 3.3 * x3 + 
                   0.6 * x4 + 1.0 * x5)
        return z_score
    
    def assess_default_probability(self):
        z_score = self.calculate_altman_z_score()
        if z_score > 2.99:
            return "低风险"
        elif z_score > 1.81:
            return "中等风险"
        else:
            return "高风险"
\`\`\`

## 信用风险管理策略

| 策略 | 方法 | 优点 |
|-----|------|------|
| 避免 | 不与高风险对手交易 | 风险最小化 |
| 缓解 | 担保、抵押、担保 | 损失有限 |
| 转移 | 保险、CDS、证券化 | 风险转移给专业人士 |
| 接受 | 提高利息率或准备金 | 风险换取回报 |

## 案例研究

**恒大危机分析**（2021年）

中国恒大集团的信用危机展示了：
1. 高杠杆率的风险
2. 信用评级下降的连锁反应
3. 系统性风险的重要性`,
      children: [],
    },
    {
      id: 'section-004',
      title: '第四章：流动性风险',
      slug: 'chapter-4-liquidity-risk',
      order: 4,
      content: `# 第四章：流动性风险

## 流动性风险定义

流动性风险是指资产无法以合理价格快速转换为现金的风险。

### 两种类型的流动性风险

#### 1. 资产流动性风险
资产在市场上难以售出而不造成重大价格下跌。

#### 2. 资金流动性风险
在需要时无法获得足够现金的风险。

## 流动性指标

### 流动性比率

\`\`\`
流动比率 = 流动资产 / 流动负债
速动比率 = (流动资产 - 存货) / 流动负债
\`\`\`

### 现金覆盖率
$$\\text{现金覆盖率} = \\frac{\\text{现金流入}}{\\text{现金流出}}$$

## 流动性危机的警示

### 2008年金融危机
- 房地产市场崩溃
- 抵押贷款证券失去流动性
- 银行业系统性崩溃

### 流动性陷阱
当市场信心丧失时，即使资产质量良好，也可能难以变现。

## 流动性管理策略

\`\`\`javascript
class LiquidityManager {
  constructor(assets, liabilities) {
    this.assets = assets;
    this.liabilities = liabilities;
  }
  
  calculateLiquidityRatio() {
    return this.assets.filter(a => a.liquid).length / 
           this.assets.length;
  }
  
  maintainLiquidityBuffer() {
    const requiredBuffer = this.liabilities.sum() * 0.2;
    const currentCash = this.assets.filter(a => a.type === 'cash').sum();
    
    if (currentCash < requiredBuffer) {
      console.warn('流动性缓冲不足，需要补充');
    }
  }
  
  diversifyFundingSources() {
    // 多元化融资来源
    return this.assets.map(a => a.diversifySource());
  }
}
\`\`\`

## 实时流动性管理

现代金融机构使用实时流动性管理系统：

1. **监控现金流**：实时追踪现金流入和流出
2. **应急计划**：在市场压力下的预案
3. **多元化投资**：避免过度依赖单一资产类别

## 流动性与收益率的权衡

更流动的资产通常回报率较低。投资者需要在：
- **高流动性** + **低收益**
- **低流动性** + **高收益**

之间找到平衡。`,
      children: [],
    },
    {
      id: 'section-005',
      title: '第五章：操作风险管理',
      slug: 'chapter-5-operational-risk',
      order: 5,
      content: `# 第五章：操作风险管理

## 操作风险定义

操作风险是由不充分或有问题的内部流程、人员或系统，以及外部事件导致损失的风险。

### 操作风险的四个主要来源

#### 1. 人员风险
- 员工错误或渎职
- 员工离职导致的知识流失
- 人员能力不足

#### 2. 流程风险
- 流程设计缺陷
- 流程执行不当
- 控制措施不足

#### 3. 系统风险
- 系统故障或停机
- 网络安全漏洞
- 数据丢失或泄露

#### 4. 外部事件风险
- 自然灾害
- 恐怖袭击
- 监管变化

## 操作风险的衡量

### Basel III 标准化方法

在 Basel III 框架下，操作风险资本要求为：

$$\\text{OPRC} = \\sum_{i=1}^{8} \\text{GI}_i \\times \\text{BIC}_i$$

其中：
- OPRC = 操作风险资本
- $\\text{GI}_i$ = 业务线 $i$ 的总收入
- $\\text{BIC}_i$ = 业务线 $i$ 的贝塔系数

## 操作风险管理框架

\`\`\`python
class OperationalRiskFramework:
    def __init__(self, organization):
        self.organization = organization
        self.risk_events = []
        self.controls = []
    
    def register_risk_event(self, event):
        """记录风险事件"""
        self.risk_events.append({
            'date': event.date,
            'category': event.category,
            'loss_amount': event.loss_amount,
            'root_cause': event.root_cause
        })
    
    def implement_control(self, control):
        """实施控制措施"""
        self.controls.append({
            'name': control.name,
            'risk_category': control.risk_category,
            'effectiveness': control.effectiveness
        })
    
    def calculate_var_operational(self):
        """计算操作风险 VaR"""
        # 基于历史损失数据计算
        losses = [e['loss_amount'] for e in self.risk_events]
        return sorted(losses)[int(len(losses) * 0.95)]
    
    def conduct_scenario_analysis(self, scenario):
        """进行情景分析"""
        potential_loss = scenario.probability * scenario.impact
        return potential_loss
\`\`\`

## 案例：支付系统故障

**情景**：银行的支付系统宕机 4 小时

**影响**：
- 无法处理交易
- 客户流失风险
- 监管处罚
- 声誉损害

**预计损失**：$5-10 百万

## 操作风险管理最佳实践

1. **建立强大的风险文化**
   - 员工培训和意识提升
   - 鼓励报告风险事件

2. **实施有效的控制**
   - 四眼原则（Four Eyes Principle）
   - 系统自动化和验证
   - 定期内部审计

3. **灾难恢复计划**
   - 业务连续性计划（BCP）
   - 定期备份和恢复测试
   - 异地数据中心

4. **保险覆盖**
   - 网络保险
   - 职业责任保险
   - 董事与高管责任保险

## 总结

操作风险虽然往往被忽视，但其影响可能非常严重。通过建立全面的管理框架和强大的风险文化，组织可以有效降低操作风险。`,
      children: [],
    },
  ],
};

/**
 * 获取完整课程数据
 * TODO: 替换为真实 API 调用
 */
export async function getCourse(): Promise<GetCourseResponse> {
  try {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: true,
      data: MOCK_COURSE,
    };
  } catch (error) {
    return {
      success: false,
      data: MOCK_COURSE,
      error: '获取课程数据失败',
    };
  }
}

/**
 * 获取单个课程章节
 * TODO: 替换为真实 API 调用
 */
export async function getCourseSection(sectionId: string): Promise<GetCourseSectionResponse> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const findSection = (sections: CourseSection[]): CourseSection | undefined => {
      for (const section of sections) {
        if (section.id === sectionId) {
          return section;
        }
        if (section.children) {
          const found = findSection(section.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    const section = findSection(MOCK_COURSE.sections);

    if (!section) {
      return {
        success: false,
        data: {} as CourseSection,
        error: '章节不存在',
      };
    }

    return {
      success: true,
      data: section,
    };
  } catch (error) {
    return {
      success: false,
      data: {} as CourseSection,
      error: '获取章节数据失败',
    };
  }
}
