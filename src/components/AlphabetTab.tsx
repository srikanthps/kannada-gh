import React, { useState, useEffect } from 'react';
import { vowels, consonants, yogavahas } from '../data/alphabet';
import { LetterItem, WordExample } from '../types';
import PracticeCanvas from './PracticeCanvas';
import { Volume2, ArrowLeft, ArrowRight, Check, Sparkles, Star, Award, BookOpen, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PedagogicalLevel {
  id: number;
  name: string;
  nativeName: string;
  description: string;
  letters: string[]; // Characters in this level
  formingWords: WordExample[];
}

const levelsData: PedagogicalLevel[] = [
  {
    id: 1,
    name: "Level 1: First Nature Words",
    nativeName: "ಹಂತ ೧: ನನ್ನ ಮೊದಲ ಸರಳ ಪದಗಳು",
    description: "Learn basic letters 'ಅ', 'ರ', 'ಸ', 'ಮ' first. These allow kids to write tree (ಮರ) and king (ಅರಸ) immediately!",
    letters: ['ಅ', 'ರ', 'ಸ', 'ಮ'],
    formingWords: [
      { word: 'ಮರ', transliteration: 'Mara', meaning: 'Tree' },
      { word: 'ರಸ', transliteration: 'Rasa', meaning: 'Juice / Taste' },
      { word: 'ಸರ', transliteration: 'Sara', meaning: 'Necklace' },
      { word: 'ಅರಸ', transliteration: 'Arasa', meaning: 'King' }
    ]
  },
  {
    id: 2,
    name: "Level 2: Play & Home Words",
    nativeName: "ಹಂತ ೨: ಆಟ ಮತ್ತು ಮನೆಯ ಪದಗಳು",
    description: "Learn 'ಆ', 'ಕ', 'ಲ', 'ಗ', 'ನ'. These allow you to form beautiful words like play, lotus, and gold ornament!",
    letters: ['ಆ', 'ಕ', 'ಲ', 'ಗ', 'ನ'],
    formingWords: [
      { word: 'ಆಟ', transliteration: 'Aata', meaning: 'Game / Play' },
      { word: 'ಕಮಲ', transliteration: 'Kamala', meaning: 'Lotus' },
      { word: 'ನಗ', transliteration: 'Naga', meaning: 'Jewel / Ornament' },
      { word: 'ಆನೆ', transliteration: 'Aane', meaning: 'Elephant' }
    ]
  },
  {
    id: 3,
    name: "Level 3: Animals & Everyday Things",
    nativeName: "ಹಂತ ೩: ಪ್ರಾಣಿ ಪ್ರಪಂಚ ಮತ್ತು ವಸ್ತುಗಳು",
    description: "Learn 'ಇ', 'ಈ', 'ದ', 'ಹ', 'ಳ', 'ಯ'. Form animal-related words like mouse, day, and swan!",
    letters: ['ಇ', 'ಈ', 'ದ', 'ಹ', 'ಳ', 'ಯ'],
    formingWords: [
      { word: 'ಇಲಿ', transliteration: 'Ili', meaning: 'Mouse / Rat' },
      { word: 'ದಿನ', transliteration: 'Dina', meaning: 'Day' },
      { word: 'ಹಂಸ', transliteration: 'Hamsa', meaning: 'Swan' },
      { word: 'ಮಗಳು', transliteration: 'Magalu', meaning: 'Daughter' }
    ]
  },
  {
    id: 4,
    name: "Level 4: Vowels & Nasals",
    nativeName: "ಹಂತ ೪: ಸ್ವರಗಳು ಮತ್ತು ಅನುಸ್ವಾರಗಳು",
    description: "Learn 'ಉ', 'ಊ', 'ಋ', 'ಎ', 'ಏ', 'ಐ', 'ಒ', 'ಓ', 'ಔ', 'ಅಂ', 'ಅಃ' to complete all vowel sounds.",
    letters: ['ಉ', 'ಊ', 'ಋ', 'ಎ', 'ಏ', 'ಐ', 'ಒ', 'ಓ', 'ಔ', 'ಅಂ', 'ಅಃ'],
    formingWords: [
      { word: 'ಊಟ', transliteration: 'Oota', meaning: 'Meal / Food' },
      { word: 'ಐದು', transliteration: 'Aidu', meaning: 'Five' },
      { word: 'ಋಷಿ', transliteration: 'Rushi', meaning: 'Sage' },
      { word: 'ಓದು', transliteration: 'Oodu', meaning: 'Read' },
      { word: 'ಔಷಧ', transliteration: 'Oushadha', meaning: 'Medicine' }
    ]
  },
  {
    id: 5,
    name: "Level 5: Easy Consonants I",
    nativeName: "ಹಂತ ೫: ಮೃದು ವ್ಯಂಜನಗಳು - ಭಾಗ ೧",
    description: "Learn softer consonants: 'ಖ', 'ಘ', 'ಙ', 'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ'.",
    letters: ['ಖ', 'ಘ', 'ಙ', 'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ'],
    formingWords: [
      { word: 'ಚಮಚ', transliteration: 'Chamacha', meaning: 'Spoon' },
      { word: 'ಛತ್ರಿ', transliteration: 'Chhatri', meaning: 'Umbrella' },
      { word: 'ಜೇನು', transliteration: 'Jeenu', meaning: 'Honey' },
      { word: 'ಖಡ್ಗ', transliteration: 'Khadga', meaning: 'Sword' }
    ]
  },
  {
    id: 6,
    name: "Level 6: Easy Consonants II",
    nativeName: "ಹಂತ ೬: ಮೃದು ವ್ಯಂಜನಗಳು - ಭಾಗ ೨",
    description: "Learn dental and retroflex letters: 'ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ', 'ತ', 'ಥ', 'ಧ'.",
    letters: ['ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ', 'ತ', 'ಥ', 'ಧ'],
    formingWords: [
      { word: 'ಹಣ', transliteration: 'Hana', meaning: 'Money' },
      { word: 'ತಾಯಿ', transliteration: 'Thaayi', meaning: 'Mother' },
      { word: 'ಪಾಠಶಾಲ', transliteration: 'Paathashaala', meaning: 'School' },
      { word: 'ರಥ', transliteration: 'Ratha', meaning: 'Chariot' }
    ]
  },
  {
    id: 7,
    name: "Level 7: Ending Sounds",
    nativeName: "ಹಂತ ೭: ಕೊನೆಯ ವರ್ಗದ ಅಕ್ಷರಗಳು",
    description: "Learn final consonants: 'ಪ', 'ಫ', 'ಬ', 'ಭ', 'ವ', 'ಶ', 'ಷ'.",
    letters: ['ಪ', 'ಫ', 'ಬ', 'ಭ', 'ವ', 'ಶ', 'ಷ'],
    formingWords: [
      { word: 'ಪುಸ್ತಕ', transliteration: 'Pustaka', meaning: 'Book' },
      { word: 'ಫಲಕ', transliteration: 'Phalaka', meaning: 'Board' },
      { word: 'ಭಾರತ', transliteration: 'Bhaaratha', meaning: 'India' },
      { word: 'ವಿಮಾನ', transliteration: 'Vimaana', meaning: 'Aeroplane' }
    ]
  }
];

// All alphabets helper
const allKannadaAlphabets = [
  ...vowels.map(v => v.letter),
  ...yogavahas.map(y => y.letter),
  ...consonants.map(c => c.letter)
];

const vowelLetters = [
  ...vowels.map(v => v.letter),
  ...yogavahas.map(y => y.letter)
];

const consonantLetters = consonants.map(c => c.letter);

// Groups consonants into 5 groups of 5, then groups of 4 for the remaining
const groupedConsonantLetters: string[][] = [];
// First 5 groups of 5
for (let i = 0; i < 5; i++) {
  const start = i * 5;
  if (start < consonantLetters.length) {
    groupedConsonantLetters.push(consonantLetters.slice(start, start + 5));
  }
}
// Then groups of 4 for the remaining
let remainingStart = 25;
while (remainingStart < consonantLetters.length) {
  groupedConsonantLetters.push(consonantLetters.slice(remainingStart, remainingStart + 4));
  remainingStart += 4;
}

export default function AlphabetTab() {
  const [activeLevelIdx, setActiveLevelIdx] = useState<number>(0); // 0 to 6 are levels, 7 is "All Alphabets"
  const [allLettersFilter, setAllLettersFilter] = useState<'all' | 'vowels' | 'consonants'>('all');
  const [selectedGuideItem, setSelectedGuideItem] = useState<string>('ಅ'); // selected letter or word
  const [isWroteCorrectly, setIsWroteCorrectly] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [ttsState, setTtsState] = useState<'idle' | 'playing' | 'error'>('idle');

  // Load the first letter of the level automatically when level changes or Level 8 filter changes
  useEffect(() => {
    if (activeLevelIdx === 7) {
      if (allLettersFilter === 'vowels') {
        setSelectedGuideItem(vowelLetters[0]);
      } else if (allLettersFilter === 'consonants') {
        setSelectedGuideItem(consonantLetters[0]);
      } else {
        setSelectedGuideItem(allKannadaAlphabets[0]);
      }
    } else {
      const currentLevel = levelsData[activeLevelIdx];
      if (currentLevel && currentLevel.letters.length > 0) {
        setSelectedGuideItem(currentLevel.letters[0]);
      }
    }
    setIsWroteCorrectly(false);
  }, [activeLevelIdx, allLettersFilter]);

  const getFilteredLetters = () => {
    if (activeLevelIdx !== 7) return [];
    if (allLettersFilter === 'vowels') return vowelLetters;
    if (allLettersFilter === 'consonants') return consonantLetters;
    return allKannadaAlphabets;
  };

  const findLetterMetadata = (char: string) => {
    const all = [...vowels, ...consonants, ...yogavahas];
    return all.find(item => item.letter === char);
  };

  const playTTS = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    try {
      setTtsState('playing');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'kn-IN';
      const voices = window.speechSynthesis.getVoices();
      const knVoice = voices.find(v => v.lang.toLowerCase().includes('kn') || v.lang.toLowerCase().includes('kannada'));
      if (knVoice) utterance.voice = knVoice;
      utterance.onend = () => setTtsState('idle');
      utterance.onerror = () => setTtsState('idle');
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setTtsState('idle');
    }
  };

  // Speaks pronunciation on guide letter tap
  const handleItemSelect = (item: string) => {
    setSelectedGuideItem(item);
    setIsWroteCorrectly(false);
    playTTS(item);
  };

  const triggerSuccess = () => {
    setShowSparkles(true);
    setIsWroteCorrectly(true);
    playTTS("ಅದ್ಭುತ"); // Wonderful!
    setTimeout(() => {
      setShowSparkles(false);
    }, 1800);
  };

  // Next & Prev Alphabet controls
  const handleNextGuide = () => {
    if (activeLevelIdx === 7) {
      // All alphabets navigation
      const list = getFilteredLetters();
      const currentIdx = list.indexOf(selectedGuideItem);
      if (currentIdx !== -1 && currentIdx < list.length - 1) {
        handleItemSelect(list[currentIdx + 1]);
      }
    } else {
      // Level navigation
      const currentLevel = levelsData[activeLevelIdx];
      const isWord = selectedGuideItem.length > 1;
      
      if (!isWord) {
        const currentIdx = currentLevel.letters.indexOf(selectedGuideItem);
        if (currentIdx !== -1) {
          if (currentIdx < currentLevel.letters.length - 1) {
            handleItemSelect(currentLevel.letters[currentIdx + 1]);
          } else if (currentLevel.formingWords.length > 0) {
            // Jump to first word
            handleItemSelect(currentLevel.formingWords[0].word);
          }
        }
      } else {
        const currentIdx = currentLevel.formingWords.findIndex(w => w.word === selectedGuideItem);
        if (currentIdx !== -1 && currentIdx < currentLevel.formingWords.length - 1) {
          handleItemSelect(currentLevel.formingWords[currentIdx + 1].word);
        }
      }
    }
  };

  const handlePrevGuide = () => {
    if (activeLevelIdx === 7) {
      const list = getFilteredLetters();
      const currentIdx = list.indexOf(selectedGuideItem);
      if (currentIdx > 0) {
        handleItemSelect(list[currentIdx - 1]);
      }
    } else {
      const currentLevel = levelsData[activeLevelIdx];
      const isWord = selectedGuideItem.length > 1;

      if (isWord) {
        const currentIdx = currentLevel.formingWords.findIndex(w => w.word === selectedGuideItem);
        if (currentIdx !== -1) {
          if (currentIdx > 0) {
            handleItemSelect(currentLevel.formingWords[currentIdx - 1].word);
          } else {
            // Jump to last letter of the level
            handleItemSelect(currentLevel.letters[currentLevel.letters.length - 1]);
          }
        }
      } else {
        const currentIdx = currentLevel.letters.indexOf(selectedGuideItem);
        if (currentIdx > 0) {
          handleItemSelect(currentLevel.letters[currentIdx - 1]);
        }
      }
    }
  };

  // Determine disable states for navigation
  const isFirstGuide = () => {
    if (activeLevelIdx === 7) {
      const list = getFilteredLetters();
      return list.indexOf(selectedGuideItem) === 0;
    }
    const currentLevel = levelsData[activeLevelIdx];
    return selectedGuideItem === currentLevel?.letters[0];
  };

  const isLastGuide = () => {
    if (activeLevelIdx === 7) {
      const list = getFilteredLetters();
      return list.indexOf(selectedGuideItem) === list.length - 1;
    }
    const currentLevel = levelsData[activeLevelIdx];
    if (currentLevel?.formingWords && currentLevel.formingWords.length > 0) {
      return selectedGuideItem === currentLevel.formingWords[currentLevel.formingWords.length - 1].word;
    }
    return selectedGuideItem === currentLevel?.letters[currentLevel.letters.length - 1];
  };

  const activeLevel = levelsData[activeLevelIdx];
  const activeLetterMetadata = findLetterMetadata(selectedGuideItem);

  return (
    <div className="flex flex-col gap-6 relative w-full">
      {/* Sparkles screen reward overlay */}
      <AnimatePresence>
        {showSparkles && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xs rounded-3xl"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-amber-500 mb-4"
            >
              <Sparkles size={100} className="fill-amber-400" />
            </motion.div>
            <h3 className="text-4xl font-black text-amber-950 tracking-tight drop-shadow-sm text-center">
              ಅದ್ಭುತ! (Wonderful!) 🎉
            </h3>
            <p className="text-lg font-bold text-emerald-700 mt-2">Beautifully Written! Keep going!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Touch-Friendly Level Navigation Roadmap Track */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block mb-3 text-center">
          SCHOOL SYLLABUS ROADMAP (ಕಲಿಕಾ ಹಂತಗಳು)
        </span>
        <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2 scrollbar-none items-center justify-start lg:justify-center">
          {levelsData.map((level, idx) => (
            <button
              key={level.id}
              onClick={() => setActiveLevelIdx(idx)}
              className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all shrink-0 min-h-[44px] border ${
                activeLevelIdx === idx
                  ? 'bg-amber-500 border-amber-600 text-white shadow-md scale-[1.03]'
                  : 'bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Star size={14} className={activeLevelIdx === idx ? "fill-white" : "text-amber-500"} />
              <span>Lvl {level.id}</span>
            </button>
          ))}
          <button
            onClick={() => setActiveLevelIdx(7)}
            className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all shrink-0 min-h-[44px] border ${
              activeLevelIdx === 7
                ? 'bg-[#de2910] border-red-700 text-white shadow-md scale-[1.03]'
                : 'bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award size={14} className={activeLevelIdx === 7 ? "fill-white" : "text-[#de2910]"} />
            <span>🏆 All Letters</span>
          </button>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Letters / Word list */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col gap-6">
          
          {activeLevelIdx !== 7 ? (
            /* Levels 1 - 7 View */
            <>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">
                  {activeLevel.name}
                </span>
                <h2 className="text-xl font-extrabold text-slate-800 mt-2">{activeLevel.nativeName}</h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{activeLevel.description}</p>
              </div>

              {/* Group Letter Cards */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tap a Letter to trace:
                </span>
                <div className="grid grid-cols-4 gap-3">
                  {activeLevel.letters.map((char) => {
                    const isSelected = selectedGuideItem === char;
                    return (
                      <button
                        key={char}
                        onClick={() => handleItemSelect(char)}
                        className={`aspect-square rounded-2xl flex flex-col justify-center items-center transition-all border p-3 min-h-[70px] ${
                          isSelected
                            ? 'bg-amber-500 border-amber-600 text-white shadow-md ring-2 ring-amber-400 ring-offset-1 scale-[1.03]'
                            : 'bg-slate-50 border-slate-200/70 text-slate-800 hover:bg-amber-50 hover:border-amber-300'
                        }`}
                      >
                        <span className="text-3xl font-black">{char}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Forming Words (Reading / Writing area below alphabets) */}
              {activeLevel.formingWords && activeLevel.formingWords.length > 0 && (
                <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tap a Forming Word to trace &amp; practice reading:
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {activeLevel.formingWords.map((item) => {
                      const isSelected = selectedGuideItem === item.word;
                      return (
                        <button
                          key={item.word}
                          onClick={() => handleItemSelect(item.word)}
                          className={`flex flex-col p-3 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'bg-emerald-500 border-emerald-600 text-white shadow-md scale-[1.02]'
                              : 'bg-emerald-50/20 border-emerald-100/50 hover:bg-emerald-50 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 justify-between">
                            <span className="text-base font-black tracking-wide">{item.word}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {item.meaning}
                            </span>
                          </div>
                          <span className={`text-[10px] font-mono mt-1 ${
                            isSelected ? 'text-emerald-100' : 'text-slate-400'
                          }`}>
                            /{item.transliteration}/
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Level 8 - Complete Aksharamale Playground View */
            <>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#de2910] bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg">
                  Level 8: Master Playground
                </span>
                <h2 className="text-xl font-extrabold text-slate-800 mt-2">All Alphabets (ಅಕ್ಷರಮಾಲೆ)</h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Select any of the 49 traditional Kannada alphabets to trace and refine your stylus handwriting.
                </p>
              </div>

              {/* Vowel / Consonant / All Selection Tabs */}
              <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200/60 flex gap-1 w-full">
                <button
                  onClick={() => setAllLettersFilter('all')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all min-h-[38px] ${
                    allLettersFilter === 'all'
                      ? 'bg-white text-[#de2910] shadow-sm border border-slate-200/30'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All (ಎಲ್ಲಾ)
                </button>
                <button
                  onClick={() => setAllLettersFilter('vowels')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all min-h-[38px] ${
                    allLettersFilter === 'vowels'
                      ? 'bg-white text-[#de2910] shadow-sm border border-slate-200/30'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Vowels (ಸ್ವರಗಳು)
                </button>
                <button
                  onClick={() => setAllLettersFilter('consonants')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all min-h-[38px] ${
                    allLettersFilter === 'consonants'
                      ? 'bg-white text-[#de2910] shadow-sm border border-slate-200/30'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Consonants (ವ್ಯಂಜನಗಳು)
                </button>
              </div>

              <div className="flex flex-col gap-5 max-h-[360px] overflow-y-auto pr-1">
                {/* Vowels Grid */}
                {(allLettersFilter === 'all' || allLettersFilter === 'vowels') && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      Vowels &amp; Yogavahas (ಸ್ವರಗಳು - ೧೫):
                    </span>
                    <div className="grid grid-cols-5 gap-2">
                      {vowelLetters.map((char) => {
                        const isSelected = selectedGuideItem === char;
                        return (
                          <button
                            key={char}
                            onClick={() => handleItemSelect(char)}
                            className={`aspect-square rounded-xl flex items-center justify-center transition-all border text-lg font-black min-h-[48px] ${
                              isSelected
                                ? 'bg-[#de2910] border-red-600 text-white shadow-sm ring-2 ring-red-400 ring-offset-1'
                                : 'bg-slate-50 border-slate-200/60 text-slate-800 hover:bg-red-50/50 hover:border-red-200'
                            }`}
                          >
                            {char}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Consonants Groups */}
                {(allLettersFilter === 'all' || allLettersFilter === 'consonants') && (
                  <div className="flex flex-col gap-4">
                    <div className="border-t border-slate-100 pt-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                        Consonants (ವ್ಯಂಜನಗಳು - ೩೪):
                      </span>
                      <div className="flex flex-col gap-3.5">
                        {groupedConsonantLetters.map((group, groupIdx) => {
                          const isGroupOf5 = groupIdx < 5;
                          return (
                            <div key={groupIdx} className="flex flex-col gap-1 bg-slate-50/30 p-2 rounded-xl border border-slate-100">
                              <span className="text-[9px] font-bold text-amber-800/80 uppercase tracking-wider">
                                {groupIdx < 5 ? `Classified Group ${groupIdx + 1} (ವರ್ಗ ${groupIdx + 1})` : groupIdx < 7 ? `Unclassified Group ${groupIdx - 4} (ಅವರ್ಗೀಯ)` : 'Special Letter'}
                              </span>
                              <div className={`grid ${isGroupOf5 ? 'grid-cols-5' : 'grid-cols-4'} gap-2`}>
                                {group.map((char) => {
                                  const isSelected = selectedGuideItem === char;
                                  return (
                                    <button
                                      key={char}
                                      onClick={() => handleItemSelect(char)}
                                      className={`aspect-square rounded-xl flex items-center justify-center transition-all border text-lg font-black min-h-[48px] ${
                                        isSelected
                                          ? 'bg-[#de2910] border-red-600 text-white shadow-sm ring-2 ring-red-400 ring-offset-1'
                                          : 'bg-slate-50 border-slate-200/60 text-slate-800 hover:bg-red-50/50 hover:border-red-200'
                                      }`}
                                    >
                                      {char}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Guided pronunciation helper */}
          {activeLetterMetadata && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
              <button
                onClick={() => playTTS(activeLetterMetadata.letter)}
                className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center hover:bg-amber-200 shrink-0 transition"
                title="Speak letter"
              >
                <Volume2 size={18} />
              </button>
              <div className="text-xs">
                <div className="font-bold text-slate-800">
                  Pronunciation: {activeLetterMetadata.pronunciation}
                </div>
                <div className="text-slate-400 font-medium font-mono mt-0.5">
                  Type: {activeLetterMetadata.type} ({activeLetterMetadata.name})
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Giant Writing Pad (Scribble area) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col gap-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                  Trace Area (ಬರೆಯಿರಿ)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => playTTS(selectedGuideItem)}
                  className="p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 text-xs font-bold transition flex items-center gap-1"
                >
                  <Volume2 size={13} />
                  <span>Pronounce Guide</span>
                </button>
              </div>
            </div>

            {/* Integration of Canvas Board */}
            <PracticeCanvas guideLetter={selectedGuideItem} />

            {/* Stylus friendly validation/navigation controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-2">
              <button
                onClick={triggerSuccess}
                className="flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-extrabold transition shadow-md min-h-[52px]"
              >
                <Check size={18} />
                <span>Good! Correct (ಸರಿ)</span>
              </button>

              <div className="flex gap-2.5">
                <button
                  onClick={handlePrevGuide}
                  disabled={isFirstGuide()}
                  className={`flex-1 sm:flex-initial px-5 py-4 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-1.5 min-h-[52px] min-w-[100px] border ${
                    isFirstGuide()
                      ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 active:bg-slate-50'
                  }`}
                >
                  <ArrowLeft size={14} />
                  <span>Prev</span>
                </button>

                <button
                  onClick={handleNextGuide}
                  disabled={isLastGuide()}
                  className={`flex-1 sm:flex-initial px-5 py-4 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-1.5 min-h-[52px] min-w-[100px] border ${
                    isLastGuide()
                      ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                      : 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600 active:scale-95 shadow-sm'
                  }`}
                >
                  <span>Next</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

          </div>

          {/* Child-friendly helpful guideline cards */}
          <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-100 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
            <ThumbsUp size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold block">Stylus Practice Tips:</span>
              <p className="mt-0.5">
                Set brush size above. Use your stylus/pen to trace the soft template. Tap <strong>"Good! Correct (ಸರಿ)"</strong> once you draw it beautifully, and we will sound a magical congratulations!
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
