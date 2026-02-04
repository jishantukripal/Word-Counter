import React, { useState } from 'react';
import { type TextTransformType } from '../types';
import { 
  Type, 
  ALargeSmall, 
  Baseline, 
  Eraser, 
  Copy, 
  Check,
  Download, 
  FileImage,
  FileText
} from 'lucide-react';

interface ControlBarProps {
  onTransform: (type: TextTransformType) => void;
  onCopy: () => Promise<boolean>;
  onDownload: (format: 'pdf' | 'jpg') => void;
}

interface TooltipButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  active?: boolean;
}

const TooltipButton: React.FC<TooltipButtonProps> = ({ onClick, icon, label, danger, active }) => (
  <button
    onClick={onClick}
    className={`group relative p-2 rounded-lg transition-all duration-200 ${
      danger 
        ? 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' 
        : active 
          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-800'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400'
    }`}
    aria-label={label}
    title={label}
  >
    {React.isValidElement(icon) 
      ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-4 h-4" }) 
      : icon
    }
    <span className="sr-only">{label}</span>
  </button>
);

export const ControlBar: React.FC<ControlBarProps> = ({ 
  onTransform, 
  onCopy, 
  onDownload,
}) => {
  const [copied, setCopied] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const handleCopy = async () => {
    const success = await onCopy();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative flex flex-col border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-t-2xl z-20">
      
      <div className={`flex items-center justify-between px-4 py-2 transition-opacity duration-200 `}>
        <div className="flex items-center space-x-1">
          <TooltipButton 
            onClick={() => onTransform('UPPERCASE')} 
            icon={<Type />} 
            label="Uppercase" 
          />
          <TooltipButton 
            onClick={() => onTransform('lowercase')} 
            icon={<ALargeSmall />} 
            label="Lowercase" 
          />
          <TooltipButton 
            onClick={() => onTransform('Title Case')} 
            icon={<Baseline />} 
            label="Title Case" 
          />
          <div className="w-px h-4 bg-gray-200 dark:bg-slate-700 mx-2"></div>
          <TooltipButton 
            onClick={() => onTransform('Clean')} 
            icon={<Eraser />} 
            label="Clean Formatting"
            danger
          />
        </div>

        <div className="flex items-center space-x-2">
           
           
           <div className="relative">
             <TooltipButton 
               onClick={() => setShowDownloadMenu(!showDownloadMenu)} 
               icon={<Download />} 
               label="Download" 
               active={showDownloadMenu}
             />
             
             {showDownloadMenu && (
               <>
                 <div className="fixed inset-0 z-10" onClick={() => setShowDownloadMenu(false)}></div>
                 <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <button 
                      onClick={() => { onDownload('pdf'); setShowDownloadMenu(false); }}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <FileText className="w-4 h-4 mr-3 text-red-500" />
                      Export as PDF
                    </button>
                    <button 
                      onClick={() => { onDownload('jpg'); setShowDownloadMenu(false); }}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 border-t border-gray-100 dark:border-slate-700 transition-colors"
                    >
                      <FileImage className="w-4 h-4 mr-3 text-blue-500" />
                      Export as JPG
                    </button>
                 </div>
               </>
             )}
           </div>

           <div className="w-px h-4 bg-gray-200 dark:bg-slate-700 mx-1"></div>

           <button
            onClick={handleCopy}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
              copied 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
            }`}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};