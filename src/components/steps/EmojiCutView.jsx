import { useState, useEffect } from 'react';
import { Download, RefreshCw, PlusCircle, Loader2, Scissors, Sparkles, ArrowLeft, Package } from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { processStickerSheet, loadImageFromSrc, extractStickerFromRect, generateStickerName } from '../../services/imageProcessor';
import StickerCard from '../emojiCut/StickerCard';
import ManualCropModal from '../emojiCut/ManualCropModal';
import JSZip from 'jszip';

const EmojiCutView = () => {
  const { generatedResult, goToPrevStep, resetWorkflow } = useWorkflow();
  
  const [status, setStatus] = useState({ stage: 'idle', progress: 0, message: '' });
  const [segments, setSegments] = useState([]);
  const [originalImage, setOriginalImage] = useState(null);
  const [originalImageEl, setOriginalImageEl] = useState(null);
  const [isManualCropping, setIsManualCropping] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // 获取 API Key
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  // 页面加载时自动开始处理
  useEffect(() => {
    if (generatedResult?.image && status.stage === 'idle') {
      processGeneratedImage();
    }
  }, [generatedResult]);

  const processGeneratedImage = async () => {
    if (!generatedResult?.image) return;

    try {
      setStatus({ stage: 'analyzing_layout', progress: 10, message: '正在加载图片...' });
      setSegments([]);
      
      const img = await loadImageFromSrc(generatedResult.image);
      setOriginalImage(generatedResult.image);
      setOriginalImageEl(img);

      setStatus({ stage: 'segmenting', progress: 30, message: '正在检测表情边界...' });
      
      await new Promise(r => setTimeout(r, 500));

      const detectedSegments = await processStickerSheet(img, (msg) => {
        setStatus(prev => ({ ...prev, message: msg }));
      });

      if (detectedSegments.length === 0) {
        setStatus({ stage: 'complete', progress: 100, message: '未检测到独立表情，请尝试手动裁剪' });
        return;
      }

      setSegments(detectedSegments);
      runAiNaming(detectedSegments);

    } catch (error) {
      console.error(error);
      setStatus({ stage: 'idle', progress: 0, message: '处理图片时出错' });
    }
  };

  const runAiNaming = async (itemsToName) => {
    if (!apiKey) {
      // 没有 API Key，使用默认名称
      setStatus({ stage: 'complete', progress: 100, message: '处理完成！' });
      return;
    }

    setStatus({ stage: 'ai_naming', progress: 60, message: '使用 Gemini AI 为表情命名...' });

    // 标记正在命名的贴纸
    setSegments(prev => prev.map(p => 
      itemsToName.some(i => i.id === p.id) ? { ...p, isNaming: true } : p
    ));

    let completed = 0;
    const batchSize = 3;
    
    const processBatch = async (batch) => {
      const promises = batch.map(async (seg) => {
        const name = await generateStickerName(seg.dataUrl, apiKey);
        setSegments(prev => prev.map(p => p.id === seg.id ? { ...p, name, isNaming: false } : p));
        completed++;
        if (itemsToName.length > 1) {
          setStatus(prev => ({ 
            ...prev, 
            progress: 60 + (completed / itemsToName.length) * 40,
            message: `正在识别表情 ${completed}/${itemsToName.length}...`
          }));
        }
      });
      await Promise.all(promises);
    };

    for (let i = 0; i < itemsToName.length; i += batchSize) {
      await processBatch(itemsToName.slice(i, i + batchSize));
    }

    setStatus({ stage: 'complete', progress: 100, message: '处理完成！' });
  };

  const handleManualCrop = (rect) => {
    if (!originalImageEl) return;
    
    const newSegment = extractStickerFromRect(
      originalImageEl, 
      rect, 
      `sticker_${segments.length + 1}`
    );

    if (newSegment) {
      setSegments(prev => [...prev, newSegment]);
      setIsManualCropping(false);
      // 自动为新贴纸运行 AI 命名
      if (apiKey) {
        runAiNaming([newSegment]);
      }
    }
  };

  const handleRename = (id, newName) => {
    setSegments(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  const handleDownloadAll = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const usedNames = new Set();

      segments.forEach((seg) => {
        // 确保文件名唯一
        let fileName = seg.name;
        let counter = 1;
        while (usedNames.has(fileName)) {
          fileName = `${seg.name}_${counter}`;
          counter++;
        }
        usedNames.add(fileName);

        // 移除 data:image/png;base64, 前缀
        const base64Data = seg.dataUrl.split(',')[1];
        zip.file(`${fileName}.png`, base64Data, { base64: true });
      });

      const content = await zip.generateAsync({ type: "blob" });
      
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = "stickers.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("打包文件时出错:", error);
      alert("创建压缩包失败");
    } finally {
      setIsZipping(false);
    }
  };

  const handleReprocess = () => {
    setSegments([]);
    setStatus({ stage: 'idle', progress: 0, message: '' });
    processGeneratedImage();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-50 border border-pink-100 rounded-full text-pink-600 text-sm font-medium">
          <Scissors size={14} />
          <span>表情包切图</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-display">
          裁剪并打包
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          AI 自动识别并分离每个表情，一键打包下载
        </p>
      </div>

      {/* Processing State */}
      {status.stage !== 'idle' && status.stage !== 'complete' && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-full max-w-md space-y-6 text-center">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-pink-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-pink-500 rounded-full border-t-transparent animate-spin"></div>
              <Scissors className="absolute inset-0 m-auto text-pink-500 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">正在处理表情包...</h3>
              <p className="text-gray-500">{status.message}</p>
            </div>
            <div className="w-full bg-pink-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-pink-500 to-violet-500 h-full transition-all duration-300 ease-out" 
                style={{ width: `${status.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Results View */}
      {status.stage === 'complete' && (
        <div className="animate-slideUp">
          {/* 原图预览 + 操作按钮 */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            {/* 原图 */}
            {originalImage && (
              <div className="lg:w-1/3">
                <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-lg">
                  <div className="aspect-square flex items-center justify-center bg-gray-50 p-4">
                    <img
                      src={originalImage}
                      alt="AI 生成的表情包"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </div>
                  <div className="p-3 border-t border-gray-100">
                    <p className="text-gray-400 text-xs text-center">AI 生成的表情包组图</p>
                  </div>
                </div>
              </div>
            )}

            {/* 操作区 */}
            <div className="lg:flex-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Sparkles className="text-pink-500" size={20} />
                      识别完成
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      共识别到 <span className="text-pink-600 font-semibold">{segments.length}</span> 个表情贴纸
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setIsManualCropping(true)}
                    disabled={!originalImage}
                    className="flex items-center gap-2 px-4 py-2.5 text-pink-700 bg-pink-50 border border-pink-200 font-medium rounded-xl hover:bg-pink-100 transition-colors disabled:opacity-50"
                  >
                    <PlusCircle size={18} />
                    手动添加
                  </button>
                  <button 
                    onClick={handleReprocess}
                    className="flex items-center gap-2 px-4 py-2.5 text-gray-600 bg-white border border-gray-300 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw size={18} />
                    重新识别
                  </button>
                  <button 
                    onClick={handleDownloadAll}
                    disabled={isZipping || segments.length === 0}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-violet-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all disabled:opacity-70 disabled:cursor-wait"
                  >
                    {isZipping ? <Loader2 size={18} className="animate-spin" /> : <Package size={18} />}
                    {isZipping ? '打包中...' : '下载全部'}
                  </button>
                </div>

                {/* 提示 */}
                <div className="mt-4 p-3 rounded-xl bg-violet-50 border border-violet-100">
                  <p className="text-violet-600 text-sm">
                    💡 点击每个表情可以单独下载或重命名，也可以一键打包全部下载
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 表情网格 */}
          {segments.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {segments.map((segment) => (
                <StickerCard 
                  key={segment.id} 
                  segment={segment} 
                  onRename={handleRename}
                />
              ))}
            </div>
          )}

          {/* 无结果提示 */}
          {segments.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Scissors className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">未自动检测到独立表情</p>
              <p className="text-gray-400 text-sm mt-1">请尝试手动选择区域裁剪</p>
              <button 
                onClick={() => setIsManualCropping(true)}
                disabled={!originalImage}
                className="mt-4 px-4 py-2 text-pink-600 bg-pink-50 border border-pink-200 rounded-xl hover:bg-pink-100 transition-colors disabled:opacity-50"
              >
                <PlusCircle size={16} className="inline mr-2" />
                手动裁剪
              </button>
            </div>
          )}

          {/* 底部操作 */}
          <div className="flex justify-center gap-4 pt-8">
            <button 
              onClick={goToPrevStep}
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              返回上一步
            </button>
            <button 
              onClick={resetWorkflow}
              className="btn-primary flex items-center gap-2"
            >
              <RefreshCw size={20} />
              开始新任务
            </button>
          </div>
        </div>
      )}

      {/* Manual Crop Modal */}
      {isManualCropping && originalImage && (
        <ManualCropModal 
          imageUrl={originalImage} 
          onClose={() => setIsManualCropping(false)}
          onConfirm={handleManualCrop}
        />
      )}
    </div>
  );
};

export default EmojiCutView;

