import { GoogleGenerativeAI } from '@google/generative-ai';
import { BANGBOO_PROMPT_TEMPLATE, CHIMERA_PROMPT_TEMPLATE } from '../config/workflowData';

// 从环境变量获取 API Key
const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

// 生成风格指南文本
const getStyleGuide = (renderStyle) => {
  if (renderStyle === 'cel-shaded') {
    return `- Use 3D cel-shaded rendering style matching Zenless Zone Zero's visual aesthetic
- Clear black outlines around shapes
- Vibrant, saturated colors with anime-style shading
- Dramatic lighting with distinct highlights and shadows
- Game-ready quality with polished finish`;
  } else {
    return `- Use flat 2D vector art style
- Clean lines with minimal shading
- Bold, solid colors
- Simplified shapes and forms
- Illustration/concept art quality`;
  }
};

// 获取心情描述
const getMoodDescription = (mood) => {
  const moodMap = {
    'default': 'neutral, calm expression',
    'happy': 'joyful, cheerful with a bright smile',
    'angry': 'fierce, determined with intense eyes',
    'sad': 'melancholic, droopy with teary eyes',
    'surprised': 'shocked, wide-eyed with amazement',
    'cool': 'confident, stylish with a cool demeanor'
  };
  return moodMap[mood] || moodMap['default'];
};

// 构建完整的 Bangboo prompt
const buildBangbooPrompt = (mood, renderStyle) => {
  return BANGBOO_PROMPT_TEMPLATE
    .replace('{{mood}}', getMoodDescription(mood))
    .replace('{{renderStyle}}', renderStyle === 'cel-shaded' ? '3D Cel-Shaded' : 'Flat 2D')
    .replace('{{styleGuide}}', getStyleGuide(renderStyle));
};

// 获取奇美拉主题描述
const getThemeDescription = (theme) => {
  const themeMap = {
    'default': '根据图片自动识别和提取特征',
    'floral': '花草植物主题，融入花卉、树叶、藤蔓等自然元素',
    'cosmic': '星空宇宙主题，添加星星、月亮、星云等宇宙元素',
    'elemental': '元素精灵主题，融入火焰、水流、冰晶或雷电等元素特征'
  };
  return themeMap[theme] || themeMap['default'];
};

// 获取奇美拉主题指南
const getChimeraThemeGuide = (theme) => {
  const guides = {
    'default': `- 自动分析图片主体的关键特征
- 根据人物的服装、配饰、发色等推断合适的主题
- 保持原图的配色方案`,
    'floral': `- 以花卉和植物为核心装饰元素
- 可添加花瓣、叶子形状的耳朵或犄角
- 配色偏向柔和的粉色、绿色、紫色
- 毛领可设计成花瓣或云朵形状`,
    'cosmic': `- 以星空和宇宙为主题
- 可添加星星装饰、月牙形犄角
- 配色偏向深蓝、紫色、带有星光点缀
- 眼睛可设计成星空或星云效果`,
    'elemental': `- 根据原图特征选择合适的元素（火/水/冰/雷）
- 添加对应元素的视觉效果（火焰纹理、水波纹、冰晶、电弧）
- 配色与所选元素一致
- 可添加元素相关的小配件`
  };
  return guides[theme] || guides['default'];
};

// 构建完整的奇美拉 prompt
const buildChimeraPrompt = (theme, decorations) => {
  const decorList = decorations.length > 0 
    ? decorations.map(d => {
        const decorMap = {
          'horns': '犄角',
          'wings': '小翅膀',
          'fluffy': '蓬松毛领',
          'ribbon': '蝴蝶结'
        };
        return decorMap[d] || d;
      }).join('、')
    : '自动选择';
  
  return CHIMERA_PROMPT_TEMPLATE
    .replace('{{theme}}', getThemeDescription(theme))
    .replace('{{decorations}}', decorList)
    .replace('{{themeGuide}}', getChimeraThemeGuide(theme));
};

