export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
  fleschKincaidGrade: number;
  lexicalDensity: number;
}

export interface Keyword {
  word: string;
  count: number;
}

export interface AnalysisResult {
  stats: TextStats;
  topKeywords: Keyword[];
}

export type TextTransformType = 'UPPERCASE' | 'lowercase' | 'Title Case' | 'Clean';
