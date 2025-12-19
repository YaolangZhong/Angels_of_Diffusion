import { Smile, Bot, Cat, ArrowRight, Sparkles, Cpu } from 'lucide-react';
import { WORKFLOW_OPTIONS } from '../../config/workflowData';
import { useWorkflow } from '../../context/WorkflowContext';

const iconMap = {
  Smile: Smile,
  Bot: Bot,
  Cat: Cat,
};

// 功能卡片位置配置 (围绕中心书包)
const cardPositions = [
  { 
    // 左上
    position: 'lg:absolute lg:left-0 lg:top-0',
    delay: '0ms'
  },
  { 
    // 右上
    position: 'lg:absolute lg:right-0 lg:top-0',
    delay: '100ms'
  },
  { 
    // 下方居中
    position: 'lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2',
    delay: '200ms'
  }
];

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

  const options = Object.values(WORKFLOW_OPTIONS);

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
          点击功能卡片，开启你的 AI 图像转换之旅
        </p>
      </div>

      {/* Function Cards Layout */}
      <div className="max-w-4xl mx-auto">
        {/* 功能卡片 - 响应式网格 */}
        <div className="grid gap-4 md:grid-cols-3">
          {options.map((option, index) => (
            <FunctionCard 
              key={option.id}
              option={option}
              isSelected={selectedFunction === option.id}
              onSelect={handleSelect}
              delay={cardPositions[index].delay}
            />
          ))}
        </div>
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

// 提取功能卡片为独立组件
const FunctionCard = ({ option, isSelected, onSelect, delay }) => {
  const IconComponent = iconMap[option.icon] || Smile;
  
  // 根据功能类型设置主题色
  const getThemeColors = () => {
    if (option.id === 'hsr_chimera') {
      return {
        selected: 'from-amber-50 to-orange-50 border-amber-300 shadow-amber-500/10',
        tag: 'bg-amber-100 text-amber-600 border-amber-200',
        badge: 'bg-orange-100 text-orange-600 border-orange-200',
        icon: 'from-amber-500 to-orange-500',
        title: 'text-amber-600'
      };
    }
    return {
      selected: 'from-pink-50 to-violet-50 border-pink-300 shadow-pink-500/10',
      tag: 'bg-pink-100 text-pink-600 border-pink-200',
      badge: 'bg-violet-100 text-violet-600 border-violet-200',
      icon: 'from-pink-500 to-violet-500',
      title: 'text-pink-600'
    };
  };
  
  const theme = getThemeColors();

  return (
    <div
      onClick={() => onSelect(option.id)}
      style={{ animationDelay: delay }}
      className={`
        group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 animate-slideUp
        ${isSelected 
          ? `bg-gradient-to-br ${theme.selected} border-2 shadow-xl` 
          : 'bg-white/90 backdrop-blur-sm border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:scale-[1.02]'
        }
      `}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r ${theme.icon} rounded-full flex items-center justify-center shadow-lg`}>
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
          ${isSelected 
            ? `bg-gradient-to-r ${theme.icon} text-white shadow-lg` 
            : 'bg-gray-100 text-gray-400 group-hover:text-pink-500'
          }
          transition-all duration-300
        `}>
          <IconComponent size={24} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold mb-1 font-display ${isSelected ? theme.title : 'text-gray-900'}`}>
            {option.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
            {option.description}
          </p>

          {/* Style tags preview */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {option.useGemini ? (
              <>
                {(option.moods || option.themes)?.slice(0, 2).map((item) => (
                  <span
                    key={item.id}
                    className={`
                      px-2 py-0.5 text-xs rounded-full border
                      ${isSelected ? theme.tag : 'bg-gray-100 text-gray-500 border-transparent'}
                    `}
                  >
                    {item.emoji} {item.label}
                  </span>
                ))}
                <span className={`
                  px-2 py-0.5 text-xs rounded-full flex items-center gap-1 border
                  ${isSelected ? theme.badge : 'bg-gray-100 text-gray-500 border-transparent'}
                `}>
                  <Cpu size={10} /> Gemini
                </span>
              </>
            ) : (
              option.styles?.slice(0, 3).map((style) => (
                <span
                  key={style.id}
                  className={`
                    px-2 py-0.5 text-xs rounded-full border
                    ${isSelected ? theme.tag : 'bg-gray-100 text-gray-500 border-transparent'}
                  `}
                >
                  {style.emoji} {style.label}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionSelect;