// 将 base64 图片转换为 Gemini 需要的格式
const fileToGenerativePart = (base64Data, mimeType) => {
  // 移除 data:image/xxx;base64, 前缀
  const base64Content = base64Data.split(',')[1] || base64Data;
  return {
    inlineData: {
      data: base64Content,
      mimeType: mimeType || 'image/jpeg'
    }
  };
};

// 从 base64 字符串获取 MIME 类型
const getMimeType = (base64String) => {
  const match = base64String.match(/^data:([^;]+);base64,/);
  return match ? match[1] : 'image/jpeg';
};

/**
 * 使用 Gemini API 生成邦布图像
 * @param {string} imageBase64 - 原始图片的 base64 字符串
 * @param {string} mood - 心情 ID
 * @param {string} renderStyle - 渲染风格 ID
 * @returns {Promise<{success: boolean, image?: string, error?: string}>}
 */
export const generateBangboo = async (imageBase64, mood, renderStyle) => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return {
      success: false,
      error: '请先设置 Gemini API Key'
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 使用支持图像生成的模型
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp-image-generation',
      generationConfig: {
        responseModalities: ['Text', 'Image']
      }
    });

    const prompt = buildBangbooPrompt(mood, renderStyle);
    const mimeType = getMimeType(imageBase64);
    const imagePart = fileToGenerativePart(imageBase64, mimeType);

    // 调用 Gemini API
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    
    // 处理响应
    if (response.candidates && response.candidates[0]) {
      const parts = response.candidates[0].content.parts;
      
      // 查找图像部分
      for (const part of parts) {
        if (part.inlineData) {
          const generatedImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          return {
            success: true,
            image: generatedImage
          };
        }
      }
      
      // 如果没有图像，返回文本响应
      const textPart = parts.find(p => p.text);
      if (textPart) {
        return {
          success: false,
          error: `AI 响应: ${textPart.text.substring(0, 200)}...`
        };
      }
    }

    return {
      success: false,
      error: '未能生成图像，请重试'
    };

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // 处理特定错误
    if (error.message?.includes('API_KEY')) {
      return {
        success: false,
        error: 'API Key 无效，请检查设置'
      };
    }
    
    if (error.message?.includes('quota')) {
      return {
        success: false,
        error: 'API 配额已用完，请稍后再试'
      };
    }

    return {
      success: false,
      error: error.message || '生成失败，请重试'
    };
  }
};

/**
 * 使用 Gemini API 生成奇美拉图像
 * @param {string} imageBase64 - 原始图片的 base64 字符串
 * @param {string} theme - 主题 ID
 * @param {string[]} decorations - 装饰元素 ID 数组
 * @returns {Promise<{success: boolean, image?: string, error?: string}>}
 */
export const generateChimera = async (imageBase64, theme, decorations = []) => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return {
      success: false,
      error: '请先设置 Gemini API Key'
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp-image-generation',
      generationConfig: {
        responseModalities: ['Text', 'Image']
      }
    });

    const prompt = buildChimeraPrompt(theme, decorations);
    const mimeType = getMimeType(imageBase64);
    const imagePart = fileToGenerativePart(imageBase64, mimeType);

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    
    if (response.candidates && response.candidates[0]) {
      const parts = response.candidates[0].content.parts;
      
      for (const part of parts) {
        if (part.inlineData) {
          const generatedImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          return {
            success: true,
            image: generatedImage
          };
        }
      }
      
      const textPart = parts.find(p => p.text);
      if (textPart) {
        return {
          success: false,
          error: `AI 响应: ${textPart.text.substring(0, 200)}...`
        };
      }
    }

    return {
      success: false,
      error: '未能生成图像，请重试'
    };

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    if (error.message?.includes('API_KEY')) {
      return {
        success: false,
        error: 'API Key 无效，请检查设置'
      };
    }
    
    if (error.message?.includes('quota')) {
      return {
        success: false,
        error: 'API 配额已用完，请稍后再试'
      };
    }

    return {
      success: false,
      error: error.message || '生成失败，请重试'
    };
  }
};

