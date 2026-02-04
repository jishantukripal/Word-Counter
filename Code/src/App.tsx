import React, { useEffect, useState, useRef} from 'react';
import { useTextAnalyzer } from './hooks/useTextAnalyzer';
import { StatsDisplay } from './components/StatsDisplay';
import { KeywordList } from './components/KeywordList';
import { ControlBar } from './components/ControlBar';
import { downloadAsPDF, downloadAsJPG } from './utils/exportUtils';
import { Sun, Moon, Sparkles, Loader2 } from 'lucide-react';

const Header: React.FC<{ darkMode: boolean; toggleTheme: () => void }> = ({ darkMode, toggleTheme }) => (
  <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-gray-200 dark:border-slate-800 transition-colors duration-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="bg-indigo-600 p-1.5 rounded-lg shadow-md shadow-indigo-600/20">
           <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
          Word <span className="text-indigo-600 dark:text-indigo-400">Lab</span>
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  </header>
);

const App: React.FC = () => {
  // Theme Management - Default to LIGHT mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  // App Logic
  const { text, setText, stats, keywords, transformText, copyToClipboard, isAnalyzing } = useTextAnalyzer('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDownload = (format: 'pdf' | 'jpg') => {
    if (!text) return;
    if (format === 'pdf') {
      downloadAsPDF(text);
    } else {
      downloadAsJPG(text);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Header darkMode={darkMode} toggleTheme={toggleTheme} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Column: Editor */}
          <div className="lg:col-span-8 flex flex-col h-[calc(100vh-140px)] min-h-[600px]">
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-200 dark:border-slate-800 flex flex-col overflow-hidden relative group transition-colors duration-200">
              
              {/* Toolbar */}
              <ControlBar 
                onTransform={transformText} 
                onCopy={copyToClipboard}
                onDownload={handleDownload}
              />
              
              {/* Text Area */}
              <div className="relative flex-1">
                <textarea
                  ref={textareaRef}
                  className="w-full h-full p-8 bg-transparent border-none resize-none focus:ring-0 text-lg leading-relaxed text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-slate-700 font-serif outline-none"
                  placeholder="Start typing your masterpiece..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  spellCheck={true}
                  style={{ lineHeight: '1.6' }}
                />
                
                {/* Analyzing Indicator */}
                <div className={`absolute bottom-4 right-4 transition-opacity duration-300 pointer-events-none ${isAnalyzing ? 'opacity-100' : 'opacity-0'}`}>
                   <div className="bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center shadow-lg">
                      <Loader2 className="w-3 h-3 animate-spin mr-2" />
                      Analyzing...
                   </div>
                </div>
              </div>

              {/* Status Footer */}
              <div className="px-6 py-3 bg-gray-50 dark:bg-slate-950/50 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center font-mono select-none">
                 <div>
                   {stats.characters.toLocaleString()} characters <span className="mx-1">&bull;</span> {stats.words.toLocaleString()} words
                 </div>
                 <div>
                    {stats.readingTimeMinutes < 1 ? '< 1 min' : `${Math.ceil(stats.readingTimeMinutes)} min`} read
                 </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dashboard */}
          <div className="lg:col-span-4 space-y-6 h-full overflow-y-auto lg:sticky lg:top-24 scrollbar-hide pb-10">
            
             <StatsDisplay stats={stats} isAnalyzing={isAnalyzing} />
             
             <KeywordList keywords={keywords} />
             
             {/* Insight Card */}
             <div className="p-5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg transition-transform hover:scale-[1.02] duration-300">
               <h4 className="font-bold text-sm uppercase tracking-wide opacity-80 mb-2">Editor Insight</h4>
               <p className="text-sm leading-relaxed opacity-95">
                 Your text is currently at a <strong className="text-white border-b border-white/40">Grade {stats.fleschKincaidGrade.toFixed(1)}</strong> level. 
                 {stats.fleschKincaidGrade > 12 
                    ? ' Consider shortening sentences for better clarity.' 
                    : stats.fleschKincaidGrade < 6 
                      ? ' Good for general audiences.' 
                      : ' Balanced structure.'}
               </p>
             </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;