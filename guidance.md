# Angels of Diffusion - 项目架构文档

## 项目概述
基于 React 的 AI 图像生成工作流前端，支持三种图像转换功能，统一使用 4 步引导流程。

## 技术栈
- React 18 + Vite 5
- Tailwind CSS
- Lucide React Icons
- Google Generative AI SDK (Gemini)
- Context API 状态管理

## 核心架构

```
┌─────────────────────────────────────────────────────────────┐
│                        App.jsx                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              WorkflowContext.Provider                    │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────┐ │ │
│  │  │ Step 1  │→ │ Step 2  │→ │ Step 3  │→ │   Step 4    │ │ │
│  │  │功能选择 │  │图片上传 │  │风格配置 │  │  结果交付   │ │ │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 功能模块

| 功能 ID | 名称 | API | 说明 |
|---------|------|-----|------|
| `wechat_emoji` | 微信表情包 | Stable Diffusion | 九宫格切图 + 打包 |
| `zzz_bangboo` | 绝区零邦布化 | Gemini AI | 机械邦布角色生成 |
| `hsr_chimera` | 星铁奇美拉化 | Gemini AI | 毛绒随宠角色生成 |

## 文件结构
```
src/
├── config/
│   └── workflowData.js      # 功能配置 + Prompt 模板
├── services/
│   └── geminiService.js     # Gemini API 封装
├── context/
│   └── WorkflowContext.jsx  # 全局状态管理
├── components/
│   ├── Stepper.jsx          # 步骤导航
│   └── steps/
│       ├── FunctionSelect   # Step 1: 功能选择
│       ├── ImageUpload      # Step 2: 图片上传
│       ├── StyleSelect      # Step 3: 风格/参数配置
│       └── DeliveryView     # Step 4: 结果展示
└── utils/
    └── promptGenerator.js   # Prompt 组装工具
```

## 数据流

```
用户选择功能 → 上传图片 → 配置参数 → 调用 API → 展示结果
     ↓              ↓           ↓           ↓          ↓
selectedFunction  uploadedImage  mood/theme  Gemini    generatedResult
                                 decor/style  API
```

## Gemini 功能配置

### 邦布化 (zzz_bangboo)
- **moods**: 6 种表情心情
- **renderStyles**: 2 种渲染风格 (3D/2D)
- **Prompt**: `BANGBOO_PROMPT_TEMPLATE`

### 奇美拉化 (hsr_chimera)
- **themes**: 4 种主题风格
- **decorStyles**: 4 种装饰元素 (可多选)
- **Prompt**: `CHIMERA_PROMPT_TEMPLATE`

## 扩展指南

添加新功能:
1. `workflowData.js` 添加功能配置
2. `geminiService.js` 添加生成函数 (如使用 Gemini)
3. `StyleSelect.jsx` 添加参数配置 UI
4. `DeliveryView.jsx` 添加结果展示逻辑
5. `WorkflowContext.jsx` 添加必要状态
