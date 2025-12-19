# Angels of Diffusion

AI 图像生成工作流应用 - React + Vite + Tailwind CSS

## ✨ 功能特性

### 🎨 微信表情包生成
将真人照片转化为二次元表情包贴纸，支持软萌可爱/沙雕搞怪/手绘线稿等风格

### 🤖 绝区零邦布化
基于 [Bangboo Factory](https://github.com/Rayinf/bamboo)，使用 **Gemini AI** 将人物转化为《绝区零》机械邦布角色
- 心情选择: 默认、开心、生气、悲伤、惊讶、酷炫
- 渲染风格: 3D 赛璐珞 / 扁平 2D

### 🐱 星铁奇美拉化
使用 **Gemini AI** 将人物转化为《崩坏：星穹铁道》毛绒奇美拉随宠
- 主题风格: 自动识别、花草植物、星空宇宙、元素精灵
- 装饰元素: 犄角、小翅膀、蓬松毛领、蝴蝶结 (可多选)

## 🚀 快速开始

```bash
npm install && npm run dev
```

### Gemini API 配置

邦布化和奇美拉化功能需要 Gemini API Key:
1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey) 获取 Key
2. 在应用内点击"设置 API Key"按钮输入

## 📁 项目结构

```
src/
├── config/workflowData.js      # 功能配置 + Prompt
├── services/geminiService.js   # Gemini AI 服务
├── context/WorkflowContext.jsx # 状态管理
├── components/steps/           # 工作流步骤组件
└── App.jsx
```

## 🙏 致谢

- [Bangboo Factory](https://github.com/Rayinf/bamboo) - 邦布化功能灵感
