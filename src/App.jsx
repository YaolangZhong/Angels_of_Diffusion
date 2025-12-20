import { Github, Key } from 'lucide-react';
import { WorkflowProvider, useWorkflow } from './context/WorkflowContext';
import Stepper from './components/Stepper';
import FunctionSelect from './components/steps/FunctionSelect';
import ImageUpload from './components/steps/ImageUpload';
import StyleSelect from './components/steps/StyleSelect';
import DeliveryView from './components/steps/DeliveryView';
import EmojiCutView from './components/steps/EmojiCutView';
import ApiKeyModal from './components/ApiKeyModal';
import { useState } from 'react';

const WorkflowContent = () => {
  const { currentStep, selectedFunction } = useWorkflow();
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <FunctionSelect />;
      case 2:
        return <ImageUpload />;
      case 3:
        return <StyleSelect />;
      case 4:
        // 表情包功能使用 EmojiCutView 进行切图打包
        if (selectedFunction === 'wechat_emoji') {
          return <EmojiCutView />;
        }
        return <DeliveryView />;
      default:
        return <FunctionSelect />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200/50 backdrop-blur-xl bg-white/70 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="/assets/avatar.png" 
                alt="Angels of Diffusion" 
                className="w-10 h-10 rounded-xl shadow-lg shadow-pink-500/20 object-cover"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900 font-display">Angels of Diffusion</h1>
                <p className="text-xs text-gray-500">AI 图像工作流</p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsApiKeyModalOpen(true)}
                className="p-2 rounded-lg text-gray-400 hover:text-pink-500 hover:bg-pink-50 transition-colors"
                title="设置 API Key"
              >
                <Key size={20} />
              </button>
              
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Stepper */}
          <Stepper />

          {/* Step Content */}
          <div className="mt-8">
            {renderStep()}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 py-6 mt-auto bg-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Powered by <span className="text-pink-500 font-medium">Angels of Diffusion</span> • Made with ❤️
          </p>
        </div>
      </footer>

      {/* Modals */}
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onClose={() => setIsApiKeyModalOpen(false)} 
      />
    </div>
  );
};

const App = () => {
  return (
    <WorkflowProvider>
      <WorkflowContent />
    </WorkflowProvider>
  );
};

export default App;
