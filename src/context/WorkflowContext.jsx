import { createContext, useContext, useState, useCallback } from 'react';

const WorkflowContext = createContext(null);

export const WorkflowProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Bangboo 专用状态
  const [selectedMood, setSelectedMood] = useState('default');
  const [selectedRenderStyle, setSelectedRenderStyle] = useState('cel-shaded');
  
  // Chimera 专用状态
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [selectedDecorations, setSelectedDecorations] = useState([]);

  const goToNextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  }, []);

  const goToPrevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  const resetWorkflow = useCallback(() => {
    setCurrentStep(1);
    setSelectedFunction(null);
    setUploadedImage(null);
    setSelectedStyles([]);
    setGeneratedResult(null);
    setIsProcessing(false);
    setSelectedMood('default');
    setSelectedRenderStyle('cel-shaded');
    setSelectedTheme('default');
    setSelectedDecorations([]);
  }, []);

  const toggleDecoration = useCallback((decorId) => {
    setSelectedDecorations(prev => 
      prev.includes(decorId) 
        ? prev.filter(id => id !== decorId)
        : [...prev, decorId]
    );
  }, []);

  const toggleStyle = useCallback((styleId) => {
    setSelectedStyles(prev => 
      prev.includes(styleId) 
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  }, []);

  const value = {
    currentStep,
    selectedFunction,
    uploadedImage,
    selectedStyles,
    generatedResult,
    isProcessing,
    selectedMood,
    selectedRenderStyle,
    selectedTheme,
    selectedDecorations,
    setCurrentStep,
    setSelectedFunction,
    setUploadedImage,
    setSelectedStyles,
    setGeneratedResult,
    setIsProcessing,
    setSelectedMood,
    setSelectedRenderStyle,
    setSelectedTheme,
    setSelectedDecorations,
    goToNextStep,
    goToPrevStep,
    goToStep,
    resetWorkflow,
    toggleStyle,
    toggleDecoration,
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};
