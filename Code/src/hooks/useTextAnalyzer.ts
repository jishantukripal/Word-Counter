import { useState, useEffect, useMemo, useCallback } from 'react';
import { type TextStats, type Keyword, type TextTransformType } from '../types';
import { analyzeText } from '../utils/textAnalysis';

interface UseTextAnalyzerReturn {
  text: string;
  setText: (text: string) => void;
  stats: TextStats;
  keywords: Keyword[];
  transformText: (type: TextTransformType) => void;
  copyToClipboard: () => Promise<boolean>;
  isAnalyzing: boolean;
}

export const useTextAnalyzer = (initialText: string = ''): UseTextAnalyzerReturn => {
  // Initialize state from local storage or default
  const [text, setTextState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('word_lab_content');
      return saved !== null ? saved : initialText;
    }
    return initialText;
  });

  const [debouncedText, setDebouncedText] = useState(text);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Persist to local storage whenever text changes
  useEffect(() => {
    localStorage.setItem('word_lab_content', text);
  }, [text]);

  // FIX 1: Wrapper to handle text updates and start loading state immediately
  const setText = (newText: string) => {
    setTextState(newText);
    setIsAnalyzing(true);
  };

  // FIX 2: Effect only handles the "Stop" logic (Debounce)
  useEffect(() => {
    // We do NOT set isAnalyzing(true) here anymore.
    
    const handler = setTimeout(() => {
      setDebouncedText(text);
      setIsAnalyzing(false); // We only turn it off here
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [text]);

  // Run analysis on the DEBOUNCED text
  const { stats, keywords } = useMemo(() => analyzeText(debouncedText), [debouncedText]);

  const transformText = useCallback((type: TextTransformType) => {
    // FIX 3: Also trigger analyzing state when transforming
    setIsAnalyzing(true);
    
    setTextState((currentText) => {
      switch (type) {
        case 'UPPERCASE':
          return currentText.toUpperCase();
        case 'lowercase':
          return currentText.toLowerCase();
        case 'Title Case':
          return currentText.replace(
            /\b\w+/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          );
        case 'Clean':
          return currentText
            .replace(/\s+/g, ' ') 
            .replace(/^\s+|\s+$/g, '') 
            .replace(/\n\s*\n/g, '\n\n'); 
        default:
          return currentText;
      }
    });
  }, []);

  const copyToClipboard = useCallback(async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  }, [text]);

  return {
    text,
    setText, // Exposing our wrapper function
    stats,
    keywords,
    transformText,
    copyToClipboard,
    isAnalyzing
  };
};