/**
 * 表情包切图处理服务
 * 基于 EmojiCut 项目 (https://github.com/Rayinf/EmojiCut)
 */

/**
 * 从 File 对象加载图片
 */
export const loadImage = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * 从 base64 或 URL 加载图片
 */
export const loadImageFromSrc = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * 检查像素是否为背景色 (白色或透明)
 */
const isBackground = (r, g, b, a) => {
  if (a < 20) return true; // 透明
  // 高亮度视为背景 (白纸)
  return r > 240 && g > 240 && b > 240;
};

/**
 * 合并空间上接近的边界框
 */
const mergeRects = (rects, distanceThreshold) => {
  let merged = [...rects];
  let changed = true;

  while (changed) {
    changed = false;
    const newMerged = [];
    const visited = new Set();

    for (let i = 0; i < merged.length; i++) {
      if (visited.has(i)) continue;
      
      let current = { ...merged[i] };
      visited.add(i);

      for (let j = i + 1; j < merged.length; j++) {
        if (visited.has(j)) continue;
        
        const other = merged[j];
        
        const xDist = Math.max(0, current.minX - other.maxX, other.minX - current.maxX);
        const yDist = Math.max(0, current.minY - other.maxY, other.minY - current.maxY);
        
        if (xDist < distanceThreshold && yDist < distanceThreshold) {
          current.minX = Math.min(current.minX, other.minX);
          current.minY = Math.min(current.minY, other.minY);
          current.maxX = Math.max(current.maxX, other.maxX);
          current.maxY = Math.max(current.maxY, other.maxY);
          visited.add(j);
          changed = true;
        }
      }
      newMerged.push(current);
    }
    merged = newMerged;
  }
  return merged;
};

/**
 * 从图片/画布中提取特定区域，移除背景，并添加白色描边
 */
export const extractStickerFromRect = (source, rect, defaultName = 'sticker') => {
  const padding = 2;
  const strokeWidth = 6; // 白色边框宽度

  const width = source.width;
  const height = source.height;

  // 1. 计算原始裁剪尺寸
  const finalX = Math.max(0, rect.minX - padding);
  const finalY = Math.max(0, rect.minY - padding);
  const finalW = Math.min(width - finalX, (rect.maxX - rect.minX) + padding * 2);
  const finalH = Math.min(height - finalY, (rect.maxY - rect.minY) + padding * 2);

  if (finalW <= 0 || finalH <= 0) return null;

  // 2. 创建原始裁剪并移除背景
  const segCanvas = document.createElement('canvas');
  segCanvas.width = finalW;
  segCanvas.height = finalH;
  const segCtx = segCanvas.getContext('2d');
  if (!segCtx) return null;

  segCtx.drawImage(
    source,
    finalX, finalY, finalW, finalH,
    0, 0, finalW, finalH
  );

  const segImageData = segCtx.getImageData(0, 0, finalW, finalH);
  const segPixels = segImageData.data;
  for (let i = 0; i < segPixels.length; i += 4) {
    if (isBackground(segPixels[i], segPixels[i+1], segPixels[i+2], segPixels[i+3])) {
      segPixels[i+3] = 0; // 设为透明
    }
  }
  segCtx.putImageData(segImageData, 0, 0);

  // 3. 创建描边用的轮廓
  const silhouetteCanvas = document.createElement('canvas');
  silhouetteCanvas.width = finalW;
  silhouetteCanvas.height = finalH;
  const sCtx = silhouetteCanvas.getContext('2d');
  if (!sCtx) return null;

  sCtx.drawImage(segCanvas, 0, 0);
  sCtx.globalCompositeOperation = 'source-in';
  sCtx.fillStyle = '#FFFFFF';
  sCtx.fillRect(0, 0, finalW, finalH);

  // 4. 创建最终画布（包含描边空间）
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = finalW + (strokeWidth * 2);
  finalCanvas.height = finalH + (strokeWidth * 2);
  const fCtx = finalCanvas.getContext('2d');
  if (!fCtx) return null;

  // 启用平滑以获得更好的描边边缘
  fCtx.imageSmoothingEnabled = true;
  fCtx.imageSmoothingQuality = 'high';

  // 绘制轮廓多次形成描边
  const steps = 24; 
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const ox = strokeWidth + Math.cos(angle) * strokeWidth;
    const oy = strokeWidth + Math.sin(angle) * strokeWidth;
    fCtx.drawImage(silhouetteCanvas, ox, oy);
  }
  
  // 填充描边中心
  fCtx.drawImage(silhouetteCanvas, strokeWidth, strokeWidth);

  // 5. 在顶部绘制原始彩色图像
  fCtx.globalCompositeOperation = 'source-over';
  fCtx.drawImage(segCanvas, strokeWidth, strokeWidth);

  return {
    id: crypto.randomUUID(),
    dataUrl: finalCanvas.toDataURL('image/png'),
    originalX: finalX,
    originalY: finalY,
    width: finalCanvas.width,
    height: finalCanvas.height,
    name: defaultName,
    isNaming: false
  };
};

