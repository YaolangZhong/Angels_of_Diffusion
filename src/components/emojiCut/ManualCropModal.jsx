import { useRef, useState } from 'react';
import { X, Check, Crop } from 'lucide-react';

const ManualCropModal = ({ imageUrl, onClose, onConfirm }) => {
  const imgRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [currentRect, setCurrentRect] = useState(null);

  const getImageCoordinates = (e) => {
    if (!imgRef.current) return null;
    
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    
    // 处理触摸或鼠标
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // 缩放到原始图片尺寸
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    return {
      x: Math.max(0, Math.min(img.naturalWidth, x * scaleX)),
      y: Math.max(0, Math.min(img.naturalHeight, y * scaleY))
    };
  };

  const handleStart = (e) => {
    e.preventDefault();
    const coords = getImageCoordinates(e);
    if (coords) {
      setIsDrawing(true);
      setStartPos(coords);
      setCurrentRect({ minX: coords.x, maxX: coords.x, minY: coords.y, maxY: coords.y });
    }
  };

  const handleMove = (e) => {
    if (!isDrawing || !startPos) return;
    e.preventDefault();
    
    const coords = getImageCoordinates(e);
    if (coords) {
      setCurrentRect({
        minX: Math.min(startPos.x, coords.x),
        maxX: Math.max(startPos.x, coords.x),
        minY: Math.min(startPos.y, coords.y),
        maxY: Math.max(startPos.y, coords.y)
      });
    }
  };

  const handleEnd = () => {
    setIsDrawing(false);
  };

  const handleConfirm = () => {
    if (currentRect && (currentRect.maxX - currentRect.minX > 5) && (currentRect.maxY - currentRect.minY > 5)) {
      onConfirm(currentRect);
    }
  };

  // 计算选择框的 CSS 样式
  const getOverlayStyle = () => {
    if (!currentRect || !imgRef.current) return {};
    
    const nw = imgRef.current.naturalWidth;
    const nh = imgRef.current.naturalHeight;
    
    const left = (currentRect.minX / nw) * 100;
    const top = (currentRect.minY / nh) * 100;
    const width = ((currentRect.maxX - currentRect.minX) / nw) * 100;
    const height = ((currentRect.maxY - currentRect.minY) / nh) * 100;

    return {
      left: `${left}%`,
      top: `${top}%`,
      width: `${width}%`,
      height: `${height}%`
    };
  };

  return (
    <div className="fixed inset-0 z-[60] bg-gray-900/90 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl flex items-center justify-between mb-4 text-white">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Crop className="w-5 h-5" /> 手动选择区域
          </h3>
          <p className="text-sm text-gray-300">点击并拖动以选择一个表情</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X />
        </button>
      </div>

      <div 
        className="relative max-h-[70vh] overflow-hidden rounded-lg shadow-2xl border border-gray-700"
        style={{
          backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)',
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
          backgroundColor: '#222'
        }}
      >
        <img 
          ref={imgRef}
          src={imageUrl} 
          alt="Original" 
          className="max-w-full max-h-[70vh] object-contain select-none cursor-crosshair touch-none"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          draggable={false}
        />
        
        {/* 选择框 */}
        {currentRect && (
          <div 
            className="absolute border-2 border-pink-500 bg-pink-500/20 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] pointer-events-none"
            style={getOverlayStyle()}
          >
            <div className="absolute top-0 left-0 -mt-8 bg-pink-600 text-white text-xs px-2 py-1 rounded">
              选区
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <button 
          onClick={onClose}
          className="px-6 py-2 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-800 transition-colors"
        >
          取消
        </button>
        <button 
          onClick={handleConfirm}
          disabled={!currentRect}
          className="px-6 py-2 rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Check size={18} />
          添加表情
        </button>
      </div>
    </div>
  );
};

export default ManualCropModal;

