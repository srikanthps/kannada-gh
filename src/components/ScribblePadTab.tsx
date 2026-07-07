import React, { useState, useEffect } from 'react';
import PracticeCanvas from './PracticeCanvas';
import { dictionaryWords, DictionaryWord } from '../data/dictionary';
import { Volume2, Sparkles, Check, Smile, Star, Shuffle, BookOpen, PenTool, Type, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const categories = [
  { id: 'All', name: 'All Words', nativeName: 'ಎಲ್ಲ ಪದಗಳು' },
  { id: 'Animals', name: 'Animals', nativeName: 'ಪ್ರಾಣಿಗಳು' },
  { id: 'Birds', name: 'Birds', nativeName: 'ಪಕ್ಷಿಗಳು' },
  { id: 'Fruits', name: 'Fruits', nativeName: 'ಹಣ್ಣುಗಳು' },
  { id: 'Vegetables', name: 'Vegetables', nativeName: 'ತರಕಾರಿಗಳು' },
  { id: 'Flowers', name: 'Flowers', nativeName: 'ಹೂವುಗಳು' },
  { id: 'Nature', name: 'Nature', nativeName: 'ಪರಿಸರ' },
  { id: 'Household', name: 'Household', nativeName: 'ಮನೆ ವಸ್ತುಗಳು' },
  { id: 'Family', name: 'Family', nativeName: 'ಕುಟುಂಬ' },
  { id: 'Colors', name: 'Colors', nativeName: 'ಬಣ್ಣಗಳು' },
  { id: 'Body Parts', name: 'Body Parts', nativeName: 'ದೇಹದ ಭಾಗಗಳು' },
  { id: 'Food', name: 'Food / Sweets', nativeName: 'ಆಹಾರ' },
  { id: 'Time', name: 'Time', nativeName: 'ಸಮಯ' },
  { id: 'Numbers', name: 'Numbers', nativeName: 'ಸಂಖ್ಯೆಗಳು' },
  { id: 'Places', name: 'Places', nativeName: 'ಸ್ಥಳಗಳು' },
  { id: 'General', name: 'Useful Words', nativeName: 'ಸಾಮಾನ್ಯ ಪದಗಳು' },
];

export default function ScribblePadTab() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [displayedWords, setDisplayedWords] = useState<DictionaryWord[]>([]);
  const [selectedWord, setSelectedWord] = useState<DictionaryWord | null>(null);
  const [customText, setCustomText] = useState('');
  const [traceMode, setTraceMode] = useState<'kannada' | 'transliteration'>('kannada');
  const [showSparkles, setShowSparkles] = useState(false);

  // Roll exactly 5 random words from the selected category
  const rollWords = (category: string = selectedCategory) => {
    let source = dictionaryWords;
    if (category !== 'All') {
      source = dictionaryWords.filter(w => w.category === category);
    }
    
    if (source.length === 0) {
      source = dictionaryWords;
    }

    // Shuffle and pick 5 distinct words
    const shuffled = [...source].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    setDisplayedWords(selected);
    
    if (selected.length > 0) {
      setSelectedWord(selected[0]);
    }
  };

  // Roll words on initial mount or when category changes
  useEffect(() => {
    rollWords(selectedCategory);
  }, [selectedCategory]);

  const handleWordSelect = (word: DictionaryWord) => {
    setSelectedWord(word);
    setCustomText(''); // Clear custom input when preset selected
    playTTS(word.word);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customText.trim()) {
      const customObj: DictionaryWord = {
        word: customText.trim(),
        transliteration: customText.trim(),
        meaning: 'Custom practice text',
        category: 'Custom'
      };
      setSelectedWord(customObj);
      playTTS(customText.trim());
    }
  };

  const playTTS = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to read in Kannada language
      utterance.lang = 'kn-IN';
      const voices = window.speechSynthesis.getVoices();
      const knVoice = voices.find(v => v.lang.toLowerCase().includes('kn') || v.lang.toLowerCase().includes('kannada'));
      if (knVoice) {
        utterance.voice = knVoice;
      }
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error(e);
    }
  };

  const triggerSuccessBurst = () => {
    setShowSparkles(true);
    playTTS("ಅದ್ಭುತ"); // Kannada for "Excellent"
    setTimeout(() => {
      setShowSparkles(false);
    }, 1800);
  };

  return (
    <div className="flex flex-col gap-6 relative w-full max-w-7xl mx-auto">
      {/* Sparkle burst overlay */}
      <AnimatePresence>
        {showSparkles && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/85 backdrop-blur-xs rounded-3xl"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-amber-500 mb-4"
            >
              <Sparkles size={100} className="fill-amber-400" />
            </motion.div>
            <h3 className="text-4xl font-black text-amber-950 tracking-tight drop-shadow-sm text-center">
              ತುಂಬಾ ಒಳ್ಳೆಯದು! (Very Good!) 🌟
            </h3>
            <p className="text-lg font-bold text-emerald-700 mt-2">Beautifully traced! Keep practicing!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 1: Categories & Word Randomizer Hub */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
        
        {/* Header and Shuffler */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black text-amber-950 uppercase tracking-widest flex items-center gap-2">
              <Star className="text-amber-500 fill-amber-500" size={16} />
              <span>Scribble word generator (ಪದಗಳ ಆಟ)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose a category, get 5 random words, or type a custom word below!
            </p>
          </div>
          
          <button
            onClick={() => rollWords(selectedCategory)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-black rounded-2xl shadow-sm transition"
          >
            <Shuffle size={14} className="animate-spin-slow" />
            <span>Roll 5 New Words (ಹೊಸ ಪದಗಳು)</span>
          </button>
        </div>

        {/* Category Pills Scroller */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none items-center">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-amber-100 border-amber-300 text-amber-900 font-extrabold'
                    : 'bg-slate-50 border-slate-200/60 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <span>{cat.name} </span>
                <span className="text-[10px] opacity-75 font-normal">({cat.nativeName})</span>
              </button>
            );
          })}
        </div>

        {/* The 5 Randomized Active Words */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
            Tap to Load into Writing Pad:
          </span>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {displayedWords.map((wordObj) => {
              const isSelected = selectedWord?.word === wordObj.word;
              return (
                <button
                  key={wordObj.word}
                  onClick={() => handleWordSelect(wordObj)}
                  className={`flex flex-col p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-amber-500 border-amber-600 text-white shadow-md scale-[1.03] ring-2 ring-amber-400 ring-offset-1'
                      : 'bg-slate-50 border-slate-200 hover:border-amber-300 text-slate-800 hover:bg-amber-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 w-full">
                    <span className="text-lg font-black tracking-wide truncate">{wordObj.word}</span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {wordObj.category}
                    </span>
                  </div>
                  
                  <span className={`text-[11px] font-mono mt-1 font-semibold truncate ${
                    isSelected ? 'text-amber-50 font-bold' : 'text-slate-400'
                  }`}>
                    /{wordObj.transliteration}/
                  </span>
                  
                  <span className={`text-[10px] mt-0.5 truncate ${
                    isSelected ? 'text-amber-100' : 'text-slate-500'
                  }`}>
                    {wordObj.meaning}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center border-t border-slate-100 pt-4 mt-1">
          <label className="text-xs font-bold text-slate-500 shrink-0 uppercase tracking-wide flex items-center gap-1.5">
            <PenTool size={13} className="text-amber-600" />
            <span>Or write your own:</span>
          </label>
          <div className="flex gap-2 flex-grow">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Type in Kannada or English (e.g. ರವಿ, ಶಾಲೆ, Amma, Mango)..."
              className="flex-grow bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-800 outline-none transition"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-xs shrink-0"
            >
              Load Custom Word
            </button>
          </div>
        </form>
      </div>

      {/* STEP 2: Full Width Writing Canvas & Interactive Tracing Board */}
      {selectedWord && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col gap-6 w-full">
          
          {/* Giant Display of Selected Word above the Pad */}
          <div className="bg-amber-50/45 p-6 rounded-2xl border border-amber-100/60 flex flex-col md:flex-row items-center justify-between gap-5 w-full">
            <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left w-full">
              {/* Large display card */}
              <div className="min-w-[6rem] h-24 px-6 bg-white border-2 border-amber-200 rounded-3xl flex items-center justify-center text-4xl font-extrabold text-amber-950 shadow-xs select-none whitespace-nowrap">
                {selectedWord.word}
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    CURRENT WORD: {selectedWord.word}
                  </span>
                  <button
                    onClick={() => playTTS(selectedWord.word)}
                    className="p-1.5 rounded-full bg-amber-200/50 hover:bg-amber-200 text-amber-900 transition-colors"
                    title="Pronounce word"
                  >
                    <Volume2 size={15} />
                  </button>
                </div>
                
                {/* Transliterated helper in a giant child-friendly subtitle */}
                <h2 className="text-2xl font-black text-slate-800 mt-2">
                  Pronunciation: <span className="text-amber-900 bg-amber-50 px-3 py-0.5 rounded-lg border border-amber-100">/{selectedWord.transliteration}/</span>
                </h2>
                
                <p className="text-sm text-slate-500 mt-2 font-bold">
                  Meaning: <span className="text-slate-700 italic font-medium">{selectedWord.meaning}</span>
                </p>
              </div>
            </div>

            {/* Tracing Mode Selector Toggle */}
            <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 flex gap-1 shrink-0">
              <button
                onClick={() => setTraceMode('kannada')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  traceMode === 'kannada'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Type size={13} className="text-amber-500" />
                <span>Trace Kannada</span>
              </button>
              
              <button
                onClick={() => setTraceMode('transliteration')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  traceMode === 'transliteration'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <PenTool size={13} className="text-emerald-500" />
                <span>Trace English</span>
              </button>
            </div>
          </div>

          {/* Full-width Tracing canvas */}
          <div className="w-full">
            <PracticeCanvas guideLetter={traceMode === 'kannada' ? selectedWord.word : selectedWord.transliteration} />
          </div>

          {/* Canvas Actions footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-slate-100 pt-5">
            <button
              onClick={triggerSuccessBurst}
              className="flex-grow flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-extrabold transition shadow-md min-h-[52px]"
            >
              <Check size={18} />
              <span>Completed! Excellent (ಮುಗಿಸಿದೆ)</span>
            </button>

            <div className="flex gap-2.5 text-xs text-slate-500 font-bold items-center bg-slate-50 border border-slate-200/60 px-4 py-3 rounded-2xl shadow-2xs">
              <Smile size={16} className="text-amber-500" />
              <span>Great with standard stylus / mouse brush!</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
