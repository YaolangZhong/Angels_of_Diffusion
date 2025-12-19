import { WORKFLOW_OPTIONS } from '../config/workflowData';

/**
 * 组装发送给 Nano Banana Pro 的 Payload
 * @param {string} originalImage - Base64 字符串
 * @param {string} funcId - 功能 ID (wechat_emoji / zzz_bangboo)
 * @param {string[]} styleIds - 选中的风格 ID 数组
 * @returns {object} API Payload
 */
export const generatePromptPayload = (originalImage, funcId, styleIds) => {
  const config = WORKFLOW_OPTIONS[funcId];
  
  if (!config) throw new Error("Invalid Function ID");

  // 1. 获取基础 Prompt
  let finalPrompt = config.base_prompt;
  
  // 2. 遍历选中的 styleIds，追加对应的 prompt_suffix
  if (styleIds && styleIds.length > 0) {
    const stylePrompts = config.styles
      .filter(style => styleIds.includes(style.id))
      .map(style => style.prompt_suffix);
    
    if (stylePrompts.length > 0) {
      finalPrompt += `, ${stylePrompts.join(", ")}`;
    }
  }

  // 3. 构建最终 JSON
  return {
    fn_index: 0,
    data: [
      originalImage,
      finalPrompt,
      "low quality, error, bad anatomy, worst quality, jpeg artifacts",
      -1,
      config.denoising_strength
    ]
  };
};

/**
 * 获取完整的 prompt 文本（用于预览）
 */
export const getPromptPreview = (funcId, styleIds) => {
  const config = WORKFLOW_OPTIONS[funcId];
  if (!config) return '';

  let finalPrompt = config.base_prompt;
  
  if (styleIds && styleIds.length > 0) {
    const stylePrompts = config.styles
      .filter(style => styleIds.includes(style.id))
      .map(style => style.prompt_suffix);
    
    if (stylePrompts.length > 0) {
      finalPrompt += `, ${stylePrompts.join(", ")}`;
    }
  }

  return finalPrompt;
};

