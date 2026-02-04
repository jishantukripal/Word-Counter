import React from 'react';
import { type Keyword } from '../types';
import { Tags } from 'lucide-react';

interface KeywordListProps {
  keywords: Keyword[];
}

export const KeywordList: React.FC<KeywordListProps> = ({ keywords }) => {
  if (keywords.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 flex items-center space-x-2">
        <Tags className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Top Keywords</h3>
      </div>
      
      <div className="p-2">
        {keywords.map((kw, idx) => (
          <div key={kw.word} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg group transition-colors">
            <div className="flex items-center space-x-3 flex-1">
              <span className="text-xs font-mono text-gray-400 w-4 text-center">{idx + 1}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{kw.word}</span>
            </div>
            
            <div className="flex items-center space-x-3 w-1/2 justify-end">
              <div className="w-20 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full opacity-70 group-hover:opacity-100 transition-all"
                  style={{ width: `${Math.min(100, (kw.count / keywords[0].count) * 100)}%` }}
                />
              </div>
              <span className="text-xs font-mono font-semibold text-gray-500 dark:text-gray-400 w-6 text-right">{kw.count}</span>
            </div>
          </div>
        ))}
        <div className="mt-2 text-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Common words ignored</span>
        </div>
      </div>
    </div>
  );
};