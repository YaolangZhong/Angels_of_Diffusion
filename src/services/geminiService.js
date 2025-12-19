import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  BANGBOO_BASE_PROMPT, 
  BANGBOO_MOOD_INSTRUCTIONS, 
  BANGBOO_STYLE_INSTRUCTIONS,
  CHIMERA_BASE_PROMPT,
  CHIMERA_THEME_INSTRUCTIONS,
  CHIMERA_STYLE_KEYWORDS
} from '../config/workflowData';

// 参考图路径
const REFERENCE_IMAGES = {
  bangboo: '/assets/bangboo-reference.png',
  chimera: '/assets/chimera-reference.jpg'
};

// 加载参考图为 base64
const loadReferenceImage = async (imagePath) => {
  try {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('Failed to load reference image:', error);
    return null;
  }
};

// 从环境变量获取 API Key
const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

/**
 * 构建 Bangboo 完整 Prompt (与 bamboo 原项目逻辑完全一致)
 * fullPrompt = BASE_PROMPT + moodInstruction + styleInstruction + styleKeywords
 */
const buildBangbooPrompt = (mood, renderStyle, customPrompt = '') => {
  // 1. 基础 Prompt
  let fullPrompt = BANGBOO_BASE_PROMPT;
  
  // 2. 心情指令 (如果不是默认)
  const moodInstruction = BANGBOO_MOOD_INSTRUCTIONS[mood] || '';
  if (moodInstruction) {
    fullPrompt += `\n\n表情要求：${moodInstruction}`;
  }
  
  // 3. 渲染风格指令和关键词
  const styleConfig = BANGBOO_STYLE_INSTRUCTIONS[renderStyle] || BANGBOO_STYLE_INSTRUCTIONS['cel-shaded'];
  fullPrompt += `\n\n渲染风格要求：${styleConfig.instruction}`;
  fullPrompt += `\n\n风格关键词：${styleConfig.keywords}`;
  
  // 4. 用户自定义要求
  if (customPrompt && customPrompt.trim()) {
    fullPrompt += `\n\n用户自定义要求：${customPrompt.trim()}`;
  }
  
  return fullPrompt;
};

/**
 * 构建奇美拉完整 Prompt (与 Bangboo 逻辑一致)
 * fullPrompt = BASE_PROMPT + themeInstruction + decorationInstruction + styleKeywords
 */
const buildChimeraPrompt = (theme, decorations, customPrompt = '') => {
  // 装饰元素映射
  const decorMap = {
    'horns': '犄角',
    'wings': '小翅膀',
    'fluffy': '蓬松毛领',
    'ribbon': '蝴蝶结',
    'halo': '光环',
    'tail': '蓬松尾巴',
    'crown': '小皇冠',
    'scarf': '围巾',
    'flower': '头花',
    'bells': '铃铛'
  };
  
  // 1. 基础 Prompt
  let fullPrompt = CHIMERA_BASE_PROMPT;
  
  // 2. 主题指令
  const themeInstruction = CHIMERA_THEME_INSTRUCTIONS[theme] || CHIMERA_THEME_INSTRUCTIONS['default'];
  fullPrompt += `\n\n主题风格要求：${themeInstruction}`;
  
  // 3. 装饰元素指令
  if (decorations.length > 0) {
    const decorList = decorations.map(d => decorMap[d] || d).join('、');
    fullPrompt += `\n\n装饰元素要求：请添加以下装饰元素：${decorList}`;
  }
  
  // 4. 风格关键词
  fullPrompt += `\n\n风格关键词：${CHIMERA_STYLE_KEYWORDS}`;
  
  // 5. 用户自定义要求
  if (customPrompt && customPrompt.trim()) {
    fullPrompt += `\n\n用户自定义要求：${customPrompt.trim()}`;
  }
  
  return fullPrompt;
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
 * 使用 Gemini API 生成邦布图像 (与 bamboo 项目完全一致的调用逻辑)
 * Parts 顺序: [用户图片, 参考图片, 图片说明文本, 完整Prompt]
 * @param {string} imageBase64 - 原始图片的 base64 字符串
 * @param {string} mood - 心情 ID
 * @param {string} renderStyle - 渲染风格 ID
 * @param {string} customPrompt - 用户自定义 prompt
 * @returns {Promise<{success: boolean, image?: string, error?: string}>}
 */
export const generateBangboo = async (imageBase64, mood, renderStyle, customPrompt = '') => {
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

    const fullPrompt = buildBangbooPrompt(mood, renderStyle, customPrompt);
    const mimeType = getMimeType(imageBase64);
    const userImagePart = fileToGenerativePart(imageBase64, mimeType);

    // 构建 parts 数组 (与 bamboo 原项目完全一致的顺序)
    const parts = [];
    
    // 1. 用户图片 (主体) - 第一位
    parts.push(userImagePart);
    
    // 2. 参考图片 (风格指南) - 第二位
    const refImageBase64 = await loadReferenceImage(REFERENCE_IMAGES.bangboo);
    if (refImageBase64) {
      const refMimeType = getMimeType(refImageBase64);
      const refImagePart = fileToGenerativePart(refImageBase64, refMimeType);
      parts.push(refImagePart);
      // 3. 图片说明文本 (与 bamboo 一致)
      parts.push({ text: '使用第一张图片作为要转换的主体。使用第二张图片作为"邦布"角色的身体比例、屏幕脸风格和兔子耳朵的参考。将主体（第一张图片）的特征适配到这个身体类型上。' });
    } else {
      parts.push({ text: '使用提供的图片作为要转换为邦布角色的主体。' });
    }
    
    // 4. 完整 Prompt - 最后
    parts.push({ text: fullPrompt });

    // 调用 Gemini API
    const result = await model.generateContent(parts);
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
 * 使用 Gemini API 生成奇美拉图像 (与 Bangboo 完全一致的调用逻辑)
 * Parts 顺序: [用户图片, 参考图片, 图片说明文本, 完整Prompt]
 * @param {string} imageBase64 - 原始图片的 base64 字符串
 * @param {string} theme - 主题 ID
 * @param {string[]} decorations - 装饰元素 ID 数组
 * @param {string} customPrompt - 用户自定义 prompt
 * @returns {Promise<{success: boolean, image?: string, error?: string}>}
 */
export const generateChimera = async (imageBase64, theme, decorations = [], customPrompt = '') => {
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

    const fullPrompt = buildChimeraPrompt(theme, decorations, customPrompt);
    const mimeType = getMimeType(imageBase64);
    const userImagePart = fileToGenerativePart(imageBase64, mimeType);

    // 构建 parts 数组 (与 bamboo 原项目完全一致的顺序)
    const parts = [];
    
    // 1. 用户图片 (主体) - 第一位
    parts.push(userImagePart);
    
    // 2. 参考图片 (风格指南) - 第二位
    const refImageBase64 = await loadReferenceImage(REFERENCE_IMAGES.chimera);
    if (refImageBase64) {
      const refMimeType = getMimeType(refImageBase64);
      const refImagePart = fileToGenerativePart(refImageBase64, refMimeType);
      parts.push(refImagePart);
      // 3. 图片说明文本 (与 bamboo 一致)
      parts.push({ text: '使用第一张图片作为要转换的主体。使用第二张图片作为"奇美拉"角色的身体比例、蹲坐姿态和毛绒质感的参考。将主体（第一张图片）的特征适配到这个身体类型上。' });
    } else {
      parts.push({ text: '使用提供的图片作为要转换为奇美拉角色的主体。' });
    }
    
    // 4. 完整 Prompt - 最后
    parts.push({ text: fullPrompt });

    const result = await model.generateContent(parts);
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