/**
 * 处理表情包组图的主函数
 */
export const processStickerSheet = async (image, onProgress) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  if (!ctx) throw new Error("无法获取 canvas context");

  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { width, height, data } = imageData;

  onProgress("正在扫描图片内容...");

  const visited = new Uint8Array(width * height);
  const rawRects = [];
  const getIdx = (x, y) => (y * width + x) * 4;

  for (let y = 0; y < height; y++) { 
    for (let x = 0; x < width; x++) {
      const visitIdx = y * width + x;

      if (visited[visitIdx]) continue;

      const idx = getIdx(x, y);
      if (!isBackground(data[idx], data[idx + 1], data[idx + 2], data[idx + 3])) {
        let minX = x, maxX = x, minY = y, maxY = y;
        let count = 0;
        
        const stack = [[x, y]];
        visited[visitIdx] = 1;

        while (stack.length > 0) {
          const [cx, cy] = stack.pop();
          if (cx < minX) minX = cx;
          if (cx > maxX) maxX = cx;
          if (cy < minY) minY = cy;
          if (cy > maxY) maxY = cy;
          count++;

          const neighbors = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];

          for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nVisitIdx = ny * width + nx;
              if (visited[nVisitIdx] === 0) {
                const nIdx = getIdx(nx, ny);
                if (!isBackground(data[nIdx], data[nIdx + 1], data[nIdx + 2], data[nIdx + 3])) {
                  visited[nVisitIdx] = 1;
                  stack.push([nx, ny]);
                }
              }
            }
          }
        }

        const w = maxX - minX;
        const h = maxY - minY;
        if (count > 50 && w > 5 && h > 5) {
          rawRects.push({ minX, maxX, minY, maxY });
        }
      }
    }
  }

  onProgress(`检测到 ${rawRects.length} 个组件，正在分组...`);

  // 合并相近的边界框 (距离阈值 15)
  const mergedRects = mergeRects(rawRects, 15);

  onProgress(`识别到 ${mergedRects.length} 个表情，正在提取...`);

  const finalSegments = [];
  
  for (let i = 0; i < mergedRects.length; i++) {
    const rect = mergedRects[i];
    const segment = extractStickerFromRect(canvas, rect, `sticker_${i + 1}`);
    if (segment) {
      finalSegments.push(segment);
    }
  }

  return finalSegments;
};

/**
 * 使用 Gemini 为贴纸生成名称
 */
export const generateStickerName = async (base64Image, apiKey) => {
  if (!apiKey) return "sticker";

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 移除 data:image/png;base64, 前缀
    const cleanBase64 = base64Image.split(',')[1];

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'image/png',
          data: cleanBase64
        }
      },
      {
        text: "分析这个表情贴纸。返回一个简短的描述性名称（最多3个词），使用英文 snake_case 格式。如果有文字，尝试捕捉其含义或情感。例如：'sad_crying', 'thumbs_up', 'working_hard', 'happy_dance'。只返回文件名，不要其他内容。"
      }
    ]);

    const response = await result.response;
    const text = response.text().trim();
    
    // 清理响应，只保留有效的文件名字符
    const cleanName = text.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase().substring(0, 30);
    return cleanName || "sticker";

  } catch (error) {
    console.error("Gemini 命名错误:", error);
    return "sticker"; // 回退
  }
};

