import { Smile, Bot, Cat, ArrowRight, Sparkles, Cpu } from 'lucide-react';
import { WORKFLOW_OPTIONS } from '../../config/workflowData';
import { useWorkflow } from '../../context/WorkflowContext';

const iconMap = {
  Smile: Smile,
  Bot: Bot,
  Cat: Cat,
};

const FunctionSelect = () => {
  const { selectedFunction, setSelectedFunction, goToNextStep, setSelectedStyles } = useWorkflow();

  const handleSelect = (funcId) => {
    setSelectedFunction(funcId);
    setSelectedStyles([]);
  };

  const handleContinue = () => {
    if (selectedFunction) {
      goToNextStep();
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-50 border border-pink-100 rounded-full text-pink-600 text-sm font-medium">
          <Sparkles size={14} />
          <span>开始你的创作之旅</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-display">
          选择转换类型
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          选择你想要的 AI 图像转换功能，我们将引导你完成整个创作流程
        </p>
      </div>

      {/* Function Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {Object.values(WORKFLOW_OPTIONS).map((option) => {
          const IconComponent = iconMap[option.icon] || Smile;
          const isSelected = selectedFunction === option.id;

          return (
            <div
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`
                group relative p-6 rounded-2xl cursor-pointer transition-all duration-300
                ${isSelected 
                  ? 'bg-gradient-to-br from-pink-50 to-violet-50 border-2 border-pink-300 shadow-xl shadow-pink-500/10' 
                  : 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg'
                }
              `}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}

              {/* Icon */}
              <div className={`
                w-14 h-14 rounded-xl flex items-center justify-center mb-4
                ${isSelected 
                  ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white' 
                  : 'bg-gray-100 text-gray-400 group-hover:text-pink-500'
                }
                transition-all duration-300
              `}>
                <IconComponent size={28} />
              </div>

              {/* Content */}
              <h3 className={`text-xl font-semibold mb-2 font-display ${isSelected ? 'text-pink-600' : 'text-gray-900'}`}>
                {option.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {option.description}
              </p>

              {/* Style tags preview */}
              <div className="flex flex-wrap gap-2 mt-4">
                {option.useGemini ? (
                  // Gemini 功能显示对应选项
                  <>
                    {/* 邦布显示心情，奇美拉显示主题 */}
                    {(option.moods || option.themes)?.slice(0, 3).map((item) => (
                      <span
                        key={item.id}
                        className={`
                          px-2.5 py-1 text-xs rounded-full
                          ${isSelected 
                            ? option.id === 'hsr_chimera'
                              ? 'bg-amber-100 text-amber-600 border border-amber-200'
                              : 'bg-pink-100 text-pink-600 border border-pink-200' 
                            : 'bg-gray-100 text-gray-500'
                          }
                        `}
                      >
                        {item.emoji} {item.label}
                      </span>
                    ))}
                    <span className={`
                      px-2.5 py-1 text-xs rounded-full flex items-center gap-1
                      ${isSelected 
                        ? option.id === 'hsr_chimera'
                          ? 'bg-orange-100 text-orange-600 border border-orange-200'
                          : 'bg-violet-100 text-violet-600 border border-violet-200' 
                        : 'bg-gray-100 text-gray-500'
                      }
                    `}>
                      <Cpu size={12} /> Gemini AI
                    </span>
                  </>
                ) : (
                  option.styles?.map((style) => (
                    <span
                      key={style.id}
                      className={`
                        px-2.5 py-1 text-xs rounded-full
                        ${isSelected 
                          ? 'bg-pink-100 text-pink-600 border border-pink-200' 
                          : 'bg-gray-100 text-gray-500'
                        }
                      `}
                    >
                      {style.emoji} {style.label}
                    </span>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleContinue}
          disabled={!selectedFunction}
          className="btn-primary flex items-center gap-2 text-lg"
        >
          继续下一步
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default FunctionSelect;
