import { useState, useRef, useCallback } from 'react';
import { Upload, X, ArrowLeft, ArrowRight, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { WORKFLOW_OPTIONS } from '../../config/workflowData';

const ImageUpload = () => {
  const { selectedFunction, uploadedImage, setUploadedImage, goToNextStep, goToPrevStep } = useWorkflow();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const config = WORKFLOW_OPTIONS[selectedFunction];

  const handleFile = useCallback((file) => {
    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件 (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('图片大小不能超过 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage({
        file,
        preview: e.target.result,
        base64: e.target.result,
      });
    };
    reader.onerror = () => {
      setError('读取图片失败，请重试');
    };
    reader.readAsDataURL(file);
  }, [setUploadedImage]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    setUploadedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [setUploadedImage]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-display">
          上传你的照片
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          上传一张清晰的真人照片，AI 将基于此图进行 <span className="text-pink-500 font-medium">{config?.title}</span> 转换
        </p>
      </div>

      {/* Upload Area */}
      <div className="max-w-2xl mx-auto">
        {!uploadedImage ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300
              ${isDragging 
                ? 'border-pink-400 bg-pink-50' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`
                w-16 h-16 rounded-xl flex items-center justify-center transition-colors
                ${isDragging ? 'bg-pink-100 text-pink-500' : 'bg-gray-100 text-gray-400'}
              `}>
                <Upload size={32} />
              </div>
              
              <div>
                <p className="text-gray-700 font-medium mb-1">
                  拖放图片到此处，或 <span className="text-pink-500">点击上传</span>
                </p>
                <p className="text-gray-400 text-sm">
                  支持 JPG、PNG、WebP 格式，最大 10MB
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-lg">
            {/* Preview Image */}
            <div className="relative aspect-square max-h-[400px] flex items-center justify-center bg-gray-50">
              <img
                src={uploadedImage.preview}
                alt="Uploaded preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Image Info Bar */}
            <div className="p-4 flex items-center justify-between border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <p className="text-gray-900 font-medium text-sm truncate max-w-[200px]">
                    {uploadedImage.file.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {(uploadedImage.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleRemove}
                className="p-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-3">
            <AlertCircle className="text-rose-500 flex-shrink-0" size={20} />
            <p className="text-rose-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 pt-4">
        <button onClick={goToPrevStep} className="btn-secondary flex items-center gap-2">
          <ArrowLeft size={20} />
          返回上一步
        </button>
        <button
          onClick={goToNextStep}
          disabled={!uploadedImage}
          className="btn-primary flex items-center gap-2"
        >
          继续下一步
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;
