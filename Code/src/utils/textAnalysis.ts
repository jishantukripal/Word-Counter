import { type Keyword, type TextStats } from '../types';

export const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'cannot', 'could', 'couldn\'t',
  'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each',
  'few', 'for', 'from', 'further',
  'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
  'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
  'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself',
  'no', 'nor', 'not',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
  'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up',
  'very',
  'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t',
  'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

const countSyllables = (word: string): number => {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
};

export const analyzeText = (text: string): { stats: TextStats; keywords: Keyword[] } => {
  if (!text.trim()) {
    return {
      stats: {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
        fleschKincaidGrade: 0,
        lexicalDensity: 0,
      },
      keywords: [],
    };
  }

  // Basic Counts
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
  
  // Word processing
  // Match words including those with apostrophes, but strip leading/trailing non-alphanumeric chars
  const wordsRaw = text.match(/\b[\w']+\b/g) || [];
  const wordsCount = wordsRaw.length;

  // Sentence processing
  // Split by common sentence terminators (. ! ?) followed by space or end of string
  const sentences = text.split(/[.!?]+(?:\s+|$)/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length || 1; // Avoid division by zero

  // Syllable processing for Flesch-Kincaid
  let totalSyllables = 0;
  wordsRaw.forEach(w => {
    totalSyllables += countSyllables(w);
  });

  // Calculations
  // Flesch-Kincaid Grade Level = 0.39 * (total words / total sentences) + 11.8 * (total syllables / total words) - 15.59
  const avgWordsPerSentence = wordsCount / sentenceCount;
  const avgSyllablesPerWord = wordsCount > 0 ? totalSyllables / wordsCount : 0;
  const fleschKincaid = wordsCount > 0 
    ? (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59
    : 0;

  // Time estimates
  // Reading: ~238 wpm (average adult)
  // Speaking: ~130 wpm
  const readingTime = wordsCount / 238;
  const speakingTime = wordsCount / 130;

  // Keyword Analysis & Lexical Density
  const frequencyMap: Record<string, number> = {};
  const uniqueWords = new Set<string>();

  wordsRaw.forEach(word => {
    const lower = word.toLowerCase();
    uniqueWords.add(lower);
    if (!STOP_WORDS.has(lower) && lower.length > 1 && !/^\d+$/.test(lower)) {
      frequencyMap[lower] = (frequencyMap[lower] || 0) + 1;
    }
  });

  const lexicalDensity = wordsCount > 0 ? (uniqueWords.size / wordsCount) * 100 : 0;

  const keywords: Keyword[] = Object.entries(frequencyMap)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    stats: {
      words: wordsCount,
      characters,
      charactersNoSpaces,
      sentences: sentenceCount,
      paragraphs,
      readingTimeMinutes: readingTime,
      speakingTimeMinutes: speakingTime,
      fleschKincaidGrade: Math.max(0, fleschKincaid), // Clamp to 0
      lexicalDensity,
    },
    keywords,
  };
};
