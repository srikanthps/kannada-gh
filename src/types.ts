export interface WordExample {
  word: string;
  transliteration: string;
  meaning: string;
}

export interface LetterItem {
  letter: string;
  transliteration: string;
  pronunciation: string;
  name: string;
  type: 'vowel' | 'consonant' | 'yogavaha';
  examples: WordExample[];
}

export interface KagunithaCombination {
  letter: string;
  vowelSign: string;
  transliteration: string;
  pronunciation: string;
}

export interface KagunithaRow {
  consonant: string;
  combinations: KagunithaCombination[];
}

export interface OttaksharaItem {
  letter: string;
  ottu: string;
  name: string;
  transliteration: string;
  examples: {
    word: string;
    breakdown: string;
    transliteration: string;
    meaning: string;
  }[];
}

export interface VocabularyItem {
  word: string;
  transliteration: string;
  meaning: string;
}

export interface Story {
  id: number;
  title: string;
  titleEn: string;
  paragraphs: string[];
  transliteration: string[];
  translation: string[];
  vocabulary: VocabularyItem[];
}

export interface Poem {
  id: number;
  title: string;
  titleEn: string;
  verses: string[];
  transliteration: string[];
  translation: string[];
  vocabulary: VocabularyItem[];
}
