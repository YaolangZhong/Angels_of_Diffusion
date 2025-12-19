import { ArrowLeft, Wand2, Eye, Sparkles, AlertTriangle, PenLine, ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { WORKFLOW_OPTIONS } from '../../config/workflowData';
import { getPromptPreview } from '../../utils/promptGenerator';
import { generateBangboo, generateChimera } from '../../services/geminiService';

// 参考图配置
const REFERENCE_IMAGES = {
  zzz_bangboo: {
    src: '/assets/bangboo-reference.png',
    alt: '邦布风格参考图',
    title: '邦布风格参考'
  },
  hsr_chimera: {
    src: '/assets/chimera-reference.jpg',
    alt: '奇美拉风格参考图',
    title: '奇美拉风格参考'
  }
};

const StyleSelect = () => {
  const { 
    selectedFunction, 
    selectedStyles, 
    toggleStyle, 
    uploadedImage,
    goToPrevStep, 
    goToNextStep,
    setIsProcessing,
    setGeneratedResult,
    selectedMood,
    setSelectedMood,
    selectedRenderStyle,
    setSelectedRenderStyle,
    selectedTheme,
    setSelectedTheme,
    selectedDecorations,
    toggleDecoration,
    customPrompt,
    setCustomPrompt
  } = useWorkflow();
  
  const [showPromptPreview, setShowPromptPreview] = useState(false);
  const [showReferenceImage, setShowReferenceImage] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const config = WORKFLOW_OPTIONS[selectedFunction];
  const isBangboo = selectedFunction === 'zzz_bangboo';
  const isChimera = selectedFunction === 'hsr_chimera';
  const isGeminiFeature = isBangboo || isChimera;
  const promptPreview = !isGeminiFeature ? getPromptPreview(selectedFunction, selectedStyles, customPrompt) : null;

  const handleGenerate = async () => {
    setError(null);
    setIsGenerating(true);
    setIsProcessing(true);

    if (isBangboo) {
      // 使用 Gemini API 生成邦布
      const result = await generateBangboo(
        uploadedImage.base64,
        selectedMood,
        selectedRenderStyle,
        customPrompt
      );

      if (result.success) {
        setGeneratedResult({
          image: result.image,
          timestamp: Date.now(),
          isBangboo: true
        });
        goToNextStep();
      } else {
        setError(result.error);
      }
    } else if (isChimera) {
      // 使用 Gemini API 生成奇美拉
      const result = await generateChimera(
        uploadedImage.base64,
        selectedTheme,
        selectedDecorations,
        customPrompt
      );

      if (result.success) {
        setGeneratedResult({
          image: result.image,
          timestamp: Date.now(),
          isChimera: true
        });
        goToNextStep();
      } else {
        setError(result.error);
      }
    } else {
      // 模拟其他功能的 API 调用
      await new Promise(resolve => setTimeout(resolve, 2500));
      setGeneratedResult({
        image: uploadedImage.preview,
        timestamp: Date.now(),
      });
      goToNextStep();
    }

    setIsGenerating(false);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-display">
          {isBangboo ? '配置邦布参数' : isChimera ? '配置奇美拉参数' : '选择艺术风格'}
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          {isBangboo 
            ? '使用 Gemini AI 将照片转化为《绝区零》邦布角色'
            : isChimera 
              ? '使用 Gemini AI 将照片转化为《崩坏：星穹铁道》奇美拉随宠'
              : <>为 <span className="text-pink-500 font-medium">{config?.title}</span> 选择一个或多个风格效果</>
          }
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-6">
        {/* Image Preview - Left Side */}
        <div className="lg:col-span-2">
          <div className="sticky top-8 space-y-4">
            <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-lg">
              <div className="aspect-square flex items-center justify-center bg-gray-50">
                <img
                  src={uploadedImage?.preview}
                  alt="Source"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="p-3 border-t border-gray-100">
                <p className="text-gray-400 text-xs text-center">原始图片</p>
              </div>
            </div>
          </div>
        </div>

        {/* Style Selection - Right Side */}
        <div className="lg:col-span-3 space-y-6">
          {isBangboo ? (
            // Bangboo 专用配置
            <>
              {/* Mood Selection */}
              <div className="space-y-3">
                <p className="text-gray-600 text-sm font-medium">选择表情心情:</p>
                <div className="grid grid-cols-3 gap-3">
                  {config?.moods.map((mood) => {
                    const isSelected = selectedMood === mood.id;
                    return (
                      <button
                        key={mood.id}
                        onClick={() => setSelectedMood(mood.id)}
                        className={`
                          p-4 rounded-xl text-center transition-all duration-300
                          ${isSelected 
                            ? 'bg-gradient-to-r from-pink-50 to-violet-50 border-2 border-pink-300 shadow-lg' 
                            : 'bg-white border border-gray-100 hover:border-gray-200'
                          }
                        `}
                      >
                        <span className="text-2xl block mb-1">{mood.emoji}</span>
                        <span className={`text-sm font-medium ${isSelected ? 'text-pink-600' : 'text-gray-700'}`}>
                          {mood.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Render Style Selection */}
              <div className="space-y-3">
                <p className="text-gray-600 text-sm font-medium">选择渲染风格:</p>
                <div className="grid gap-3">
                  {config?.renderStyles.map((style) => {
                    const isSelected = selectedRenderStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        onClick={() => setSelectedRenderStyle(style.id)}
                        className={`
                          p-4 rounded-xl text-left transition-all duration-300
                          ${isSelected 
                            ? 'bg-gradient-to-r from-pink-50 to-violet-50 border-2 border-pink-300' 
                            : 'bg-white border border-gray-100 hover:border-gray-200'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{style.emoji}</span>
                          <div>
                            <span className={`font-semibold block ${isSelected ? 'text-pink-600' : 'text-gray-900'}`}>
                              {style.label}
                            </span>
                            <span className="text-gray-400 text-xs">{style.description}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bangboo Info */}
              <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
                <p className="text-violet-600 text-sm">
                  🤖 基于 <a href="https://github.com/Rayinf/bamboo" target="_blank" rel="noopener noreferrer" className="underline font-medium">Bangboo Factory</a> 项目，使用 Gemini AI 生成邦布角色
                </p>
              </div>

              {/* Reference Image Toggle */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowReferenceImage(!showReferenceImage)}
                  className="flex items-center gap-2 text-violet-500 hover:text-violet-700 text-sm transition-colors"
                >
                  <ImageIcon size={16} />
                  <span>{REFERENCE_IMAGES.zzz_bangboo.title}</span>
                  {showReferenceImage ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                {showReferenceImage && (
                  <div className="rounded-xl overflow-hidden border border-violet-200 bg-white">
                    <img
                      src={REFERENCE_IMAGES.zzz_bangboo.src}
                      alt={REFERENCE_IMAGES.zzz_bangboo.alt}
                      className="w-full h-auto"
                    />
                    <div className="p-3 bg-violet-50 border-t border-violet-100">
                      <p className="text-violet-600 text-xs text-center">
                        📸 AI 会参考此风格生成邦布角色
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : isChimera ? (
            // Chimera 专用配置
            <>
              {/* Theme Selection */}
              <div className="space-y-3">
                <p className="text-gray-600 text-sm font-medium">选择主题风格:</p>
                <div className="grid gap-3">
                  {config?.themes.map((theme) => {
                    const isSelected = selectedTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`
                          p-4 rounded-xl text-left transition-all duration-300
                          ${isSelected 
                            ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300' 
                            : 'bg-white border border-gray-100 hover:border-gray-200'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{theme.emoji}</span>
                          <div>
                            <span className={`font-semibold block ${isSelected ? 'text-amber-600' : 'text-gray-900'}`}>
                              {theme.label}
                            </span>
                            <span className="text-gray-400 text-xs">{theme.description}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Decoration Selection */}
              <div className="space-y-3">
                <p className="text-gray-600 text-sm font-medium">选择装饰元素 (可多选):</p>
                <div className="grid grid-cols-2 gap-3">
                  {config?.decorStyles.map((decor) => {
                    const isSelected = selectedDecorations.includes(decor.id);
                    return (
                      <button
                        key={decor.id}
                        onClick={() => toggleDecoration(decor.id)}
                        className={`
                          p-4 rounded-xl text-center transition-all duration-300
                          ${isSelected 
                            ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 shadow-lg' 
                            : 'bg-white border border-gray-100 hover:border-gray-200'
                          }
                        `}
                      >
                        <span className="text-2xl block mb-1">{decor.emoji}</span>
                        <span className={`text-sm font-medium ${isSelected ? 'text-amber-600' : 'text-gray-700'}`}>
                          {decor.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chimera Info */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <p className="text-amber-700 text-sm">
                  🐱 基于《崩坏：星穹铁道》奇美拉设计风格，使用 Gemini AI 生成毛茸茸的可爱随宠
                </p>
              </div>

              {/* Reference Image Toggle */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowReferenceImage(!showReferenceImage)}
                  className="flex items-center gap-2 text-amber-600 hover:text-amber-800 text-sm transition-colors"
                >
                  <ImageIcon size={16} />
                  <span>{REFERENCE_IMAGES.hsr_chimera.title}</span>
                  {showReferenceImage ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                {showReferenceImage && (
                  <div className="rounded-xl overflow-hidden border border-amber-200 bg-white">
                    <img
                      src={REFERENCE_IMAGES.hsr_chimera.src}
                      alt={REFERENCE_IMAGES.hsr_chimera.alt}
                      className="w-full h-auto"
                    />
                    <div className="p-3 bg-amber-50 border-t border-amber-100">
                      <p className="text-amber-700 text-xs text-center">
                        📸 AI 会参考此风格生成奇美拉角色
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            // 原有的风格选择
            <>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm font-medium">可选风格 (可多选):</p>
                <div className="grid gap-3">
                  {config?.styles.map((style) => {
                    const isSelected = selectedStyles.includes(style.id);
                    
                    return (
                      <div
                        key={style.id}
                        onClick={() => toggleStyle(style.id)}
                        className={`
                          p-4 rounded-xl cursor-pointer transition-all duration-300
                          ${isSelected 
                            ? 'bg-gradient-to-r from-pink-50 to-violet-50 border border-pink-200' 
                            : 'bg-white border border-gray-100 hover:border-gray-200'
                          }
                        `}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`
                            w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-all
                            ${isSelected 
                              ? 'bg-gradient-to-r from-pink-500 to-violet-500' 
                              : 'bg-gray-100 border border-gray-200'
                            }
                          `}>
                            {isSelected && (
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{style.emoji}</span>
                              <h4 className={`font-semibold ${isSelected ? 'text-pink-600' : 'text-gray-900'}`}>
                                {style.label}
                              </h4>
                            </div>
                            <p className="text-gray-400 text-xs mt-1 font-mono">
                              {style.prompt_suffix}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Prompt Preview Toggle */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowPromptPreview(!showPromptPreview)}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
                >
                  <Eye size={16} />
                  {showPromptPreview ? '隐藏' : '预览'} 最终 Prompt
                </button>

                {showPromptPreview && (
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-gray-600 text-sm font-mono leading-relaxed break-all">
                      {promptPreview || config?.base_prompt}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Custom Prompt Input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
              <PenLine size={16} />
              <span>自定义描述 (可选)</span>
            </div>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={
                isBangboo 
                  ? "例如: 添加一个小天使光环、背景加入霓虹灯效果..."
                  : isChimera 
                    ? "例如: 希望有樱花飘落的效果、眼睛是星空色..."
                    : "例如: 添加闪闪发光的特效、背景改成粉色渐变..."
              }
              className={`
                w-full p-4 rounded-xl border text-sm resize-none transition-all
                placeholder:text-gray-300 focus:outline-none
                ${isChimera 
                  ? 'border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100' 
                  : 'border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100'
                }
              `}
              rows={3}
            />
            <p className="text-gray-400 text-xs">
              💡 输入额外的创意描述，AI 会尝试融入到生成结果中
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3">
              <AlertTriangle className="text-rose-500 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-rose-600 text-sm">{error}</p>
            </div>
          )}

          {/* Generate Button */}
          <div className="pt-4 space-y-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`
                w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3
                transition-all duration-300
                ${isGenerating 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : isChimera
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02]'
                    : 'bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-white hover:shadow-lg hover:shadow-pink-500/25 hover:scale-[1.02]'
                }
              `}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                  {isGeminiFeature ? 'Gemini AI 生成中...' : 'AI 正在生成中...'}
                </>
              ) : (
                <>
                  <Wand2 size={22} />
                  {isBangboo ? '生成邦布' : isChimera ? '生成奇美拉' : '开始生成'}
                  <Sparkles size={18} />
                </>
              )}
            </button>

            <button 
              onClick={goToPrevStep}
              disabled={isGenerating}
              className="w-full btn-secondary flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              返回修改
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleSelect;
