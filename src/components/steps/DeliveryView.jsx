import { useState, useEffect } from 'react';
import { Download, RotateCcw, CheckCircle, Loader2, Package, Maximize2, Sparkles } from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { WORKFLOW_OPTIONS } from '../../config/workflowData';

const DeliveryView = () => {
  const { selectedFunction, uploadedImage, generatedResult, resetWorkflow } = useWorkflow();
  const [processingStatus, setProcessingStatus] = useState('processing');
  const [statusMessage, setStatusMessage] = useState('');

  const config = WORKFLOW_OPTIONS[selectedFunction];
  const isBangboo = selectedFunction === 'zzz_bangboo';
  const isChimera = selectedFunction === 'hsr_chimera';
  const isGeminiFeature = isBangboo || isChimera;

  useEffect(() => {
    let timer;
    
    if (isGeminiFeature) {
      // Gemini 功能已经在上一步生成完成
      if (generatedResult?.isBangboo || generatedResult?.isChimera) {
        setStatusMessage(isBangboo ? '邦布生成完成!' : '奇美拉生成完成!');
        setProcessingStatus('completed');
      } else {
        setStatusMessage('正在进行高清放大处理...');
        timer = setTimeout(() => {
          setStatusMessage('高清放大完成!');
          setProcessingStatus('completed');
        }, 1000);
      }
    } else if (selectedFunction === 'wechat_emoji') {
      setStatusMessage('正在调用九宫格切图脚本...');
      
      timer = setTimeout(() => {
        setStatusMessage('正在打包压缩...');
        
        setTimeout(() => {
          setStatusMessage('表情包打包完成!');
          setProcessingStatus('completed');
        }, 800);
      }, 1500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [selectedFunction, generatedResult, isBangboo, isChimera, isGeminiFeature]);

  const handleDownload = () => {
    const imageToDownload = generatedResult?.image || uploadedImage?.preview;
    if (!imageToDownload) return;

    const link = document.createElement('a');
    link.href = imageToDownload;
    
    if (isBangboo) {
      link.download = `bangboo_${Date.now()}.png`;
    } else if (isChimera) {
      link.download = `chimera_${Date.now()}.png`;
    } else if (selectedFunction === 'wechat_emoji') {
      link.download = 'emoji_pack.zip';
    } else {
      link.download = 'generated_image.png';
    }
    
    link.click();
  };

  // 决定显示哪张图片
  const displayImage = generatedResult?.image || uploadedImage?.preview;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className={`
          inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium
          ${processingStatus === 'completed' 
            ? 'bg-emerald-50 border border-emerald-100 text-emerald-600' 
            : 'bg-pink-50 border border-pink-100 text-pink-600'
          }
        `}>
          {processingStatus === 'completed' ? (
            <>
              <CheckCircle size={14} />
              <span>处理完成</span>
            </>
          ) : (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>处理中</span>
            </>
          )}
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-display">
          {processingStatus === 'completed' 
            ? (isBangboo ? '你的邦布已就绪!' : isChimera ? '你的奇美拉已就绪!' : '作品已就绪') 
            : '正在处理中'}
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          {statusMessage}
        </p>
      </div>

      {/* Result Display */}
      <div className="max-w-2xl mx-auto">
        <div className="card p-6 space-y-6">
          {/* Processing Animation or Result */}
          <div className="relative rounded-xl overflow-hidden bg-gray-50 aspect-square flex items-center justify-center">
            {processingStatus === 'processing' ? (
              <div className="flex flex-col items-center gap-4 text-center p-8">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full border-4 border-gray-200 animate-spin ${isChimera ? 'border-t-amber-500' : 'border-t-pink-500'}`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isGeminiFeature ? (
                      <Sparkles className={isChimera ? 'text-amber-500' : 'text-pink-500'} size={28} />
                    ) : selectedFunction === 'wechat_emoji' ? (
                      <Package className="text-pink-500" size={28} />
                    ) : (
                      <Maximize2 className="text-pink-500" size={28} />
                    )}
                  </div>
                </div>
                <p className="text-gray-500 text-sm max-w-[200px]">
                  {statusMessage}
                </p>
              </div>
            ) : (
              <>
                <img
                  src={displayImage}
                  alt="Generated result"
                  className="max-w-full max-h-full object-contain"
                />
                
                {/* Result type indicator */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur rounded-lg text-xs font-medium text-gray-700 border border-gray-100 shadow-sm">
                    {isBangboo 
                      ? '🤖 邦布角色' 
                      : isChimera 
                        ? '🐱 奇美拉随宠'
                        : selectedFunction === 'wechat_emoji' 
                          ? '🎉 表情包 ZIP' 
                          : '✨ 生成结果'}
                  </span>
                </div>

                {/* Gemini badge */}
                {isGeminiFeature && (generatedResult?.isBangboo || generatedResult?.isChimera) && (
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-medium text-white shadow-lg ${
                      isChimera 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                        : 'bg-gradient-to-r from-pink-500 to-violet-500'
                    }`}>
                      Gemini AI
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Function Info */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
            <div>
              <p className="text-gray-400 text-xs">转换类型</p>
              <p className="text-gray-900 font-medium">{config?.title}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs">处理方式</p>
              <p className={`font-medium text-sm ${isChimera ? 'text-amber-500' : 'text-pink-500'}`}>
                {isGeminiFeature 
                  ? 'Gemini AI 生成' 
                  : selectedFunction === 'wechat_emoji' 
                    ? '九宫格切图 + 打包' 
                    : '高清放大'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              disabled={processingStatus !== 'completed'}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Download size={20} />
              下载结果
            </button>
            <button
              onClick={resetWorkflow}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              重新开始
            </button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="max-w-2xl mx-auto">
        <div className={`p-4 rounded-xl border ${isChimera ? 'bg-amber-50 border-amber-100' : 'bg-violet-50 border-violet-100'}`}>
          <p className={`text-sm text-center ${isChimera ? 'text-amber-700' : 'text-violet-600'}`}>
            {isGeminiFeature 
              ? (isChimera 
                  ? '💡 奇美拉角色由 Gemini AI 生成，每次结果可能略有不同'
                  : '💡 邦布角色由 Gemini AI 生成，每次结果可能略有不同')
              : '💡 提示: 如果对结果不满意，可以点击"重新开始"调整参数后重新生成'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryView;
