import React from 'react';
import { type TextStats } from '../types';
import { 
  Type, 
  Hash, 
  AlignLeft, 
  Clock, 
  GraduationCap, 
  BrainCircuit, 
  Mic,
  BookOpen,
  Info
} from 'lucide-react';

interface StatsDisplayProps {
  stats: TextStats;
  isAnalyzing: boolean;
}

const StatItem: React.FC<{
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  className?: string;
}> = ({ label, value, icon, className = "" }) => (
  <div className={`flex flex-col justify-between p-4 rounded-xl transition-all duration-300 ${className}`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</span>
      {icon && <div className="opacity-80">{icon}</div>}
    </div>
    <div className="text-2xl font-bold tracking-tight">{value}</div>
  </div>
);

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats, isAnalyzing }) => {
  const formatTime = (minutes: number) => {
    if (minutes < 1) {
      const seconds = Math.round(minutes * 60);
      return `${seconds}s`;
    }
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins}m ${secs}s`;
  };

  const gradeColor = stats.fleschKincaidGrade > 12 ? 'text-red-500' : stats.fleschKincaidGrade > 8 ? 'text-yellow-500' : 'text-green-500';

  return (
    <div className={`space-y-4 transition-opacity duration-300 ${isAnalyzing ? 'opacity-50' : 'opacity-100'}`}>
      
      <div className="grid grid-cols-2 gap-3">
        <StatItem 
          label="Words" 
          value={stats.words.toLocaleString()} 
          icon={<Type className="w-4 h-4" />}
          className="bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
        />
        <StatItem 
          label="Chars" 
          value={stats.characters.toLocaleString()} 
          icon={<Hash className="w-4 h-4" />}
          className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-1"><AlignLeft className="w-4 h-4 mx-auto" /></div>
          <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{stats.sentences}</div>
          <div className="text-[10px] text-gray-400 uppercase font-medium">Sentences</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-1"><BookOpen className="w-4 h-4 mx-auto" /></div>
          <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{stats.paragraphs}</div>
          <div className="text-[10px] text-gray-400 uppercase font-medium">Paragraphs</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm text-center">
           <div className="text-gray-400 dark:text-gray-500 mb-1"><BrainCircuit className="w-4 h-4 mx-auto" /></div>
           <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{stats.lexicalDensity.toFixed(0)}%</div>
           <div className="text-[10px] text-gray-400 uppercase font-medium">Density</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-visible z-10 relative">
        <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-purple-500" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">Readability</span>
          </div>
          
          <div className="group relative flex items-center cursor-help">
            <span className={`text-xl font-bold ${gradeColor} mr-2`}>
              Grade {stats.fleschKincaidGrade.toFixed(1)}
            </span>
            <Info className="w-4 h-4 text-gray-400 hover:text-indigo-500 transition-colors" />
            
            <div className="absolute bottom-full right-0 mb-3 w-72 p-4 bg-slate-900 text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
               <div className="font-bold text-sm mb-2 text-indigo-300">Flesch-Kincaid Grade Level</div>
               <p className="mb-3 opacity-90 leading-relaxed">Estimates the US school grade level required to understand the text.</p>
               <div className="font-mono bg-slate-950 p-3 rounded-lg text-gray-400 border border-slate-800">
                 <div className="flex justify-between mb-1">
                   <span>0.39</span> <span>× (words/sentences)</span>
                 </div>
                 <div className="flex justify-between mb-1">
                   <span>+ 11.8</span> <span>× (syllables/words)</span>
                 </div>
                 <div className="flex justify-between">
                   <span>- 15.59</span>
                 </div>
               </div>
               <div className="absolute top-full right-4 -mt-2 border-8 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 divide-x divide-gray-100 dark:divide-slate-700 relative z-0">
          <div className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg text-pink-500">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Reading</p>
              <p className="font-semibold text-gray-700 dark:text-gray-200">{formatTime(stats.readingTimeMinutes)}</p>
            </div>
          </div>
          <div className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-500">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Speaking</p>
              <p className="font-semibold text-gray-700 dark:text-gray-200">{formatTime(stats.speakingTimeMinutes)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};