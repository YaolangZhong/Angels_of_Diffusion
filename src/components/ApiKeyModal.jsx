import { useState, useEffect } from 'react';
import { X, Key, Check } from 'lucide-react';
import { getApiKey, saveApiKey } from '../services/geminiService';

const ApiKeyModal = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      setApiKey(getApiKey());
    }
  }, [isOpen]);

  const handleSave = () => {
    saveApiKey(apiKey.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-pink-500" />
              设置 API Key
            </h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gemini API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="在此粘贴您的 API Key"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
              />
              <p className="mt-2 text-xs text-gray-500">
                Key 将存储在本地浏览器中，不会上传到服务器。
                <br />
                还没有 Key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline">去获取一个</a>
              </p>
            </div>
            
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Check size={18} />
              保存设置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
