import { useState } from 'react';
import { Download, Edit2, Check, Sparkles } from 'lucide-react';

const StickerCard = ({ segment, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(segment.name);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = segment.dataUrl;
    link.download = `${segment.name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveName = () => {
    onRename(segment.id, tempName);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') saveName();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex flex-col items-center gap-2 transition-all hover:shadow-md group relative">
      {/* 透明背景预览 */}
      <div 
        className="w-full aspect-square flex items-center justify-center rounded-lg overflow-hidden p-2"
        style={{
          backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
          backgroundColor: '#fff'
        }}
      >
        <img 
          src={segment.dataUrl} 
          alt={segment.name} 
          className="max-w-full max-h-full object-contain transition-transform group-hover:scale-110" 
        />
      </div>

      {/* 文件名编辑 */}
      <div className="w-full flex items-center justify-between gap-2 h-8">
        {isEditing ? (
          <div className="flex items-center gap-1 w-full">
            <input 
              autoFocus
              type="text" 
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-xs border border-pink-300 rounded px-2 py-1 outline-none text-gray-700 focus:border-pink-500"
            />
            <button onClick={saveName} className="text-green-600 hover:bg-green-50 p-1 rounded">
              <Check size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 w-full overflow-hidden">
            {segment.isNaming ? (
              <div className="flex items-center gap-1.5 text-xs text-pink-600 font-medium animate-pulse">
                <Sparkles size={12} />
                <span>AI 命名中...</span>
              </div>
            ) : (
              <>
                <span 
                  className="text-xs font-medium text-gray-700 truncate cursor-pointer hover:text-pink-600 flex-1"
                  onClick={() => setIsEditing(true)}
                  title={segment.name}
                >
                  {segment.name}
                </span>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 size={12} />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* 下载按钮 */}
      <button 
        onClick={handleDownload}
        className="absolute top-2 right-2 bg-white/90 hover:bg-pink-500 hover:text-white text-gray-600 shadow-sm border border-gray-200 p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
        title="下载 PNG"
      >
        <Download size={14} />
      </button>
    </div>
  );
};

export default StickerCard;

